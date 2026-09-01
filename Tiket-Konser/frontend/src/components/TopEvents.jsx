import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import Modal from './Modal'

const CATEGORIES = ['Semua', 'Konser', 'Festival', 'Stand Up', 'Sports', 'Theater']

// Fallback demo data kalau backend tidak tersedia
const DEMO_EVENTS = [
  { id: 1, title: 'UNGU – Waktu yang Dinanti Final Chapter', category: 'Konser',  date: '2026-10-30', price: 550000, organizer: 'TipTip',            status: 'available' },
  { id: 2, title: 'SNOOPY RUN 2026',                         category: 'Sports',  date: '2026-09-06', price: 499000, organizer: 'Provaliant Sports', status: 'available' },
  { id: 3, title: 'Beyond Eyes 15th Anniversary – Surabaya', category: 'Konser',  date: '2026-08-28', price: 900000, organizer: 'Maryhouse Media',   status: 'available' },
]

const CAT_EMOJI = { Konser: '🎤', Festival: '🎪', 'Stand Up': '😂', Sports: '🏃', Theater: '🎭' }

const GRAD_PALETTES = [
  ['#3b0764', '#5b21b6'],
  ['#7c2d12', '#c2410c'],
  ['#0c4a6e', '#0369a1'],
  ['#831843', '#be185d'],
  ['#064e3b', '#059669'],
  ['#18181b', '#3f3f46'],
  ['#4c1d95', '#7c3aed'],
  ['#78350f', '#d97706'],
]

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function buildGradientImage(title, startColor, endColor, emoji) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="800" height="480" rx="32" fill="url(#g)" />
      <circle cx="660" cy="140" r="140" fill="rgba(255,255,255,0.16)" />
      <circle cx="180" cy="370" r="180" fill="rgba(255,255,255,0.10)" />
      <text x="92" y="232" font-family="Arial,sans-serif" font-size="90" fill="#fff">${emoji}</text>
      <text x="70" y="410" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="rgba(255,255,255,0.7)">KonserKu</text>
    </svg>
  `
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

// ─── QR Code (scan pakai kamera HP → buka halaman konfirmasi) ───────────────
function QRCodeReal({ url }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 200,
      margin: 2,
      color: { dark: '#111111', light: '#ffffff' },
    })
  }, [url])

  return (
    <canvas
      ref={canvasRef}
      style={{ borderRadius: 12, display: 'block' }}
    />
  )
}

// ─── Form detail per metode pembayaran ─────────────────────────────────────
const BANKS = [
  { value: 'bca',     label: 'BCA',     norek: '1234567890',  atas: 'KonserOjol' },
  { value: 'mandiri', label: 'Mandiri', norek: '9876543210',  atas: 'KonserOjol' },
  { value: 'bni',     label: 'BNI',     norek: '1122334455',  atas: 'KonserOjol' },
  { value: 'bri',     label: 'BRI',     norek: '5566778899',  atas: 'KonserOjol' },
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
const labelStyle = { color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, display: 'block' }

function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val) {
  const d = val.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
}

function PaymentDetailForm({ method, detail, onChange }) {
  const set = (k, v) => onChange({ ...detail, [k]: v })

  if (method === 'debit' || method === 'credit') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
        <div>
          <label style={labelStyle}>Nomor Kartu</label>
          <input
            style={inputStyle} placeholder="1234 5678 9012 3456"
            value={detail.cardNumber || ''}
            maxLength={19}
            onChange={e => set('cardNumber', formatCard(e.target.value))}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
        </div>
        <div>
          <label style={labelStyle}>Nama di Kartu</label>
          <input
            style={inputStyle} placeholder="NAMA LENGKAP"
            value={detail.cardName || ''}
            onChange={e => set('cardName', e.target.value.toUpperCase())}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>Exp. Date</label>
            <input
              style={inputStyle} placeholder="MM/YY"
              value={detail.expiry || ''}
              maxLength={5}
              onChange={e => set('expiry', formatExpiry(e.target.value))}
              onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>
          <div>
            <label style={labelStyle}>CVV</label>
            <input
              style={inputStyle} placeholder="•••"
              value={detail.cvv || ''}
              maxLength={4}
              type="password"
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
              <button key={b.value} type="button"
                onClick={() => set('bank', b.value)}
                style={{
                  padding: '9px 12px', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem',
                  cursor: 'pointer', border: 'none',
                  background: (detail.bank || 'bca') === b.value
                    ? 'linear-gradient(135deg,#7c3aed,#ec4899)'
                    : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  boxShadow: (detail.bank || 'bca') === b.value
                    ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
                  transition: 'all 0.2s',
                }}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Transfer ke
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ color: '#a78bfa', fontWeight: 700 }}>{selected.label}</span>
            <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.04em' }}>
              {selected.norek}
            </span>
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.78rem' }}>a/n {selected.atas}</div>
        </div>
        <div>
          <label style={labelStyle}>Nama Pengirim</label>
          <input
            style={inputStyle} placeholder="Nama sesuai rekening kamu"
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
              <button key={w.value} type="button"
                onClick={() => set('wallet', w.value)}
                style={{
                  padding: '9px 12px', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem',
                  cursor: 'pointer', border: 'none',
                  background: (detail.wallet || 'dana') === w.value
                    ? 'linear-gradient(135deg,#7c3aed,#ec4899)'
                    : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  boxShadow: (detail.wallet || 'dana') === w.value
                    ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
                  transition: 'all 0.2s',
                }}>
                {w.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Nomor HP / Akun</label>
          <input
            style={inputStyle} placeholder="08xxxxxxxxxx"
            type="tel"
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
        <div style={{
          padding: 16, borderRadius: 16,
          background: '#fff',
          boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
          display: 'inline-block',
        }}>
          <QRCodeReal url={qrUrl} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.88rem' }}>Scan QR ini dengan kamera HP</div>
          <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: 4 }}>
            Arahkan kamera HP ke QR di atas untuk membuka halaman konfirmasi
          </div>
        </div>
        <div style={{
          padding: '8px 16px', borderRadius: 99,
          background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)',
          color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center',
        }}>
          ⚠️ Khusus kamera HP — tidak bisa lewat Dana/GoPay/OVO
        </div>
        <div style={{
          padding: '6px 20px', borderRadius: 99,
          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
          color: '#4ade80', fontSize: '0.78rem', fontWeight: 600,
        }}>
          QR berlaku selama 10 menit
        </div>
      </div>
    )
  }

  return null
}

function OrgAvatar({ name }) {
  const initials = (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const palette  = ['#7c3aed', '#0891b2', '#0f766e', '#b45309', '#be123c', '#1d4ed8']
  const color    = palette[(name || '').charCodeAt(0) % palette.length]
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: '#fff',
    }}>
      {initials}
    </div>
  )
}

function EventCard({ ev, idx, onBuy, salesOpen }) {
  const [colors] = useState(GRAD_PALETTES[idx % GRAD_PALETTES.length])
  const emoji    = CAT_EMOJI[ev.category] || '🎵'
  const image    = buildGradientImage(ev.title, colors[0], colors[1], emoji)

  return (
    <div
      style={{
        background: '#13131f',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform   = 'translateY(-6px)'
        e.currentTarget.style.boxShadow   = '0 20px 40px rgba(124,58,237,0.25)'
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform   = 'translateY(0)'
        e.currentTarget.style.boxShadow   = 'none'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '60%', overflow: 'hidden' }}>
        <img
          src={image}
          alt={ev.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
        }} />
        {/* Status badge */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          padding: '5px 11px', borderRadius: 8,
          background: ev.status === 'soldout' ? 'rgba(39,39,42,0.88)' : 'rgba(22,163,74,0.88)',
          color: ev.status === 'soldout' ? '#a1a1aa' : '#fff',
          fontSize: '0.65rem', fontWeight: 700,
          backdropFilter: 'blur(4px)',
          border: ev.status === 'soldout' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.15)',
        }}>
          {ev.status === 'soldout' ? 'Tiket Habis' : 'Tiket Tersedia'}
        </div>
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: '4px 10px', borderRadius: 8,
          background: 'rgba(0,0,0,0.55)', color: '#e2e8f0',
          fontSize: '0.65rem', fontWeight: 700,
          backdropFilter: 'blur(4px)',
        }}>
          {emoji} {ev.category}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 16px 18px' }}>
        <h3 style={{
          fontSize: '0.9rem', fontWeight: 700, color: '#f9fafb',
          lineHeight: 1.4, marginBottom: 9,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '2.52em',
        }}>
          {ev.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{formatDate(ev.date)}</span>
        </div>

        <p style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 14 }}>
          {ev.status === 'soldout'
            ? <span style={{ color: '#52525b', fontWeight: 600, fontSize: '0.85rem' }}>Habis Terjual</span>
            : <span style={{
                background: 'linear-gradient(135deg,#a78bfa,#ec4899)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>{formatPrice(ev.price)}</span>
          }
        </p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <OrgAvatar name={ev.organizer || 'Organizer'} />
            <span style={{
              fontSize: '0.75rem', color: '#6b7280', fontWeight: 500,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {ev.organizer || '-'}
            </span>
          </div>

          {ev.status !== 'soldout' && (
            salesOpen ? (
              <button
                onClick={() => onBuy(ev)}
                style={{
                  flexShrink: 0, padding: '7px 16px', borderRadius: 9,
                  background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                  color: '#fff', fontSize: '0.73rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(124,58,237,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.35)' }}
              >
                Beli →
              </button>
            ) : (
              <span style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 9,
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#f87171', fontSize: '0.7rem', fontWeight: 700,
              }}>
                Tutup
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default function TopEvents({ searchQuery = '' }) {
  const navigate = useNavigate()
  const [events, setEvents]               = useState([])
  const [fetchLoading, setFetchLoading]   = useState(true)
  const [active, setActive]               = useState('Semua')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState('')
  const [quantity, setQuantity]           = useState(1)
  const [promoCode, setPromoCode]         = useState('')
  const [appliedPromo, setAppliedPromo]   = useState(null)
  const [promoError, setPromoError]       = useState('')
  const [promoLoading, setPromoLoading]   = useState(false)
  const [loading, setLoading]             = useState(false)
  const [message, setMessage]             = useState('')
  const [paymentDetail, setPaymentDetail] = useState({})
  const [salesOpen, setSalesOpen]         = useState(true)

  // Fetch events dari backend saat mount
  useEffect(() => {
    setFetchLoading(true)
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data.events) ? data.events : []
        setEvents(list.length > 0 ? list : DEMO_EVENTS)
      })
      .catch(() => setEvents(DEMO_EVENTS))
      .finally(() => setFetchLoading(false))
  }, [])

  // Fetch payment methods
  useEffect(() => {
    fetch('/api/payment-methods')
      .then(res => res.json())
      .then(data => {
        const methods = Array.isArray(data.paymentMethods) ? data.paymentMethods : []
        const withQris = methods.some(m => m.value === 'qris')
          ? methods
          : [...methods, { value: 'qris', label: 'QRIS', description: 'Scan pakai kamera HP' }]
        setPaymentMethods(withQris)
        if (withQris.length > 0) setSelectedMethod(withQris[0].value)
      })
      .catch(() => {
        const fallback = [{ value: 'qris', label: 'QRIS', description: 'Scan pakai kamera HP' }]
        setPaymentMethods(fallback)
        setSelectedMethod(fallback[0].value)
      })
  }, [])

  // Fetch status penjualan
  useEffect(() => {
    fetch('/api/sales-status')
      .then(res => res.json())
      .then(data => setSalesOpen(data.isSalesOpen !== false))
      .catch(() => setSalesOpen(true))
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filtered = events
    .slice(0, 8)
    .filter(e => active === 'Semua' || e.category === active)
    .filter(e => {
      if (!normalizedQuery) return true
      const hay = [e.title, e.category, e.organizer, e.date, String(e.price)].join(' ').toLowerCase()
      return hay.includes(normalizedQuery)
    })

  const handleSelectEvent = (ev) => {
    setMessage('')
    setPromoCode('')
    setAppliedPromo(null)
    setPromoError('')
    setQuantity(1)
    setPaymentDetail({})
    setSelectedEvent(ev)
  }

  const handleApplyPromo = async () => {
    const code = promoCode.trim()
    if (!code) return
    setPromoLoading(true)
    setPromoError('')
    setAppliedPromo(null)
    try {
      const res = await fetch('/api/promos')
      const data = await res.json()
      const promos = Array.isArray(data.promos) ? data.promos : []
      const found = promos.find(p => p.code?.toUpperCase() === code.toUpperCase())
      if (!found) {
        setPromoError('Kode promo tidak valid atau sudah tidak aktif.')
      } else if (found.discountPercent === 0) {
        setAppliedPromo(found)
        setPromoError('')
      } else {
        setAppliedPromo(found)
        setPromoError('')
      }
    } catch {
      setPromoError('Gagal memvalidasi kode promo.')
    } finally {
      setPromoLoading(false)
    }
  }

  const subtotal       = selectedEvent ? Number(selectedEvent.price) * quantity : 0
  const discountAmount = appliedPromo ? Math.round(subtotal * (Number(appliedPromo.discountPercent || 0) / 100)) : 0
  const totalPrice     = Math.max(0, subtotal - discountAmount)

  const handleCheckout = async () => {
    const eventId = Number(selectedEvent?.id)
    if (!eventId) {
      setMessage('ID event tidak valid. Coba pilih event lagi.')
      return
    }
    if (!selectedMethod) {
      setMessage('Pilih metode pembayaran terlebih dahulu.')
      return
    }

    // Validasi detail per metode
    if (selectedMethod === 'debit' || selectedMethod === 'credit') {
      const { cardNumber = '', cardName = '', expiry = '', cvv = '' } = paymentDetail
      if (cardNumber.replace(/\s/g, '').length < 16) { setMessage('Nomor kartu harus 16 digit.'); return }
      if (!cardName.trim()) { setMessage('Nama di kartu wajib diisi.'); return }
      if (expiry.length < 5) { setMessage('Tanggal kadaluarsa tidak valid.'); return }
      if (cvv.length < 3) { setMessage('CVV tidak valid.'); return }
    }
    if (selectedMethod === 'bank') {
      if (!paymentDetail.senderName?.trim()) { setMessage('Nama pengirim wajib diisi.'); return }
    }
    if (selectedMethod === 'e-wallet') {
      if (!paymentDetail.phone || paymentDetail.phone.length < 9) { setMessage('Nomor HP tidak valid.'); return }
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          quantity: Number(quantity),
          paymentMethod: selectedMethod,
          promoCode: appliedPromo ? appliedPromo.code : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Checkout gagal')
      if (data.order) {
        navigate('/payment-success', {
          state: {
            eventTitle:   data.order.eventTitle,
            paymentLabel: data.order.paymentLabel,
            total:        data.order.total,
            orderId:      data.order.id,
            quantity:     data.order.quantity,
            subtotal:     data.order.subtotal,
            discountAmount: data.order.discountAmount,
            promoCode:    data.order.promoCode,
          }
        })
      }
    } catch (err) {
      setMessage(err.message || 'Checkout gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="top-events" style={{ padding: '80px 0', background: '#0a0a0f' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <p style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#a78bfa', marginBottom: 8,
            }}>
              🎵 Pilihan Terbaik
            </p>
            <h2 style={{
              fontFamily: 'Poppins,sans-serif',
              fontSize: 'clamp(1.6rem,3.5vw,2.2rem)',
              fontWeight: 900, color: '#fff', lineHeight: 1.1,
            }}>
              Top{' '}
              <span style={{
                background: 'linear-gradient(135deg,#a78bfa,#ec4899,#f59e0b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Events
              </span>
            </h2>
          </div>
          <a href="#" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: '#a78bfa', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
          }}>
            Lihat Semua
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {normalizedQuery && filtered.length === 0 && !fetchLoading && (
          <div style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1' }}>
            Tidak ada event yang cocok dengan pencarian &quot;{searchQuery}&quot;.
          </div>
        )}

        {/* Banner penjualan tutup */}
        {!salesOpen && (
          <div style={{
            marginBottom: 20, padding: '14px 18px', borderRadius: 14,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex', alignItems: 'center', gap: 10, color: '#fca5a5',
          }}>
            <span style={{ fontSize: 18 }}>🔴</span>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Penjualan tiket sedang ditutup.</span>
              <span style={{ color: '#6b7280', fontSize: '0.82rem', marginLeft: 8 }}>Pembelian tidak tersedia untuk saat ini.</span>
            </div>
          </div>
        )}

        {/* Category chips */}
        <div
          className="no-scrollbar"
          style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 28 }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                flexShrink: 0, padding: '8px 18px', borderRadius: 99,
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                border: active === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                background: active === cat ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.05)',
                color: active === cat ? '#fff' : '#9ca3af',
                boxShadow: active === cat ? '0 4px 14px rgba(124,58,237,0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280', fontSize: '0.95rem' }}>
            Memuat event…
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {filtered.map((ev, idx) => (
              <EventCard key={ev.id} ev={ev} idx={idx} onBuy={handleSelectEvent} salesOpen={salesOpen} />
            ))}
          </div>
        )}

        {/* Load more */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            style={{
              padding: '12px 36px', borderRadius: 99,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: '#9ca3af', fontWeight: 600, fontSize: '0.875rem',
              cursor: 'pointer', transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            Lihat Lainnya
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => {
          setSelectedEvent(null)
          setPromoCode('')
          setAppliedPromo(null)
          setPromoError('')
          setMessage('')
          setPaymentDetail({})
        }}
        title={`Beli Tiket: ${selectedEvent?.title || ''}`}
        description="Isi detail pembelian dan selesaikan checkout."
        ctaLabel={loading ? 'Memproses…' : 'Bayar Sekarang'}
        onCta={handleCheckout}
        secondaryLabel="Batal"
        closeOnCta={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Event name */}
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#ddd6fe' }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>Event</strong>
            <span>{selectedEvent?.title}</span>
          </div>

          {/* Quantity + Total */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
              <label style={{ color: '#cbd5e1', fontSize: '0.86rem', fontWeight: 700 }}>Jumlah Tiket</label>
              <select
                value={quantity}
                onChange={e => {
                  setQuantity(Number(e.target.value))
                  setAppliedPromo(null)
                  setPromoError('')
                }}
                style={{ padding: '10px 12px', borderRadius: 12, background: '#0f172a', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.9rem' }}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                  <option key={v} value={v}>{v} tiket</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
              <label style={{ color: '#cbd5e1', fontSize: '0.86rem', fontWeight: 700 }}>Subtotal</label>
              <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700 }}>
                {formatPrice(subtotal)}
              </div>
            </div>
          </div>

          {/* Promo code */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ color: '#cbd5e1', fontSize: '0.86rem', fontWeight: 700 }}>Kode Promo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={promoCode}
                onChange={e => {
                  setPromoCode(e.target.value.toUpperCase())
                  setAppliedPromo(null)
                  setPromoError('')
                }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo() } }}
                placeholder="Contoh: EARLYBIRD30"
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 12,
                  background: '#0f172a', color: '#f8fafc',
                  border: appliedPromo
                    ? '1px solid rgba(34,197,94,0.5)'
                    : promoError
                      ? '1px solid rgba(239,68,68,0.5)'
                      : '1px solid rgba(255,255,255,0.12)',
                  fontSize: '0.9rem', outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={!promoCode.trim() || promoLoading}
                style={{
                  padding: '10px 16px', borderRadius: 12, fontWeight: 700, fontSize: '0.82rem',
                  border: 'none', cursor: !promoCode.trim() || promoLoading ? 'not-allowed' : 'pointer',
                  background: !promoCode.trim() || promoLoading
                    ? 'rgba(124,58,237,0.25)'
                    : 'linear-gradient(135deg,#7c3aed,#ec4899)',
                  color: '#fff', whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s',
                }}
              >
                {promoLoading ? '...' : 'Pakai'}
              </button>
            </div>

            {/* Promo feedback */}
            {appliedPromo && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <div>
                    <div style={{ color: '#86efac', fontSize: '0.82rem', fontWeight: 700 }}>
                      {appliedPromo.title}
                    </div>
                    <div style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: 2 }}>
                      {appliedPromo.discountPercent > 0
                        ? `Diskon ${appliedPromo.discountPercent}% — hemat ${formatPrice(discountAmount)}`
                        : 'Promo bebas biaya admin berhasil diterapkan'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setAppliedPromo(null); setPromoCode(''); setPromoError('') }}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 16, padding: 0 }}
                >×</button>
              </div>
            )}
            {promoError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', fontSize: '0.82rem',
              }}>
                <span>⚠️</span> {promoError}
              </div>
            )}
          </div>

          {/* Price breakdown */}
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
              <span>Subtotal ({quantity} tiket)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontSize: '0.82rem' }}>
                <span>Diskon ({appliedPromo?.discountPercent}%)</span>
                <span>− {formatPrice(discountAmount)}</span>
              </div>
            )}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem' }}>
              <span style={{ color: '#fff' }}>Total</span>
              <span style={{
                background: 'linear-gradient(135deg,#a78bfa,#ec4899)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ color: '#cbd5e1', fontSize: '0.86rem', fontWeight: 700 }}>Metode Pembayaran</label>
            <div style={{ display: 'grid', gap: 8 }}>
              {paymentMethods.map(method => (
                <label
                  key={method.value}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: selectedMethod === method.value ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment-top"
                    value={method.value}
                    checked={selectedMethod === method.value}
                    onChange={() => {
                      setSelectedMethod(method.value)
                      setPaymentDetail(method.value === 'qris' ? {
                        eventTitle: selectedEvent?.title,
                        total: totalPrice,
                        orderId: `KO-${Date.now()}`,
                      } : {})
                      setMessage('')
                    }}
                  />
                  <span style={{ color: '#f8fafc', fontWeight: 700 }}>{method.label}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: 'auto' }}>{method.description}</span>
                </label>
              ))}
            </div>

            {/* Detail form sesuai metode */}
            {selectedMethod && (
              <div style={{
                padding: '14px 16px', borderRadius: 12, marginTop: 4,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <PaymentDetailForm
                  method={selectedMethod}
                  detail={paymentDetail}
                  onChange={setPaymentDetail}
                />
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: '10px 12px', borderRadius: 10,
              background: message.toLowerCase().includes('berhasil') ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              border: message.toLowerCase().includes('berhasil') ? '1px solid rgba(34,197,94,0.22)' : '1px solid rgba(239,68,68,0.22)',
              color: message.toLowerCase().includes('berhasil') ? '#bbf7d0' : '#fecaca',
              fontSize: '0.85rem',
            }}>
              {message}
            </div>
          )}
        </div>
      </Modal>
    </section>
  )
}
