import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

const BANKS = [
  { value: 'bca',     label: 'BCA',     norek: '1234567890', atas: 'KonserKu' },
  { value: 'mandiri', label: 'Mandiri', norek: '9876543210', atas: 'KonserKu' },
  { value: 'bni',     label: 'BNI',     norek: '1122334455', atas: 'KonserKu' },
  { value: 'bri',     label: 'BRI',     norek: '5566778899', atas: 'KonserKu' },
]
const EWALLETS = [
  { value: 'dana',  label: 'DANA' },
  { value: 'ovo',   label: 'OVO' },
  { value: 'gopay', label: 'GoPay' },
  { value: 'spay',  label: 'ShopeePay' },
]

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  outline: 'none',
  background: '#FFFFFF',
  color: '#111827',
  border: '1px solid #D1D5DB',
  fontSize: '0.88rem',
  boxSizing: 'border-box',
  fontFamily: "'Manrope', sans-serif",
  transition: 'border-color 0.2s',
}
const labelStyle = {
  color: '#4B5563',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 6,
  display: 'block',
  fontFamily: "'Space Grotesk', sans-serif",
}

function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val) {
  const d = val.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
}

function QRCodeReal({ url }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 190,
      margin: 2,
      color: { dark: '#111827', light: '#FFFFFF' },
    })
  }, [url])
  return <canvas ref={canvasRef} style={{ borderRadius: 8, display: 'block' }} />
}

export default function PaymentDetailForm({ method, detail, onChange }) {
  const set = (k, v) => onChange({ ...detail, [k]: v })

  if (method === 'debit' || method === 'credit') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
        <div>
          <label style={labelStyle}>Nomor Kartu</label>
          <input
            style={inputStyle}
            placeholder="1234 5678 9012 3456"
            value={detail.cardNumber || ''}
            maxLength={19}
            onChange={e => set('cardNumber', formatCard(e.target.value))}
            onFocus={e => e.target.style.borderColor = '#0066CC'}
            onBlur={e => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>
        <div>
          <label style={labelStyle}>Nama di Kartu</label>
          <input
            style={inputStyle}
            placeholder="NAMA LENGKAP PEMEGANG KARTU"
            value={detail.cardName || ''}
            onChange={e => set('cardName', e.target.value.toUpperCase())}
            onFocus={e => e.target.style.borderColor = '#0066CC'}
            onBlur={e => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Masa Berlaku</label>
            <input
              style={inputStyle}
              placeholder="MM/YY"
              value={detail.expiry || ''}
              maxLength={5}
              onChange={e => set('expiry', formatExpiry(e.target.value))}
              onFocus={e => e.target.style.borderColor = '#0066CC'}
              onBlur={e => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>
          <div>
            <label style={labelStyle}>CVV</label>
            <input
              style={inputStyle}
              placeholder="•••"
              value={detail.cvv || ''}
              maxLength={4}
              type="password"
              onChange={e => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
              onFocus={e => e.target.style.borderColor = '#0066CC'}
              onBlur={e => e.target.style.borderColor = '#D1D5DB'}
            />
          </div>
        </div>
      </div>
    )
  }

  if (method === 'bank') {
    const selected = BANKS.find(b => b.value === (detail.bank || 'bca')) || BANKS[0]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
        <div>
          <label style={labelStyle}>Pilih Bank</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {BANKS.map(b => {
              const isSelected = (detail.bank || 'bca') === b.value
              return (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => set('bank', b.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                    border: isSelected ? '1px solid #0066CC' : '1px solid #E5E7EB',
                    background: isSelected ? '#EFF6FF' : '#FFFFFF',
                    color: isSelected ? '#0066CC' : '#4B5563',
                    transition: 'all 0.2s',
                  }}
                >
                  {b.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ padding: '14px 16px', borderRadius: 8, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ color: '#4B5563', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
            Transfer ke Rekening
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ color: '#0066CC', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{selected.label}</span>
            <span style={{ color: '#111827', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.04em', fontFamily: 'monospace' }}>{selected.norek}</span>
          </div>
          <div style={{ color: '#4B5563', fontSize: '0.78rem' }}>Atas Nama: {selected.atas}</div>
        </div>

        <div>
          <label style={labelStyle}>Nama Pemilik Rekening Pengirim</label>
          <input
            style={inputStyle}
            placeholder="Nama sesuai buku tabungan"
            value={detail.senderName || ''}
            onChange={e => set('senderName', e.target.value)}
            onFocus={e => e.target.style.borderColor = '#0066CC'}
            onBlur={e => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>
      </div>
    )
  }

  if (method === 'e-wallet') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
        <div>
          <label style={labelStyle}>Pilih E-Wallet</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {EWALLETS.map(w => {
              const isSelected = (detail.wallet || 'dana') === w.value
              return (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => set('wallet', w.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                    border: isSelected ? '1px solid #0066CC' : '1px solid #E5E7EB',
                    background: isSelected ? '#EFF6FF' : '#FFFFFF',
                    color: isSelected ? '#0066CC' : '#4B5563',
                    transition: 'all 0.2s',
                  }}
                >
                  {w.label}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Nomor HP Akun E-Wallet</label>
          <input
            style={inputStyle}
            placeholder="08xxxxxxxxxx"
            type="tel"
            value={detail.phone || ''}
            onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 13))}
            onFocus={e => e.target.style.borderColor = '#0066CC'}
            onBlur={e => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>
      </div>
    )
  }

  if (method === 'qris') {
    const baseUrl = import.meta.env.VITE_PUBLIC_URL?.replace(/\/$/, '') || window.location.origin
    const qrUrl = `${baseUrl}/payment-confirm?event=${encodeURIComponent(detail.eventTitle || 'Konser')}&total=${detail.total || 0}&ref=${detail.orderId || Date.now()}&cfbypass=1`
    return (
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: 14, borderRadius: 10, background: '#FFFFFF', border: '1px solid #E5E7EB', display: 'inline-block' }}>
          <QRCodeReal url={qrUrl} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#111827', fontWeight: 700, fontSize: '0.88rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            Pindai QR dengan Kamera HP
          </div>
          <div style={{ color: '#4B5563', fontSize: '0.76rem', marginTop: 3 }}>
            Arahkan kamera smartphone ke kode QR untuk membuka rincian konfirmasi
          </div>
        </div>
        <div style={{ padding: '6px 14px', borderRadius: 6, background: '#FEF3C7', border: '1px solid #FDE68A', color: '#D97706', fontSize: '0.74rem', fontWeight: 600 }}>
          Berlaku selama 10 menit
        </div>
      </div>
    )
  }

  return null
}
