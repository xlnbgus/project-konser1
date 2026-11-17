import { Link, useLocation } from 'react-router-dom'

const formatPrice = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`

async function downloadStruk({ eventTitle, paymentLabel, total, subtotal, discountAmount, quantity, promoCode, orderId }) {
  const { jsPDF } = await import('jspdf')

  const W = 148
  const H = 210
  const doc = new jsPDF({ unit: 'mm', format: [W, H] })

  const rgb = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
  const fill  = (hex) => doc.setFillColor(...rgb(hex))
  const draw  = (hex) => doc.setDrawColor(...rgb(hex))
  const color = (hex) => doc.setTextColor(...rgb(hex))
  const B = () => doc.setFont('helvetica', 'bold')
  const N = () => doc.setFont('helvetica', 'normal')
  const sz = (n) => doc.setFontSize(n)
  const lw = (n) => doc.setLineWidth(n)
  const t = (str, x, y, opts = {}) => doc.text(String(str ?? ''), x, y, opts)

  const ML = 16
  const MR = W - ML
  const CW = MR - ML

  // HEADER
  fill('#111318')
  doc.rect(0, 0, W, 36, 'F')
  fill('#D95D39')
  doc.rect(0, 0, 3, 36, 'F')

  B(); sz(16); color('#F5F3EE')
  t('KonserKu', W / 2, 14, { align: 'center' })
  N(); sz(8); color('#9095A1')
  t('Struk Pembelian Tiket', W / 2, 22, { align: 'center' })
  sz(7); color('#6B6E7A')
  t('konserku.id', W / 2, 29, { align: 'center' })

  // BADGE SUKSES
  fill('#f0fdf4')
  draw('#86efac'); lw(0.4)
  doc.roundedRect(ML, 41, CW, 11, 2, 2, 'FD')
  B(); sz(9.5); color('#166534')
  t('Pembayaran Berhasil', W / 2, 48.5, { align: 'center' })

  // NOMOR PESANAN
  fill('#f8f8f6')
  draw('#e0ddd8'); lw(0.3)
  doc.roundedRect(ML, 56, CW, 10, 2, 2, 'FD')
  N(); sz(7.5); color('#D95D39')
  t('No. Pesanan', ML + 4, 62.5)
  B(); sz(8.5); color('#111318')
  t(String(orderId), MR - 4, 62.5, { align: 'right' })

  // DETAIL
  let y = 72

  const secHead = (label, yy) => {
    fill('#f5f3ee')
    doc.rect(ML, yy, CW, 6.5, 'F')
    B(); sz(7); color('#D95D39')
    t(label, ML + 3, yy + 4.8)
    return yy + 10
  }

  const row = (label, val, yy, valColor = '#111318') => {
    N(); sz(8); color('#6B6E7A')
    t(label, ML + 3, yy)
    B(); sz(8); color(valColor)
    const lines = doc.splitTextToSize(String(val ?? ''), CW * 0.5)
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

  y = secHead('RINCIAN HARGA', y)
  y = row(`Subtotal (${quantity} tiket)`, formatPrice(subtotal), y)
  if (discountAmount > 0) {
    const discLabel = promoCode ? `Diskon (${promoCode})` : 'Diskon'
    y = row(discLabel, `- ${formatPrice(discountAmount)}`, y, '#15803d')
  }

  y += 2
  fill('#fff8f5')
  draw('#D95D39'); lw(0.6)
  doc.roundedRect(ML, y, CW, 13, 2, 2, 'FD')
  B(); sz(9.5); color('#111318')
  t('Total Dibayar', ML + 5, y + 9)
  sz(11); color('#D95D39')
  t(formatPrice(total), MR - 5, y + 9, { align: 'right' })
  y += 18

  draw('#d1d5db'); lw(0.3)
  doc.setLineDashPattern([2, 2], 0)
  doc.line(ML, y, MR, y)
  doc.setLineDashPattern([], 0)
  y += 6

  const now = new Date()
  const dateStr =
    now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) +
    '  ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  N(); sz(7); color('#9ca3af')
  t(`Dicetak: ${dateStr}`, W / 2, y, { align: 'center' })
  y += 5; sz(7.5); color('#6b7280')
  t('Terima kasih telah memesan tiket di KonserKu!', W / 2, y, { align: 'center' })
  y += 4.5; sz(7); color('#9ca3af')
  t('Simpan struk ini sebagai bukti pembelian Anda.', W / 2, y, { align: 'center' })

  fill('#111318')
  doc.rect(0, H - 5, W, 5, 'F')
  fill('#D95D39')
  doc.rect(0, H - 5, 3, 5, 'F')

  const fileName = `Struk_${String(orderId).replace('#', '')}_KonserKu.pdf`
  doc.save(fileName)
}

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
      background: '#F4F5F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Manrope', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#0066CC' }} />

      <div style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 1 }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
          padding: '36px 32px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
        }}>
          {/* Success icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: '#D1FAE5',
            border: '1px solid #A7F3D0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 style={{
            color: '#111827', fontSize: '1.5rem', fontWeight: 700,
            marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em',
          }}>
            Pembayaran Berhasil
          </h1>
          <p style={{ color: '#4B5563', lineHeight: 1.7, marginBottom: 28, fontSize: '0.875rem' }}>
            Tiket kamu sudah dipesan. Simpan nomor pesanan sebagai bukti pembelian resmi.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <DetailRow label="Event" value={eventTitle} accent />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <DetailRow label="Jumlah Tiket" value={`${quantity} tiket`} />
              <DetailRow label="Metode" value={paymentLabel} />
            </div>

            {/* Price summary */}
            <div style={{
              padding: '14px 16px', borderRadius: 9,
              background: '#F9FAFB', border: '1px solid #E5E7EB',
            }}>
              <div style={{ color: '#6B6E7A', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif" }}>
                Rincian Harga
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#4B5563' }}>Subtotal ({quantity} tiket)</span>
                  <span style={{ color: '#111827' }}>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#059669' }}>Diskon{promoCode ? ` (${promoCode})` : ''}</span>
                    <span style={{ color: '#059669' }}>- {formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ height: 1, background: '#E5E7EB', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#111827', fontWeight: 700, fontSize: '0.9rem' }}>Total Dibayar</span>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0066CC', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <DetailRow label="Nomor Pesanan" value={orderId} mono />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              to="/"
              className="btn-primary"
              style={{ flex: 1, textAlign: 'center', padding: '12px 16px', fontSize: '0.875rem' }}
            >
              Kembali ke Beranda
            </Link>
            <button
              onClick={handleDownload}
              className="btn-outline"
              style={{ flex: 1, padding: '12px 16px', fontSize: '0.875rem' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Struk
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, color: '#6B6E7A', fontSize: '0.72rem' }}>
          KonserKu · Terima kasih sudah memesan
        </p>
      </div>
    </div>
  )
}

function DetailRow({ label, value, accent, mono }) {
  return (
    <div style={{
      padding: '11px 14px', borderRadius: 8,
      background: accent ? '#EFF6FF' : '#F9FAFB',
      border: accent ? '1px solid #BFDBFE' : '1px solid #E5E7EB',
    }}>
      <div style={{
        color: accent ? '#0066CC' : '#6B6E7A',
        fontSize: '0.68rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        {label}
      </div>
      <div style={{
        color: '#111827', fontWeight: 700, fontSize: '0.9rem',
        fontFamily: mono ? 'monospace' : 'inherit',
        letterSpacing: mono ? '0.05em' : 'inherit',
      }}>
        {value}
      </div>
    </div>
  )
}
