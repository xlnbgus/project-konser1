import { Link, useLocation } from 'react-router-dom'
import { useRef } from 'react'

const formatPrice = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`

// ─── PDF Generator — render dari DOM → canvas → PDF (teks tidak bisa diselect) ──
async function downloadStruk(data, strutNode) {
  const [{ jsPDF }, html2canvas] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ])

  const canvas = await html2canvas.default(strutNode, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  })

  const imgData  = canvas.toDataURL('image/png')
  const pdfW     = 148   // A5 mm
  const pdfH     = Math.round((canvas.height / canvas.width) * pdfW)

  const doc = new jsPDF({ unit: 'mm', format: [pdfW, pdfH] })
  doc.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)

  const fileName = `Struk_${String(data.orderId).replace('#', '')}_KonserOjol.pdf`
  doc.save(fileName)
}

// ─── Komponen Struk (tersembunyi, hanya untuk di-render ke PDF) ──────────────
function StrukTemplate({ eventTitle, paymentLabel, total, subtotal, discountAmount, quantity, promoCode, orderId }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  }) + '  ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      width: 420, background: '#ffffff',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: 13, color: '#111827',
      userSelect: 'none',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
        padding: '28px 24px 22px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.3px', marginBottom: 4 }}>
          KonserOjol
        </div>
        <div style={{ fontSize: 12, color: '#ddd6fe', fontWeight: 400 }}>
          Struk Pembelian Tiket
        </div>
        <div style={{ fontSize: 10, color: '#c4b5fd', marginTop: 2 }}>
          konserojol.id
        </div>
      </div>

      {/* ── BADGE SUKSES ── */}
      <div style={{ padding: '0 20px', marginTop: 16 }}>
        <div style={{
          background: '#f0fdf4', border: '1.5px solid #86efac',
          borderRadius: 10, padding: '12px 16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 18, marginRight: 8 }}>✅</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>
            Pembayaran Berhasil
          </span>
        </div>
      </div>

      {/* ── NO PESANAN ── */}
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{
          background: '#f5f3ff', border: '1px solid #ddd6fe',
          borderRadius: 10, padding: '10px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            No. Pesanan
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#4c1d95', fontFamily: 'monospace' }}>
            {orderId}
          </span>
        </div>
      </div>

      {/* ── DETAIL ── */}
      <div style={{ padding: '16px 20px 0' }}>
        {/* Section head */}
        <div style={{
          background: '#ede9fe', borderRadius: 6,
          padding: '5px 10px', marginBottom: 8,
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#5b21b6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Detail Pemesanan
          </span>
        </div>

        {[
          ['Event', eventTitle],
          ['Jumlah Tiket', `${quantity} tiket`],
          ['Metode Pembayaran', paymentLabel],
        ].map(([label, val]) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '7px 0', borderBottom: '1px solid #f3f4f6',
          }}>
            <span style={{ color: '#6b7280', fontSize: 12 }}>{label}</span>
            <span style={{ fontWeight: 700, fontSize: 12, color: '#111827', textAlign: 'right', maxWidth: '55%' }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ── RINCIAN HARGA ── */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{
          background: '#ede9fe', borderRadius: 6,
          padding: '5px 10px', marginBottom: 8,
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#5b21b6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Rincian Harga
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span style={{ color: '#6b7280', fontSize: 12 }}>Subtotal ({quantity} tiket)</span>
          <span style={{ fontWeight: 600, fontSize: 12 }}>{formatPrice(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ color: '#15803d', fontSize: 12 }}>
              Diskon{promoCode ? ` (${promoCode})` : ''}
            </span>
            <span style={{ fontWeight: 600, fontSize: 12, color: '#15803d' }}>
              − {formatPrice(discountAmount)}
            </span>
          </div>
        )}

        {/* Total box */}
        <div style={{
          marginTop: 10,
          background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
          border: '1.5px solid #a78bfa', borderRadius: 10,
          padding: '12px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#4c1d95' }}>Total Dibayar</span>
          <span style={{ fontSize: 17, fontWeight: 900, color: '#6d28d9' }}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* ── GARIS PERFORASI ── */}
      <div style={{
        margin: '18px 20px 0',
        borderTop: '1.5px dashed #d1d5db',
      }} />

      {/* ── FOOTER ── */}
      <div style={{ padding: '12px 20px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>
          Dicetak: {dateStr}
        </div>
        <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, marginBottom: 2 }}>
          Terima kasih telah memesan tiket di KonserOjol!
        </div>
        <div style={{ fontSize: 10, color: '#9ca3af' }}>
          Simpan struk ini sebagai bukti pembelian Anda.
        </div>

        {/* strip bawah */}
        <div style={{
          marginTop: 16,
          background: 'linear-gradient(90deg, #5b21b6, #7c3aed)',
          borderRadius: 4, height: 5,
        }} />
      </div>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PaymentSuccessPage() {
  const location = useLocation()
  const state = location.state || {}
  const strutRef = useRef(null)

  const eventTitle     = state.eventTitle     || 'Tiket Konser'
  const paymentLabel   = state.paymentLabel   || 'Pembayaran dipilih'
  const total          = Number(state.total   ?? 0)
  const subtotal       = Number(state.subtotal ?? total)
  const discountAmount = Number(state.discountAmount ?? 0)
  const quantity       = Number(state.quantity ?? 1)
  const promoCode      = state.promoCode      || null
  const orderId        = state.orderId        ? `#${state.orderId}` : 'TRX-001'

  const strutData = { eventTitle, paymentLabel, total, subtotal, discountAmount, quantity, promoCode, orderId }

  const handleDownload = () => {
    if (strutRef.current) {
      downloadStruk(strutData, strutRef.current)
    }
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

      {/* Struk tersembunyi — dirender ke PDF, tidak terlihat user */}
      <div
        ref={strutRef}
        style={{
          position: 'fixed', top: 0, left: '-9999px',
          pointerEvents: 'none', zIndex: -1,
        }}
      >
        <StrukTemplate {...strutData} />
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
