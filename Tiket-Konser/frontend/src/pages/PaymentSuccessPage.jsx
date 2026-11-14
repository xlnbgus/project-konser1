import { Link, useLocation } from 'react-router-dom'

const formatPrice = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`

// ─── PDF Generator (lazy-loaded) ────────────────────────────────────────────
async function downloadStruk({ eventTitle, paymentLabel, total, subtotal, discountAmount, quantity, promoCode, orderId }) {
  // lazy import agar tidak masuk bundle utama
  const { jsPDF } = await import('jspdf')

  const PAGE_W  = 148   // A5 landscape-ish
  const PAGE_H  = 210
  const doc     = new jsPDF({ unit: 'mm', format: [PAGE_W, PAGE_H] })
  const L       = 14    // left margin
  const R       = PAGE_W - L  // right edge
  const CW      = R - L  // content width

  // ── helpers ──
  const setColor  = (hex)  => { const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16); doc.setTextColor(r,g,b) }
  const setFill   = (hex)  => { const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16); doc.setFillColor(r,g,b) }
  const setDraw   = (hex)  => { const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16); doc.setDrawColor(r,g,b) }
  const text      = (str, x, y, opts = {}) => doc.text(String(str), x, y, opts)
  const bold      = () => doc.setFont('helvetica', 'bold')
  const normal    = () => doc.setFont('helvetica', 'normal')
  const size      = (n) => doc.setFontSize(n)

  // ── HEADER BAR ──
  setFill('#7c3aed')
  doc.rect(0, 0, PAGE_W, 28, 'F')

  // gradient shimmer strip
  setFill('#9f5ef5')
  doc.rect(0, 0, PAGE_W * 0.4, 28, 'F')

  // Brand name
  bold(); size(16); setColor('#ffffff')
  text('KonserOjol', PAGE_W / 2, 11, { align: 'center' })

  normal(); size(8); setColor('#e0d4ff')
  text('Struk Pembelian Tiket', PAGE_W / 2, 18, { align: 'center' })

  size(7); setColor('#c4b5fd')
  text('konserojol.id', PAGE_W / 2, 24, { align: 'center' })

  // ── SUCCESS PILL ──
  setFill('#f0fdf4')
  doc.roundedRect(L, 33, CW, 12, 2, 2, 'F')
  setDraw('#86efac'); doc.setLineWidth(0.3)
  doc.roundedRect(L, 33, CW, 12, 2, 2, 'S')

  bold(); size(9); setColor('#15803d')
  text('✓  Pembayaran Berhasil', PAGE_W / 2, 41, { align: 'center' })

  // ── ORDER ID CHIP ──
  setFill('#f5f3ff')
  doc.roundedRect(L, 49, CW, 10, 2, 2, 'F')
  normal(); size(7); setColor('#6b21a8')
  text('No. Pesanan', L + 3, 55.5)
  bold(); size(8); setColor('#4c1d95')
  text(orderId, R - 3, 55.5, { align: 'right' })

  // ── SECTION: DETAIL ──
  let y = 65

  const sectionBar = (label, yPos) => {
    setFill('#f3f4f6')
    doc.rect(L, yPos, CW, 7, 'F')
    bold(); size(7); setColor('#374151')
    text(label, L + 3, yPos + 5)
    return yPos + 11
  }

  const row = (label, value, yPos, opts = {}) => {
    normal(); size(8); setColor(opts.labelColor || '#6b7280')
    text(label, L + 2, yPos)
    bold(); size(8); setColor(opts.valueColor || '#111827')
    text(value, R - 2, yPos, { align: 'right' })
    // faint divider
    setDraw('#e5e7eb'); doc.setLineWidth(0.2)
    doc.line(L, yPos + 2.5, R, yPos + 2.5)
    return yPos + 8
  }

  // Detail section
  y = sectionBar('DETAIL PEMESANAN', y)
  y = row('Event', eventTitle, y)
  y = row('Jumlah Tiket', `${quantity} tiket`, y)
  y = row('Metode Pembayaran', paymentLabel, y)

  y += 3

  // Harga section
  y = sectionBar('RINCIAN HARGA', y)
  y = row(`Subtotal (${quantity} tiket)`, formatPrice(subtotal), y)

  if (discountAmount > 0) {
    const discLabel = `Diskon${promoCode ? ` — ${promoCode}` : ''}`
    y = row(discLabel, `- ${formatPrice(discountAmount)}`, y, { valueColor: '#15803d', labelColor: '#15803d' })
  }

  // ── TOTAL BOX ──
  y += 2
  setFill('#faf5ff')
  doc.roundedRect(L, y, CW, 14, 2, 2, 'F')
  setDraw('#c4b5fd'); doc.setLineWidth(0.5)
  doc.roundedRect(L, y, CW, 14, 2, 2, 'S')

  bold(); size(9); setColor('#374151')
  text('Total Dibayar', L + 4, y + 9)

  size(11); setColor('#6d28d9')
  text(formatPrice(total), R - 4, y + 9, { align: 'right' })

  y += 20

  // ── BARCODE-LIKE DECORATION ──
  setFill('#e5e7eb')
  for (let i = 0; i < 40; i++) {
    const bw = i % 3 === 0 ? 1.5 : 0.7
    doc.rect(L + i * 2.8, y, bw, 8, 'F')
  }
  y += 12

  // ── FOOTER ──
  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  size(7); normal(); setColor('#9ca3af')
  text(`Dicetak: ${dateStr}`, PAGE_W / 2, y, { align: 'center' })
  y += 5
  text('Terima kasih telah memesan tiket di KonserOjol!', PAGE_W / 2, y, { align: 'center' })
  y += 4
  text('Simpan struk ini sebagai bukti pembelian Anda.', PAGE_W / 2, y, { align: 'center' })

  // bottom accent
  setFill('#7c3aed')
  doc.rect(0, PAGE_H - 5, PAGE_W, 5, 'F')

  const fileName = `Struk_${orderId.replace('#', '')}_KonserOjol.pdf`
  doc.save(fileName)
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PaymentSuccessPage() {
  const location = useLocation()
  const state = location.state || {}

  const eventTitle     = state.eventTitle     || 'Tiket Konser'
  const paymentLabel   = state.paymentLabel   || 'Pembayaran dipilih'
  const total          = Number(state.total   ?? 0)
  const subtotal       = Number(state.subtotal ?? total)
  const discountAmount = Number(state.discountAmount ?? 0)
  const quantity       = Number(state.quantity ?? 1)
  const promoCode      = state.promoCode      || null
  const orderId        = state.orderId        ? `#${state.orderId}` : 'TRX-001'

  const handleDownload = () => {
    downloadStruk({ eventTitle, paymentLabel, total, subtotal, discountAmount, quantity, promoCode, orderId })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07070e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* bg glow */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: '#7c3aed', filter: 'blur(140px)', opacity: 0.07, pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: '40px 36px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Icon */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, marginBottom: 20,
            boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
          }}>✓</div>

          <h1 style={{
            color: '#fff', fontSize: '1.65rem', fontWeight: 800,
            marginBottom: 8, fontFamily: 'Poppins, sans-serif',
          }}>
            Pembayaran Berhasil!
          </h1>
          <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 28, fontSize: '0.9rem' }}>
            Tiket kamu sudah dipesan. Simpan nomor pesanan di bawah sebagai bukti pembelian.
          </p>

          {/* Detail rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            <DetailRow label="Event" value={eventTitle} accent />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <DetailRow label="Jumlah Tiket" value={`${quantity} tiket`} />
              <DetailRow label="Metode" value={paymentLabel} />
            </div>

            {/* Price breakdown */}
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                Rincian Harga
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <PriceRow label={`Subtotal (${quantity} tiket)`} value={formatPrice(subtotal)} />
                {discountAmount > 0 && (
                  <PriceRow
                    label={`Diskon${promoCode ? ` (${promoCode})` : ''}`}
                    value={`− ${formatPrice(discountAmount)}`}
                    green
                  />
                )}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Total Dibayar</span>
                  <span style={{
                    fontWeight: 800, fontSize: '1.1rem',
                    background: 'linear-gradient(135deg,#a78bfa,#ec4899)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <DetailRow label="Nomor Pesanan" value={orderId} mono />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              to="/"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '13px 16px', borderRadius: 12,
                background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
                boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,58,237,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.35)' }}
            >
              Kembali ke Beranda
            </Link>

            <button
              onClick={handleDownload}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: '#e2e8f0', fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, background 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.11)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Struk
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, color: '#1f2937', fontSize: '0.72rem' }}>
          KonserOjol · Terima kasih sudah memesan 🎵
        </p>
      </div>
    </div>
  )
}

function DetailRow({ label, value, accent, mono }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 12,
      background: accent ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.04)',
      border: accent ? '1px solid rgba(124,58,237,0.22)' : '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        color: accent ? '#a78bfa' : '#6b7280',
        fontSize: '0.7rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem',
        fontFamily: mono ? 'monospace' : 'inherit',
        letterSpacing: mono ? '0.05em' : 'inherit',
      }}>
        {value}
      </div>
    </div>
  )
}

function PriceRow({ label, value, green }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{label}</span>
      <span style={{ color: green ? '#4ade80' : '#cbd5e1', fontSize: '0.82rem', fontWeight: 600 }}>{value}</span>
    </div>
  )
}
