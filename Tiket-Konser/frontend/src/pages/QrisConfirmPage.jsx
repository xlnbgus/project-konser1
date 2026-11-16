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
      minHeight: '100vh',
      background: '#111318',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Manrope', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: '#161920',
        border: '1px solid rgba(245, 243, 238, 0.08)',
        borderRadius: 14,
        padding: '36px 30px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
      }}>
        {/* Brand Icon */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: '#D95D39',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19V6l12-3v13"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </div>

        <h1 style={{
          color: '#F5F3EE',
          fontSize: '1.4rem',
          fontWeight: 700,
          marginBottom: 8,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-0.02em',
        }}>
          Konfirmasi Pembayaran
        </h1>
        <p style={{ color: '#6B6E7A', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: 24 }}>
          Pemesanan tiket melalui simulasi QRIS KonserKu.
        </p>

        {/* Detail Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, textAlign: 'left' }}>
          <Row label="Event" value={eventTitle} accent />
          <Row label="Total" value={formatPrice(total)} />
          <Row label="Referensi" value={ref} mono />
        </div>

        {/* Countdown */}
        <div style={{
          padding: '16px',
          borderRadius: 8,
          marginBottom: 20,
          background: countdown > 0 ? 'rgba(217, 93, 57, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: countdown > 0 ? '1px solid rgba(217, 93, 57, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
        }}>
          <div style={{ color: '#9095A1', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
            Masa Berlaku QRIS
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', monospace",
            fontSize: '1.9rem',
            fontWeight: 700,
            color: countdown > 0 ? '#D95D39' : '#f87171',
          }}>
            {mm}:{ss}
          </div>
          {countdown === 0 && (
            <div style={{ color: '#f87171', fontSize: '0.76rem', marginTop: 4 }}>Waktu pembayaran telah habis</div>
          )}
        </div>

        <div style={{
          padding: '10px 14px',
          borderRadius: 8,
          marginBottom: 24,
          background: 'rgba(245, 243, 238, 0.04)',
          border: '1px solid rgba(245, 243, 238, 0.08)',
          color: '#6B6E7A',
          fontSize: '0.76rem',
          lineHeight: 1.5,
        }}>
          Simulasi pembayaran terenkripsi untuk pengujian sistem checkout tiket.
        </div>

        <Link
          to="/"
          className="btn-primary"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.88rem',
            boxSizing: 'border-box',
          }}
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value, accent, mono }) {
  return (
    <div style={{
      padding: '10px 14px',
      borderRadius: 8,
      background: accent ? 'rgba(217, 93, 57, 0.08)' : 'rgba(245, 243, 238, 0.04)',
      border: accent ? '1px solid rgba(217, 93, 57, 0.2)' : '1px solid rgba(245, 243, 238, 0.07)',
    }}>
      <div style={{
        color: accent ? '#D95D39' : '#6B6E7A',
        fontSize: '0.68rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 3,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        {label}
      </div>
      <div style={{
        color: '#F5F3EE',
        fontWeight: 700,
        fontSize: '0.88rem',
        fontFamily: mono ? 'monospace' : 'inherit',
      }}>
        {value}
      </div>
    </div>
  )
}
