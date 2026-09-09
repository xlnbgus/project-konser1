import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

const BANKS = [
  { value: 'bca',     label: 'BCA',     norek: '1234567890', atas: 'KonserOjol' },
  { value: 'mandiri', label: 'Mandiri', norek: '9876543210', atas: 'KonserOjol' },
  { value: 'bni',     label: 'BNI',     norek: '1122334455', atas: 'KonserOjol' },
  { value: 'bri',     label: 'BRI',     norek: '5566778899', atas: 'KonserOjol' },
]
const EWALLETS = [
  { value: 'dana',  label: 'DANA' },
  { value: 'ovo',   label: 'OVO' },
  { value: 'gopay', label: 'GoPay' },
  { value: 'spay',  label: 'ShopeePay' },
]

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 12, outline: 'none',
  background: '#0f172a', color: '#f8fafc',
  border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.88rem',
  boxSizing: 'border-box',
}
const labelStyle = {
  color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, display: 'block',
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
      width: 200, margin: 2,
      color: { dark: '#111111', light: '#ffffff' },
    })
  }, [url])
  return <canvas ref={canvasRef} style={{ borderRadius: 12, display: 'block' }} />
}

export default function PaymentDetailForm({ method, detail, onChange }) {
  const set = (k, v) => onChange({ ...detail, [k]: v })

  if (method === 'debit' || method === 'credit') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
        <div>
          <label style={labelStyle}>Nomor Kartu</label>
          <input style={inputStyle} placeholder="1234 5678 9012 3456"
            value={detail.cardNumber || ''} maxLength={19}
            onChange={e => set('cardNumber', formatCard(e.target.value))}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
        </div>
        <div>
          <label style={labelStyle}>Nama di Kartu</label>
          <input style={inputStyle} placeholder="NAMA LENGKAP"
            value={detail.cardName || ''}
            onChange={e => set('cardName', e.target.value.toUpperCase())}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Exp. Date</label>
            <input style={inputStyle} placeholder="MM/YY"
              value={detail.expiry || ''} maxLength={5}
              onChange={e => set('expiry', formatExpiry(e.target.value))}
              onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>
          <div>
            <label style={labelStyle}>CVV</label>
            <input style={inputStyle} placeholder="•••"
              value={detail.cvv || ''} maxLength={4} type="password"
              onChange={e => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
              onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {BANKS.map(b => (
              <button key={b.value} type="button" onClick={() => set('bank', b.value)} style={{
                padding: '9px 12px', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem',
                cursor: 'pointer', border: 'none',
                background: (detail.bank || 'bca') === b.value ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.06)',
                color: '#fff',
                boxShadow: (detail.bank || 'bca') === b.value ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
                transition: 'all 0.2s',
              }}>{b.label}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Transfer ke</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ color: '#a78bfa', fontWeight: 700 }}>{selected.label}</span>
            <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.04em' }}>{selected.norek}</span>
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.78rem' }}>a/n {selected.atas}</div>
        </div>
        <div>
          <label style={labelStyle}>Nama Pengirim</label>
          <input style={inputStyle} placeholder="Nama sesuai rekening kamu"
            value={detail.senderName || ''}
            onChange={e => set('senderName', e.target.value)}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {EWALLETS.map(w => (
              <button key={w.value} type="button" onClick={() => set('wallet', w.value)} style={{
                padding: '9px 12px', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem',
                cursor: 'pointer', border: 'none',
                background: (detail.wallet || 'dana') === w.value ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.06)',
                color: '#fff',
                boxShadow: (detail.wallet || 'dana') === w.value ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
                transition: 'all 0.2s',
              }}>{w.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Nomor HP / Akun</label>
          <input style={inputStyle} placeholder="08xxxxxxxxxx" type="tel"
            value={detail.phone || ''}
            onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 13))}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
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
        <div style={{ padding: 16, borderRadius: 16, background: '#fff', boxShadow: '0 8px 32px rgba(124,58,237,0.2)', display: 'inline-block' }}>
          <QRCodeReal url={qrUrl} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.88rem' }}>Scan QR ini dengan kamera HP</div>
          <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: 4 }}>Arahkan kamera HP ke QR di atas untuk membuka halaman konfirmasi</div>
        </div>
        <div style={{ padding: '8px 16px', borderRadius: 99, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>
          ⚠️ Khusus kamera HP — tidak bisa lewat Dana/GoPay/OVO
        </div>
        <div style={{ padding: '6px 20px', borderRadius: 99, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', fontSize: '0.78rem', fontWeight: 600 }}>
          QR berlaku selama 10 menit
        </div>
      </div>
    )
  }

  return null
}
