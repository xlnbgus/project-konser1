import { Link, useLocation } from 'react-router-dom'

export default function PaymentSuccessPage() {
  const location = useLocation()
  const state = location.state || {}
  const eventTitle = state.eventTitle || 'Tiket Konser'
  const paymentLabel = state.paymentLabel || 'Pembayaran dipilih'
  const total = state.total ?? 0
  const orderId = state.orderId || 'TRX-001'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 560, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, padding: '36px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 18 }}>
          ✅
        </div>
        <h1 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 800, marginBottom: 8 }}>Pembayaran Berhasil!</h1>
        <p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: 24 }}>
          Tiket Anda sudah siap. Detail pesanan telah dikonfirmasi dan akan dikirimkan ke email Anda.
        </p>

        <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <div style={{ color: '#a78bfa', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Event</div>
            <div style={{ color: '#f8fafc', fontWeight: 700 }}>{eventTitle}</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Metode</div>
            <div style={{ color: '#f8fafc', fontWeight: 700 }}>{paymentLabel}</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Total</div>
            <div style={{ color: '#f8fafc', fontWeight: 700 }}>Rp{total.toLocaleString('id-ID')}</div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Nomor Pesanan</div>
            <div style={{ color: '#f8fafc', fontWeight: 700 }}>{orderId}</div>
          </div>
        </div>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
