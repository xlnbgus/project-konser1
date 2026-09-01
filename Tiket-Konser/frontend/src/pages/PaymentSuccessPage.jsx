import { Link, useLocation } from 'react-router-dom'

const formatPrice = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`

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
