import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import PaymentDetailForm from './PaymentDetailForm'

import syncFestImg from '../assets/events/synchronize-fest.jpg'
import wtfImg from '../assets/events/wethefest.jpg'
import pestaporaImg from '../assets/events/pestapora.jpg'
import dwpImg from '../assets/events/dwp-fest.jpg'
import snoopyRunImg from '../assets/events/snoopy-run.jpg'
import standupImg from '../assets/events/standup-comedy.jpg'
import unguImg from '../assets/artists/ungu.jpg'
import westlifeImg from '../assets/artists/westlife.jpg'
import dewa19Img from '../assets/artists/dewa19.jpg'
import noahImg from '../assets/artists/noah.jpg'
import raisaImg from '../assets/artists/raisa.jpg'

const CATEGORIES = ['Semua', 'Konser', 'Festival', 'Stand Up', 'Sports', 'Theater']
const LOCATIONS = ['Semua Lokasi', 'Jakarta', 'Tangerang', 'Solo', 'Bandung']
const SORT_OPTIONS = [
  { value: 'default', label: 'Urutan: Rekomendasi' },
  { value: 'price_asc', label: 'Harga: Termurah' },
  { value: 'price_desc', label: 'Harga: Termahal' },
  { value: 'date_asc', label: 'Tanggal: Terdekat' },
]

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

const DEMO_EVENTS = [
  { id: 101, title: 'Synchronize Festival 2026', description: 'Festival musik multi-genre tahunan terbesar di Indonesia.', date: '2026-10-03', location: 'Gambir Expo Kemayoran, Jakarta', price: 450000, category: 'Festival', organizer: 'Demajors x Dyandra', image: syncFestImg, status: 'available' },
  { id: 102, title: 'We The Fest (WTF) 2026', description: 'Festival musim panas perpaduan musik, seni, mode, dan kuliner.', date: '2026-08-21', location: 'GBK Sports Complex, Jakarta', price: 750000, category: 'Festival', organizer: 'Ismaya Live', image: wtfImg, status: 'available' },
  { id: 103, title: 'Pestapora 2026', description: 'Perayaan akbar selebrasi musik Indonesia.', date: '2026-09-18', location: 'JIExpo Kemayoran, Jakarta', price: 550000, category: 'Festival', organizer: 'Boss Creator', image: pestaporaImg, status: 'available' },
  { id: 104, title: 'Djakarta Warehouse Project (DWP) 2026', description: 'Festival dance music elektronik spektakuler internasional.', date: '2026-12-11', location: 'JIExpo Kemayoran, Jakarta', price: 950000, category: 'Festival', organizer: 'Ismaya Live', image: dwpImg, status: 'available' },
  { id: 1, title: 'UNGU – Waktu yang Dinanti Final Chapter', description: 'Konser perayaan mahakarya perjalanan band legendaris UNGU.', date: '2026-10-30', location: 'ICE BSD, Tangerang', price: 550000, category: 'Konser', organizer: 'TipTip', image: unguImg, status: 'available' },
  { id: 2, title: 'Westlife World Tour 2026', description: 'The Greatest Hits Tour live membawakan deretan tembang abadi.', date: '2026-09-15', location: 'GBK Stadium, Jakarta', price: 750000, category: 'Konser', organizer: 'PK Entertainment', image: westlifeImg, status: 'available' },
  { id: 3, title: 'SNOOPY RUN 2026', description: 'Lari santai keluarga dan komunitas runners paling meriah.', date: '2026-09-06', location: 'Tangerang Selatan', price: 499000, category: 'Sports', organizer: 'Provaliant Sports', image: snoopyRunImg, status: 'available' },
  { id: 4, title: 'Stand Up Comedy Special: Cerita Rasa', description: 'Show penuh tawa dari para komika papan atas Indonesia.', date: '2026-11-08', location: 'Teater Jakarta, TIM', price: 250000, category: 'Stand Up', organizer: 'Majelis Lucu Indonesia', image: standupImg, status: 'available' },
  { id: 5, title: 'Dewa 19 All Stars Stadium Tour', description: 'Konser megah stadion bersama musisi legendaris.', date: '2026-12-22', location: 'Gelora Bung Karno, Jakarta', price: 650000, category: 'Konser', organizer: 'Otello Asia', image: dewa19Img, status: 'available' },
  { id: 6, title: 'Noah – The Great Journey Live', description: 'Penampilan spektakuler Noah menyanyikan lagu-lagu hits terbaik.', date: '2026-11-10', location: 'Edutorium UMS, Solo', price: 500000, category: 'Konser', organizer: 'Aloka Live', image: noahImg, status: 'available' },
  { id: 7, title: 'Raisa Live in Concert Jakarta', description: 'Malam penuh lantunan melodi romantis dan vokal memikat.', date: '2026-12-12', location: 'Tennis Indoor Senayan, Jakarta', price: 600000, category: 'Konser', organizer: 'JUNI Concert', image: raisaImg, status: 'available' },
  { id: 8, title: 'Musikal Teater Cerita Rakyat Nusantara', description: 'Pertunjukan seni teater megah bertabur koreografi dan musik live.', date: '2026-10-15', location: 'Ciputra Artpreneur, Jakarta', price: 350000, category: 'Theater', organizer: 'Miles Productions', image: pestaporaImg, status: 'available' },
]

function resolveEventImage(ev) {
  if (ev.image && typeof ev.image !== 'string') return ev.image
  if (ev.image && typeof ev.image === 'string' && (ev.image.startsWith('/') || ev.image.startsWith('http'))) return ev.image
  const t = (ev.title || '').toLowerCase()
  if (t.includes('synchronize')) return syncFestImg
  if (t.includes('we the fest') || t.includes('wtf')) return wtfImg
  if (t.includes('pestapora')) return pestaporaImg
  if (t.includes('dwp') || t.includes('djakarta')) return dwpImg
  if (t.includes('snoopy') || t.includes('run')) return snoopyRunImg
  if (t.includes('stand up') || t.includes('comedy')) return standupImg
  if (t.includes('ungu')) return unguImg
  if (t.includes('westlife')) return westlifeImg
  if (t.includes('dewa')) return dewa19Img
  if (t.includes('noah')) return noahImg
  if (t.includes('raisa')) return raisaImg
  return syncFestImg
}

const CAT_LABEL = {
  Konser: 'Konser',
  Festival: 'Festival',
  'Stand Up': 'Stand Up',
  Sports: 'Sports',
  Theater: 'Theater',
}

const EVENT_QUOTAS = {
  101: { quota: 34, label: 'PRESALE 2', bg: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
  102: { quota: 18, label: 'SEGERA HABIS', bg: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' },
  103: { quota: 53, label: 'PRESALE 2', bg: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
  104: { quota: 62, label: 'TERSEDIA', bg: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' },
  1:   { quota: 9,  label: 'SEGERA HABIS', bg: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' },
  2:   { quota: 7,  label: 'SEGERA HABIS', bg: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' },
  3:   { quota: 88, label: 'TERSEDIA', bg: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' },
  4:   { quota: 24, label: 'SEGERA HABIS', bg: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' },
  5:   { quota: 43, label: 'PRESALE 2', bg: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
  6:   { quota: 15, label: 'SEGERA HABIS', bg: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' },
  7:   { quota: 31, label: 'PRESALE 2', bg: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
  8:   { quota: 77, label: 'TERSEDIA', bg: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' },
}

function getCardBadge(ev, idx) {
  if (ev.status === 'soldout') {
    return { label: 'HABIS', bg: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', quota: 0 }
  }

  const found = EVENT_QUOTAS[ev.id]
  if (found) return found

  // Fallback deterministic unique percentage per event (between 6% and 89%)
  const seed = ((String(ev.title || '').length * 19 + (Number(ev.id) || idx + 1) * 37) % 84) + 6
  if (seed <= 25) {
    return { quota: seed, label: 'SEGERA HABIS', bg: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }
  }
  if (seed <= 58) {
    return { quota: seed, label: 'PRESALE 2', bg: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }
  }
  return { quota: seed, label: 'TERSEDIA', bg: '#D1FAE5', color: '#059669', border: '1px solid #A7F3D0' }
}

function EventCard({ ev, idx, onBuy, salesOpen }) {
  const imgSrc = resolveEventImage(ev)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [barActive, setBarActive] = useState(false)
  const cardRef = useRef(null)
  const badgeInfo = getCardBadge(ev, idx)

  // Trigger quota progress animation when card is scrolled into view
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setBarActive(true), 150)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.15 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseEnter = () => {
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  const staggerDelay = (idx % 4) * 90 // 80-100ms interval: 0ms, 90ms, 180ms, 270ms

  return (
    <div
      ref={cardRef}
      className="reveal-scale card-3d-wrap"
      style={{
        transitionDelay: `${staggerDelay}ms`,
        willChange: 'transform, box-shadow',
      }}
      onClick={() => onBuy(ev)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          overflow: 'hidden',
          cursor: 'pointer',
          border: hovered ? '1px solid #0066CC' : '1px solid #E5E7EB',
          transform: hovered
            ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`
            : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)',
          boxShadow: hovered
            ? '0 10px 20px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          transition: hovered
            ? 'transform 0.1s ease-out, box-shadow 0.2s ease, border-color 0.2s ease'
            : 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease, border-color 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '62%', overflow: 'hidden', background: '#F4F5F7' }}>
          <img
            src={imgSrc}
            alt={ev.title}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}
          />

          {/* Category badge */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            padding: '4px 10px', borderRadius: 6,
            background: 'rgba(255,255,255,0.92)',
            color: '#111827',
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.06em',
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: 'uppercase',
            border: '1px solid #E5E7EB',
            backdropFilter: 'blur(4px)',
          }}>
            {CAT_LABEL[ev.category] || ev.category}
          </div>

          {/* Dynamic Status badge */}
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            padding: '4px 10px', borderRadius: 6,
            background: badgeInfo.bg,
            color: badgeInfo.color,
            border: badgeInfo.border || 'none',
            fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.04em',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {badgeInfo.label}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', flex: 1, background: '#FFFFFF' }}>
          <h3 style={{
            fontSize: '0.95rem', fontWeight: 700, color: '#111827',
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: 1.35, marginBottom: 8,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: '2.4em', letterSpacing: '-0.01em',
          }}>
            {ev.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <svg width="12" height="12" fill="none" stroke="#6B7280" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <span style={{ fontSize: '0.78rem', color: '#4B5563', fontWeight: 500 }}>{formatDate(ev.date)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
            <svg width="12" height="12" fill="none" stroke="#6B7280" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontSize: '0.76rem', color: '#4B5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ev.location}
            </span>
          </div>

          {/* Quota Progress Bar with smooth filling animation */}
          {badgeInfo.quota > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', marginBottom: 5 }}>
                <span style={{ color: '#4B5563' }}>Sisa Kuota</span>
                <span style={{ color: badgeInfo.quota <= 20 ? '#DC2626' : '#0066CC', fontWeight: 700 }}>
                  {badgeInfo.quota}%
                </span>
              </div>
              <div
                className="quota-progress-track"
                style={{
                  '--target-quota': `${badgeInfo.quota}%`,
                  width: '100%',
                  height: 6,
                  background: '#E5E7EB',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  className={`quota-progress-fill ${barActive ? 'filled' : ''}`}
                  style={{
                    width: barActive ? `${badgeInfo.quota}%` : '0%',
                    height: '100%',
                    background: badgeInfo.quota <= 20 ? '#DC2626' : '#0066CC',
                    borderRadius: 3,
                    transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ height: 1, background: '#E5E7EB', marginBottom: 14 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 'auto' }}>
            <div>
              {ev.status === 'soldout'
                ? <span style={{ color: '#6B7280', fontWeight: 600, fontSize: '0.85rem' }}>Habis Terjual</span>
                : <span style={{ color: '#111827', fontWeight: 800, fontSize: '1.05rem', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}>{formatPrice(ev.price)}</span>
              }
            </div>

            {ev.status !== 'soldout' && (
              salesOpen ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onBuy(ev) }}
                  style={{
                    flexShrink: 0, padding: '8px 16px', borderRadius: 8,
                    background: '#0066CC',
                    color: '#fff', fontSize: '0.76rem', fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#004C99' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0066CC' }}
                >
                  Beli →
                </button>
              ) : (
                <span style={{
                  flexShrink: 0, padding: '6px 12px', borderRadius: 6,
                  background: '#FEE2E2', border: '1px solid #FECACA',
                  color: '#DC2626', fontSize: '0.7rem', fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>Tutup</span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TopEvents({ searchQuery = '', activeCategory: externalCategory, onCategoryChange, onSelectEvent }) {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [active, setActive] = useState('Semua')
  const [locationFilter, setLocationFilter] = useState('Semua Lokasi')
  const [sortBy, setSortBy] = useState('default')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [paymentDetail, setPaymentDetail] = useState({})
  const [salesOpen, setSalesOpen] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (externalCategory && externalCategory !== active) setActive(externalCategory)
  }, [externalCategory, active])

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

  useEffect(() => {
    fetch('/api/payment-methods')
      .then(res => res.json())
      .then(data => {
        const methods = Array.isArray(data.paymentMethods) ? data.paymentMethods : []
        const withQris = methods.some(m => m.value === 'qris') ? methods : [...methods, { value: 'qris', label: 'QRIS', description: 'Scan pakai kamera HP' }]
        setPaymentMethods(withQris)
        if (withQris.length > 0) setSelectedMethod(withQris[0].value)
      })
      .catch(() => {
        const fallback = [{ value: 'qris', label: 'QRIS', description: 'Scan pakai kamera HP' }]
        setPaymentMethods(fallback)
        setSelectedMethod(fallback[0].value)
      })
  }, [])

  useEffect(() => {
    fetch('/api/sales-status')
      .then(res => res.json())
      .then(data => setSalesOpen(data.isSalesOpen !== false))
      .catch(() => setSalesOpen(true))
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()
  let filtered = events
    .filter(e => active === 'Semua' || e.category === active)
    .filter(e => {
      if (locationFilter === 'Semua Lokasi') return true
      return (e.location || '').toLowerCase().includes(locationFilter.toLowerCase())
    })
    .filter(e => {
      if (!normalizedQuery) return true
      const hay = [e.title, e.category, e.organizer, e.date, e.location, String(e.price)].join(' ').toLowerCase()
      return hay.includes(normalizedQuery)
    })

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return Number(a.price) - Number(b.price)
    if (sortBy === 'price_desc') return Number(b.price) - Number(a.price)
    if (sortBy === 'date_asc') return new Date(a.date || '2099') - new Date(b.date || '2099')
    return 0
  })

  const visibleEvents = showAll ? filtered : filtered.slice(0, 8)

  const handleSelectEvent = (ev) => {
    if (onSelectEvent) {
      onSelectEvent(ev)
      return
    }
    setMessage(''); setPromoCode(''); setAppliedPromo(null); setPromoError('')
    setQuantity(1); setPaymentDetail({}); setSelectedEvent(ev)
  }

  const handleApplyPromo = async () => {
    const code = promoCode.trim()
    if (!code) return
    setPromoLoading(true); setPromoError(''); setAppliedPromo(null)
    try {
      const res = await fetch('/api/promos')
      const data = await res.json()
      const promos = Array.isArray(data.promos) ? data.promos : []
      const found = promos.find(p => p.code?.toUpperCase() === code.toUpperCase())
      if (!found) setPromoError('Kode promo tidak valid atau sudah tidak aktif.')
      else { setAppliedPromo(found); setPromoError('') }
    } catch { setPromoError('Gagal memvalidasi kode promo.') }
    finally { setPromoLoading(false) }
  }

  const subtotal = selectedEvent ? Number(selectedEvent.price) * quantity : 0
  const discountAmount = appliedPromo ? Math.round(subtotal * (Number(appliedPromo.discountPercent || 0) / 100)) : 0
  const totalPrice = Math.max(0, subtotal - discountAmount)

  const handleCheckout = async () => {
    const eventId = Number(selectedEvent?.id)
    if (!eventId) { setMessage('ID event tidak valid.'); return }
    if (!selectedMethod) { setMessage('Pilih metode pembayaran terlebih dahulu.'); return }
    if (selectedMethod === 'debit' || selectedMethod === 'credit') {
      const { cardNumber = '', cardName = '', expiry = '', cvv = '' } = paymentDetail
      if (cardNumber.replace(/\s/g, '').length < 16) { setMessage('Nomor kartu harus 16 digit.'); return }
      if (!cardName.trim()) { setMessage('Nama di kartu wajib diisi.'); return }
      if (expiry.length < 5) { setMessage('Tanggal kadaluarsa tidak valid.'); return }
      if (cvv.length < 3) { setMessage('CVV tidak valid.'); return }
    }
    if (selectedMethod === 'bank' && !paymentDetail.senderName?.trim()) { setMessage('Nama pengirim wajib diisi.'); return }
    if (selectedMethod === 'e-wallet' && (!paymentDetail.phone || paymentDetail.phone.length < 9)) { setMessage('Nomor HP tidak valid.'); return }
    setLoading(true); setMessage('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, quantity: Number(quantity), paymentMethod: selectedMethod, promoCode: appliedPromo?.code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Checkout gagal')
      if (data.order) {
        navigate('/payment-success', {
          state: { eventTitle: data.order.eventTitle, paymentLabel: data.order.paymentLabel, total: data.order.total, orderId: data.order.id, quantity: data.order.quantity, price: data.order.price, discount: data.order.discountAmount, eventDate: selectedEvent?.date },
        })
      }
    } catch (err) { setMessage(err.message || 'Terjadi kesalahan saat checkout.') }
    finally { setLoading(false) }
  }

  return (
    <section id="top-events" className="reveal-section" style={{ padding: '90px 0', background: '#F4F5F7', position: 'relative' }}>
      <div id="jelajahi-festival" style={{ position: 'absolute', top: -70 }} />
      <div id="event-unggulan" style={{ position: 'absolute', top: -70 }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div className="reveal" style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 32, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <p className="label-eyebrow" style={{ marginBottom: 10 }}>Event Pilihan</p>
            <h2 className="section-title">
              Jelajahi Festival &amp; Konser
            </h2>
            <p style={{ color: '#4B5563', fontSize: '0.9rem', marginTop: 8 }}>
              Tiket resmi festival musik bergengsi dan konser spektakuler di KonserKu
            </p>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#0066CC', fontWeight: 600, fontSize: '0.88rem',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua Event'}
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Sales closed banner */}
        {!salesOpen && (
          <div style={{
            marginBottom: 24, padding: '12px 16px', borderRadius: 8,
            background: '#FEE2E2', border: '1px solid #FECACA',
            display: 'flex', alignItems: 'center', gap: 10, color: '#DC2626', fontSize: '0.86rem',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
            <span style={{ fontWeight: 700 }}>Penjualan tiket sedang ditutup sementara.</span>
            <span style={{ color: '#4B5563', marginLeft: 6 }}>Pembelian tidak tersedia saat ini.</span>
          </div>
        )}

        {/* Filter Controls Row: Category chips + Location Dropdown + Sort Dropdown */}
        <div
          className="reveal delay-100"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 32,
          }}
        >
          {/* Category filter */}
          <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActive(cat); if (onCategoryChange) onCategoryChange(cat) }}
                className={`chip ${active === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Location & Sort dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Lokasi Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px' }}>
              <svg width="13" height="13" fill="none" stroke="#0066CC" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#111827',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc} style={{ background: '#FFFFFF', color: '#111827' }}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Urutkan Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px' }}>
              <svg width="13" height="13" fill="none" stroke="#0066CC" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#111827',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ background: '#FFFFFF', color: '#111827' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search empty */}
        {normalizedQuery && filtered.length === 0 && !fetchLoading && (
          <div style={{ marginBottom: 24, padding: '16px 20px', borderRadius: 8, background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#4B5563', fontSize: '0.9rem' }}>
            Tidak ada event untuk filter atau pencarian "{searchQuery}".
          </div>
        )}

        {/* Grid */}
        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B6E7A', fontSize: '0.9rem' }}>
            Memuat daftar event…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: 20 }}>
            {visibleEvents.map((ev, i) => (
              <EventCard key={ev.id} ev={ev} idx={i} onBuy={handleSelectEvent} salesOpen={salesOpen} />
            ))}
          </div>
        )}

        {/* Show all toggle */}
        {filtered.length > 8 && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button onClick={() => setShowAll(!showAll)} className="btn-outline" style={{ padding: '12px 36px' }}>
              {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${filtered.length} Event)`}
            </button>
          </div>
        )}
      </div>

      {/* Checkout modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => { setSelectedEvent(null); setMessage('') }}
        title={`Beli Tiket: ${selectedEvent?.title || ''}`}
        description="Lengkapi informasi pemesanan dan checkout tiketmu sekarang."
        ctaLabel={loading ? 'Memproses…' : 'Selesaikan Pembayaran'}
        onCta={handleCheckout}
        secondaryLabel="Batal"
        closeOnCta={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Event info */}
          <div style={{ padding: '12px 14px', borderRadius: 9, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#111827' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#0066CC', letterSpacing: '0.08em', fontFamily: "'Space Grotesk', sans-serif" }}>{selectedEvent?.category}</span>
              <span style={{ fontSize: '0.76rem', color: '#6B7280' }}>{formatDate(selectedEvent?.date)}</span>
            </div>
            <strong style={{ color: '#111827', fontSize: '0.9rem' }}>{selectedEvent?.title}</strong>
          </div>

          {/* Quantity + subtotal */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 130 }}>
              <label style={{ color: '#4B5563', fontSize: '0.82rem', fontWeight: 700 }}>Jumlah Tiket (Maks 4)</label>
              <select
                value={quantity}
                onChange={e => { setQuantity(Number(e.target.value)); setAppliedPromo(null); setPromoError('') }}
                style={{ padding: '10px 12px', borderRadius: 8, background: '#FFFFFF', color: '#111827', border: '1px solid #D1D5DB', fontSize: '0.88rem', outline: 'none' }}
              >
                {[1, 2, 3, 4].map(v => (
                  <option key={v} value={v}>{v} tiket</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 150 }}>
              <label style={{ color: '#4B5563', fontSize: '0.82rem', fontWeight: 700 }}>Subtotal</label>
              <div style={{ padding: '10px 12px', borderRadius: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827', fontWeight: 700, fontSize: '0.92rem' }}>
                {formatPrice(subtotal)}
              </div>
            </div>
          </div>

          {/* Promo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ color: '#4B5563', fontSize: '0.82rem', fontWeight: 700 }}>Kode Promo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value.toUpperCase()); setAppliedPromo(null); setPromoError('') }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo() } }}
                placeholder="Contoh: EARLYBIRD30"
                style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#FFFFFF', color: '#111827', border: appliedPromo ? '1px solid #059669' : promoError ? '1px solid #DC2626' : '1px solid #D1D5DB', fontSize: '0.88rem', outline: 'none', fontFamily: "'Manrope', sans-serif" }}
              />
              <button type="button" onClick={handleApplyPromo} disabled={!promoCode.trim() || promoLoading} className="btn-primary" style={{ padding: '10px 18px', borderRadius: 8, fontSize: '0.84rem', whiteSpace: 'nowrap' }}>
                {promoLoading ? '…' : 'Gunakan'}
              </button>
            </div>
            {appliedPromo && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
                <div>
                  <div style={{ color: '#059669', fontSize: '0.78rem', fontWeight: 700 }}>{appliedPromo.title}</div>
                  <div style={{ color: '#059669', fontSize: '0.7rem' }}>Diskon {appliedPromo.discountPercent}% — hemat Rp {discountAmount.toLocaleString('id-ID')}</div>
                </div>
                <button onClick={() => { setAppliedPromo(null); setPromoCode(''); setPromoError('') }} style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontSize: 16 }}>×</button>
              </div>
            )}
            {promoError && <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.76rem' }}>{promoError}</div>}
          </div>

          {/* Payment method */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ color: '#4B5563', fontSize: '0.82rem', fontWeight: 700 }}>Metode Pembayaran</label>
            <select
              value={selectedMethod}
              onChange={e => { setSelectedMethod(e.target.value); setPaymentDetail(e.target.value === 'qris' ? { eventTitle: selectedEvent?.title, total: totalPrice, orderId: `KO-${Date.now()}` } : {}); setMessage('') }}
              style={{ padding: '10px 12px', borderRadius: 8, background: '#FFFFFF', color: '#111827', border: '1px solid #D1D5DB', fontSize: '0.88rem', outline: 'none' }}
            >
              {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          {/* Payment detail form */}
          {selectedMethod && (
            <div style={{ padding: '14px', borderRadius: 9, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              <PaymentDetailForm method={selectedMethod} detail={paymentDetail} onChange={setPaymentDetail} />
            </div>
          )}

          {/* Price summary */}
          <div style={{ padding: '12px 14px', borderRadius: 9, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#6B7280', marginBottom: 6 }}>
              <span>Subtotal</span><span style={{ color: '#111827' }}>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#059669', marginBottom: 6 }}>
                <span>Diskon ({appliedPromo?.discountPercent}%)</span>
                <span>− {formatPrice(discountAmount)}</span>
              </div>
            )}
            <div style={{ height: 1, background: '#E5E7EB', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span style={{ color: '#111827' }}>Total</span>
              <span style={{ color: '#0066CC', fontSize: '1.05rem' }}>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {message && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.82rem' }}>
              {message}
            </div>
          )}
        </div>
      </Modal>
    </section>
  )
}
