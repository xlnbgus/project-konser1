import { Link, useLocation } from 'react-router-dom'

const formatPrice = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`

// ─── PDF Generator (lazy-loaded) ────────────────────────────────────────────
async function downloadStruk({ eventTitle, paymentLabel, total, subtotal, discountAmount, quantity, promoCode, orderId }) {
  const { jsPDF } = await import('jspdf')

  // Ukuran A5 portrait standar
  const W   = 148
  const H   = 210
  const doc = new jsPDF({ unit: 'mm', format: [W, H] })

  // ── warna helper ──
  const rgb = (hex) => [
    parseInt(hex.slice(1,3),16),
    parseInt(hex.slice(3,5),16),
    parseInt(hex.slice(5,7),16),
  ]
  const fill  = (hex) => doc.setFillColor(...rgb(hex))
  const draw  = (hex) => doc.setDrawColor(...rgb(hex))
  const color = (hex) => doc.setTextColor(...rgb(hex))
  const B     = ()    => doc.setFont('helvetica', 'bold')
  const N     = ()    => doc.setFont('helvetica', 'normal')
  const sz    = (n)   => doc.setFontSize(n)
  const lw    = (n)   => doc.setLineWidth(n)
  const t     = (str, x, y, opts={}) => doc.text(String(str ?? ''), x, y, opts)

  const ML = 16   // margin kiri
  const MR = W - ML // margin kanan
  const CW = MR - ML

  // ════════════════════════════════════════════════
  // 1. HEADER — solid ungu penuh tanpa shimmer
  // ════════════════════════════════════════════════
  fill('#6d28d9')
  doc.rect(0, 0, W, 36, 'F')

  // Nama brand
  B(); sz(18); color('#ffffff')
  t('KonserOjol', W / 2, 15, { align: 'center' })

  // Subtitle
  N(); sz(9); color('#ddd6fe')
  t('Struk Pembelian Tiket', W / 2, 23, { align: 'center' })

  sz(7.5); color('#c4b5fd')
  t('konserojol.id', W / 2, 30, { align: 'center' })

  // ════════════════════════════════════════════════
  // 2. BADGE SUKSES — teks ASCII, bukan emoji/unicode
  // ════════════════════════════════════════════════
  fill('#f0fdf4')
  draw('#86efac'); lw(0.4)
  doc.roundedRect(ML, 41, CW, 11, 2, 2, 'FD')

  B(); sz(9.5); color('#166534')
  t('[ OK ]  Pembayaran Berhasil', W / 2, 48.5, { align: 'center' })

  // ════════════════════════════════════════════════
  // 3. NOMOR PESANAN
  // ════════════════════════════════════════════════
  fill('#f5f3ff')
  draw('#ddd6fe'); lw(0.3)
  doc.roundedRect(ML, 56, CW, 10, 2, 2, 'FD')

  N(); sz(7.5); color('#7c3aed')
  t('No. Pesanan', ML + 4, 62.5)
  B(); sz(8.5); color('#4c1d95')
  t(String(orderId), MR - 4, 62.5, { align: 'right' })

  // ════════════════════════════════════════════════
  // 4. DETAIL PEMESANAN
  // ════════════════════════════════════════════════
  let y = 72

  // section header helper
  const secHead = (label, yy) => {
    fill('#ede9fe')
    doc.rect(ML, yy, CW, 6.5, 'F')
    B(); sz(7); color('#5b21b6')
    t(label, ML + 3, yy + 4.8)
    return yy + 10
  }

  // row helper
  const row = (label, val, yy, valColor = '#111827') => {
    N(); sz(8); color('#6b7280')
    t(label, ML + 3, yy)
    B(); sz(8); color(valColor)
    // wrap value jika terlalu panjang
    const maxW = CW - 6
    const lines = doc.splitTextToSize(String(val ?? ''), maxW * 0.5)
    t(lines[0] || '', MR - 3, yy, { align: 'right' })
    draw('#e5e7eb'); lw(0.15)
    doc.line(ML, yy + 2.5, MR, yy + 2.5)
    return yy + 8
  }

  y = secHead('DETAIL PEMESANAN', y)
  y = row('Event', eventTitle, y)
  y = row('Jumlah Tiket', `${quantity} tiket`, y)
  y = row('Metode Pembayaran', paymentLabel, y)

  y += 4

  // ════════════════════════════════════════════════
  // 5. RINCIAN HARGA
  // ════════════════════════════════════════════════
  y = secHead('RINCIAN HARGA', y)
  y = row(`Subtotal (${quantity} tiket)`, formatPrice(subtotal), y)

  if (discountAmount > 0) {
    const discLabel = promoCode ? `Diskon (${promoCode})` : 'Diskon'
    y = row(discLabel, `- ${formatPrice(discountAmount)}`, y, '#15803d')
  }

  // ════════════════════════════════════════════════
  // 6. KOTAK TOTAL
  // ════════════════════════════════════════════════
  y += 2
  fill('#f5f3ff')
  draw('#a78bfa'); lw(0.6)
  doc.roundedRect(ML, y, CW, 13, 2, 2, 'FD')

  B(); sz(9.5); color('#4c1d95')
  t('Total Dibayar', ML + 5, y + 9)

  sz(11); color('#7c3aed')
  t(formatPrice(total), MR - 5, y + 9, { align: 'right' })

  y += 18

  // ════════════════════════════════════════════════
  // 7. GARIS PUTUS-PUTUS (perforasi)
  // ════════════════════════════════════════════════
  draw('#d1d5db'); lw(0.3)
  doc.setLineDashPattern([2, 2], 0)
  doc.line(ML, y, MR, y)
  doc.setLineDashPattern([], 0)
  y += 6

  // ════════════════════════════════════════════════
  // 8. FOOTER
  // ════════════════════════════════════════════════
  const now     = new Date()
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  }) + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  N(); sz(7); color('#9ca3af')
  t(`Dicetak: ${dateStr}`, W / 2, y, { align: 'center' })
  y += 5
  sz(7.5); color('#6b7280')
  t('Terima kasih telah memesan tiket di KonserOjol!', W / 2, y, { align: 'center' })
  y += 4.5
  sz(7); color('#9ca3af')
  t('Harap simpan struk ini sebagai bukti pembelian Anda.', W / 2, y, { align: 'center' })

  // ── strip bawah ──
  fill('#6d28d9')
  doc.rect(0, H - 5, W, 5, 'F')

  const fileName = `Struk_${String(orderId).replace('#', '')}_KonserOjol.pdf`
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
