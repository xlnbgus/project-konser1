import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const formatPrice = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`

export default function QrisConfirmPage() {
  const [params] = useSearchParams()
  const eventTitle = params.get('event') || 'Tiket Konser'
  const total      = Number(params.get('total') || 0)
  const ref        = params.get('ref') || '-'
  const [countdown, setCountdown] = useState(600)

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(countdown / 60)).padStart(2, '0')
  const ss = String(countdown % 60).padStart(2, '0')

  return (
    <div style={{
      minHeight: '100vh', background: '#07070e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: '36px 28px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, margin: '0 auto 20px',
          boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
        }}>🎵</div>

        <h1 style={{
          color: '#fff', fontSize: '1.35rem', fontWeight: 800,
          marginBottom: 8, fontFamily: 'Poppins, sans-serif',
        }}>
          Konfirmasi Pembayaran
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 24 }}>
          Kamu membuka halaman ini dari QR KonserOjol. Ini adalah halaman konfirmasi demo — pembayaran tidak diproses secara nyata.
        </p>

        {/* Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, textAlign: 'left' }}>
          <Row label="Event" value={eventTitle} accent />
          <Row label="Total" value={formatPrice(total)} />
          <Row label="Referensi" value={ref} mono />
        </div>

        {/* Countdown */}
        <div style={{
          padding: '14px', borderRadius: 14, marginBottom: 24,
          background: countdown > 0 ? 'rgba(124,58,237,0.1)' : 'rgba(239,68,68,0.1)',
          border: countdown > 0 ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(239,68,68,0.25)',
        }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            QR berlaku selama
          </div>
          <div style={{
            fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800,
            color: countdown > 0 ? '#a78bfa' : '#f87171',
          }}>
            {mm}:{ss}
          </div>
          {countdown === 0 && (
            <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: 6 }}>QR sudah kadaluarsa</div>
          )}
        </div>

        <div style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 24,
          background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)',
          color: '#fbbf24', fontSize: '0.78rem', lineHeight: 1.6,
        }}>
          ⚠️ Ini adalah simulasi. Untuk pembayaran nyata, perlu integrasi dengan payment gateway seperti Midtrans atau Xendit.
        </div>

        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '13px', borderRadius: 12,
            background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
            color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
          }}
        >
          Kembali ke KonserOjol
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value, accent, mono }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: accent ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
      border: accent ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ color: accent ? '#a78bfa' : '#6b7280', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.88rem', fontFamily: mono ? 'monospace' : 'inherit' }}>
        {value}
      </div>
    </div>
  )
}
