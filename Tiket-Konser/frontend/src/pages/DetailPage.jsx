import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import SeatMap, { TIER_CONFIG } from '../components/SeatMap'
import { showToast } from '../components/Toast'
import LiveChatWidget from '../components/LiveChatWidget'

// Fallback images
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

const FALLBACK_EVENTS = [
  { id: 101, title: 'Synchronize Festival 2026', description: 'Synchronize Festival adalah perayaan musik multi-genre tahunan terbesar di Indonesia yang menampilkan ratusan musisi legendaris hingga talenta baru.', date: '2026-10-03', location: 'Gambir Expo Kemayoran, Jakarta', price: 450000, category: 'Festival', organizer: 'Demajors x Dyandra', image: syncFestImg, status: 'available' },
  { id: 102, title: 'We The Fest (WTF) 2026', description: 'Festival musim panas perpaduan musik, seni, mode, dan kuliner terakbar di Asia Tenggara.', date: '2026-08-21', location: 'GBK Sports Complex, Jakarta', price: 750000, category: 'Festival', organizer: 'Ismaya Live', image: wtfImg, status: 'available' },
  { id: 103, title: 'Pestapora 2026', description: 'Perayaan akbar selebrasi musik Indonesia dengan puluhan panggung spektakuler.', date: '2026-09-18', location: 'JIExpo Kemayoran, Jakarta', price: 550000, category: 'Festival', organizer: 'Boss Creator', image: pestaporaImg, status: 'available' },
  { id: 104, title: 'Djakarta Warehouse Project (DWP) 2026', description: 'Festival dance music elektronik spektakuler kelas dunia.', date: '2026-12-11', location: 'JIExpo Kemayoran, Jakarta', price: 950000, category: 'Festival', organizer: 'Ismaya Live', image: dwpImg, status: 'available' },
  { id: 1, title: 'UNGU – Waktu yang Dinanti Final Chapter', description: 'Konser perayaan mahakarya perjalanan band legendaris UNGU.', date: '2026-10-30', location: 'ICE BSD, Tangerang', price: 550000, category: 'Konser', organizer: 'TipTip', image: unguImg, status: 'available' },
  { id: 2, title: 'Westlife World Tour 2026', description: 'The Greatest Hits Tour membawakan deretan lagu legendaris.', date: '2026-09-15', location: 'GBK Stadium, Jakarta', price: 750000, category: 'Konser', organizer: 'PK Entertainment', image: westlifeImg, status: 'available' },
  { id: 3, title: 'SNOOPY RUN 2026', description: 'Lari santai keluarga dan komunitas runners paling meriah.', date: '2026-09-06', location: 'Tangerang Selatan', price: 499000, category: 'Sports', organizer: 'Provaliant Sports', image: snoopyRunImg, status: 'available' },
  { id: 4, title: 'Stand Up Comedy Special: Cerita Rasa', description: 'Show penuh tawa dari para komika papan atas Indonesia.', date: '2026-11-08', location: 'Teater Jakarta, TIM', price: 250000, category: 'Stand Up', organizer: 'Majelis Lucu Indonesia', image: standupImg, status: 'available' },
  { id: 5, title: 'Dewa 19 All Stars Stadium Tour', description: 'Konser megah stadion bersama musisi legendaris.', date: '2026-12-22', location: 'Gelora Bung Karno, Jakarta', price: 650000, category: 'Konser', organizer: 'Otello Asia', image: dewa19Img, status: 'available' },
  { id: 6, title: 'Noah – The Great Journey Live', description: 'Penampilan spektakuler Noah menyanyikan lagu hits terbaik.', date: '2026-11-10', location: 'Edutorium UMS, Solo', price: 500000, category: 'Konser', organizer: 'Aloka Live', image: noahImg, status: 'available' },
  { id: 7, title: 'Raisa Live in Concert Jakarta', description: 'Malam penuh lantunan melodi romantis dari Raisa.', date: '2026-12-12', location: 'Tennis Indoor Senayan, Jakarta', price: 600000, category: 'Konser', organizer: 'JUNI Concert', image: raisaImg, status: 'available' },
]

function resolveImage(ev) {
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

const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString('id-ID')}`

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function DetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()

  const [event, setEvent] = useState(() => {
    if (location.state?.event) return location.state.event
    try {
      const saved = sessionStorage.getItem('selected_event')
      if (saved) return JSON.parse(saved)
    } catch {}
    return null
  })

  // Stepper & Tier
  const [step, setStep] = useState(1)
  const [selectedTier, setSelectedTier] = useState('FESTIVAL')
  const [quantity, setQuantity] = useState(1) // Max 4

  // Customer Form
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerNik, setBuyerNik] = useState('')

  // Promo Code
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')

  // Payment Selection: 'qris' | 'va' | 'gopay'
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [vaBank, setVaBank] = useState('BCA')

  // Timer: 15 minutes (900 seconds)
  const [timeLeft, setTimeLeft] = useState(15 * 60)

  // Checkout process & modal
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [purchasedTicket, setPurchasedTicket] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Auto-fill customer data if logged in
  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('user_session') || 'null')
      if (session) {
        if (session.name && !buyerName) setBuyerName(session.name)
        if (session.email && !buyerEmail) setBuyerEmail(session.email)
        if (session.phone && !buyerPhone) setBuyerPhone(session.phone)
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Countdown Timer
  useEffect(() => {
    if (step === 2 && !paymentCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            showToast('Waktu reservasi habis. Silakan ulangi checkout.', 'error')
            setStep(1)
            return 15 * 60
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, paymentCompleted])

  // Load event if missing
  useEffect(() => {
    if (event) {
      sessionStorage.setItem('selected_event', JSON.stringify(event))
      return
    }
    const eventId = params.get('id')
    fetch('/api/events')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d.events) && d.events.length > 0 ? d.events : FALLBACK_EVENTS
        const matched = list.find((e) => String(e.id) === String(eventId)) || list[0]
        setEvent(matched)
        sessionStorage.setItem('selected_event', JSON.stringify(matched))
      })
      .catch(() => {
        const matched = FALLBACK_EVENTS.find((e) => String(e.id) === String(eventId)) || FALLBACK_EVENTS[0]
        setEvent(matched)
        sessionStorage.setItem('selected_event', JSON.stringify(matched))
      })
  }, [event, params])

  if (!event) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#F4F5F7',
          color: '#111827',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <p style={{ color: '#4B5563', fontSize: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>Memuat detail konser…</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          ← Kembali ke Beranda
        </button>
      </div>
    )
  }

  // Calculations
  const basePrice = Number(event.price || 500000)
  const tierDelta = TIER_CONFIG[selectedTier]?.priceDelta || 0
  const unitPrice = Math.max(100000, basePrice + tierDelta)
  const subtotal = unitPrice * quantity
  const adminFee = 15000

  // Promo handling
  let discountAmount = 0
  if (appliedPromo) {
    if (appliedPromo.code === 'EARLYBIRD30' || appliedPromo.discountPercent === 30) {
      discountAmount = Math.round(subtotal * 0.3)
    } else if (appliedPromo.code === 'NEWUSER2026') {
      discountAmount = adminFee // Free admin
    } else {
      discountAmount = Math.round(subtotal * ((appliedPromo.discountPercent || 10) / 100))
    }
  }

  const finalTotal = Math.max(0, subtotal + adminFee - discountAmount)

  // Timer format (MM:SS)
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    setPromoError('')
    if (code === 'EARLYBIRD30') {
      setAppliedPromo({ code: 'EARLYBIRD30', title: 'Early Bird Pass (Diskon 30%)', discountPercent: 30 })
      showToast('Kode EARLYBIRD30 berhasil digunakan! Diskon 30% diterapkan.')
    } else if (code === 'NEWUSER2026') {
      setAppliedPromo({ code: 'NEWUSER2026', title: 'New User Promo (Bebas Biaya Layanan)' })
      showToast('Kode NEWUSER2026 aktif! Biaya layanan gratis.')
    } else {
      setPromoError('Kode promo tidak valid atau kadaluarsa.')
    }
  }

  const handleProceedToStep2 = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(2)
  }

  const handleSimulatePayment = () => {
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      showToast('Mohon lengkapi Data Pemesan (Nama, Email, dan WhatsApp).', 'error')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      const ticketCode = `KSR-${Math.floor(100000 + Math.random() * 900000)}`
      const newTicket = {
        id: `TKT-${Date.now()}`,
        ticketCode,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        location: event.location,
        organizer: event.organizer || 'KonserKu Official',
        tier: selectedTier,
        quantity,
        total: finalTotal,
        paymentMethod,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerPhone: buyerPhone.trim(),
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage 'my_tickets'
      try {
        const stored = JSON.parse(localStorage.getItem('my_tickets') || '[]')
        localStorage.setItem('my_tickets', JSON.stringify([newTicket, ...stored]))
      } catch {
        localStorage.setItem('my_tickets', JSON.stringify([newTicket]))
      }

      setPurchasedTicket(newTicket)
      setPaymentCompleted(true)
      showToast('Pembayaran Berhasil! E-Tiket telah disimpan ke Tiket Saya.')
    }, 1200)
  }

  const displayImage = resolveImage(event)

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', color: '#111827', paddingBottom: 80 }}>
      {/* Top Navigation Bar */}
      <div
        style={{
          background: 'rgba(255,255,255,0.96)',
          borderBottom: '1px solid #E5E7EB',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => {
              if (step === 2 && !paymentCompleted) setStep(1)
              else navigate('/')
            }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              padding: '8px 14px',
              color: '#111827',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0066CC'; e.currentTarget.style.background = '#EFF6FF' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF' }}
          >
            ← {step === 2 && !paymentCompleted ? 'Kembali ke Seat Map' : 'Kembali ke Beranda'}
          </button>

          {/* Stepper Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: step >= 1 ? '#0066CC' : '#E5E7EB',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </span>
              <span style={{ fontSize: '0.78rem', color: step === 1 ? '#111827' : '#6B7280', fontWeight: 600 }}>
                Pilih Seat Map
              </span>
            </div>
            <div style={{ width: 24, height: 1, background: '#E5E7EB' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: step === 2 ? '#0066CC' : '#E5E7EB',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </span>
              <span style={{ fontSize: '0.78rem', color: step === 2 ? '#111827' : '#6B7280', fontWeight: 600 }}>
                Checkout &amp; Bayar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: 1200, margin: '32px auto 0', padding: '0 24px' }}>

        {/* STEP 1: Detail & Interactive Seat Map */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 1fr)', gap: 32 }}>

            {/* Left Column: Event Hero & Seat Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Event Header Banner */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E5E7EB',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', height: 260, background: '#F3F4F6' }}>
                  <img
                    src={displayImage}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #FFFFFF 0%, transparent 70%)' }} />
                  <div style={{ position: 'absolute', top: 16, left: 16 }}>
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        color: '#0066CC',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {event.category?.toUpperCase() || 'KONSER RESMI'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '20px 24px' }}>
                  <h1
                    style={{
                      margin: '0 0 10px',
                      color: '#111827',
                      fontSize: '1.65rem',
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {event.title}
                  </h1>
                  <p style={{ color: '#4B5563', fontSize: '0.86rem', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {event.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, color: '#111827', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ color: '#0066CC' }}>📅</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ color: '#0066CC' }}>📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ color: '#0066CC' }}>🎤</span>
                      <span>Promotor: {event.organizer || 'Official'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Seat Map Component */}
              <SeatMap
                basePrice={basePrice}
                selectedTier={selectedTier}
                onSelectTier={(tier) => setSelectedTier(tier)}
              />
            </div>

            {/* Right Column: Order Summary & Stepper */}
            <div>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E5E7EB',
                  padding: '24px',
                  position: 'sticky',
                  top: 96,
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: '#111827',
                  }}
                >
                  Ringkasan Pilihan
                </h3>

                {/* Selected Tier Pill */}
                <div
                  style={{
                    padding: '14px',
                    borderRadius: 10,
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.72rem', color: '#0066CC', fontWeight: 700, letterSpacing: '0.06em' }}>
                      KATEGORI TERPILIH
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                      ● Tiket Tersedia
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    {TIER_CONFIG[selectedTier]?.name}
                  </h4>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0066CC', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {formatPrice(unitPrice)} <span style={{ fontSize: '0.75rem', color: '#6B6E7A', fontWeight: 400 }}>/ tiket</span>
                  </span>
                </div>

                {/* Ticket Quantity Selector (Max 4) */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111827' }}>
                      Jumlah Tiket
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#0066CC', fontWeight: 700 }}>
                      (Maks. 4 tiket)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: '#F3F4F6',
                        border: '1px solid #E5E7EB',
                        color: quantity <= 1 ? '#9CA3AF' : '#111827',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      −
                    </button>

                    <div
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#111827',
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {quantity} Tiket
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(4, q + 1))}
                      disabled={quantity >= 4}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: '#F3F4F6',
                        border: '1px solid #E5E7EB',
                        color: quantity >= 4 ? '#9CA3AF' : '#111827',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        cursor: quantity >= 4 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#6B6E7A', marginTop: 6 }}>
                    Sesuai ketentuan resmi promotor, 1 akun dibatasi maksimal 4 tiket untuk mencegah calo.
                  </span>
                </div>

                {/* Subtotal Preview */}
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 16, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#4B5563', marginBottom: 8 }}>
                    <span>Subtotal Tiket ({quantity}x)</span>
                    <span style={{ color: '#111827', fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#4B5563', marginBottom: 12 }}>
                    <span>Biaya Layanan &amp; Pajak</span>
                    <span style={{ color: '#111827', fontWeight: 600 }}>{formatPrice(adminFee)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700 }}>
                    <span style={{ color: '#111827' }}>Total Sementara</span>
                    <span style={{ color: '#0066CC', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {formatPrice(subtotal + adminFee)}
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: '0.92rem',
                  }}
                >
                  Lanjut ke Pembayaran →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Checkout & 15-Minute Countdown Timer */}
        {step === 2 && !paymentCompleted && (
          <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Sticky 15-Minute Timer Bar */}
            <div
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: 12,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                <div>
                  <h4 style={{ margin: 0, color: '#111827', fontSize: '0.88rem', fontWeight: 700 }}>
                    Selesaikan Pembayaran Sebelum Sesi Berakhir
                  </h4>
                  <p style={{ margin: 0, color: '#4B5563', fontSize: '0.74rem' }}>
                    Tiketmu dikunci sementara. Kursi akan dilepas kembali ke publik jika timer habis.
                  </p>
                </div>
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #0066CC',
                  borderRadius: 8,
                  padding: '6px 14px',
                  color: '#0066CC',
                  fontFamily: 'monospace',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                {formatTimer(timeLeft)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: 28 }}>

              {/* Left Column: Form Pemesan + Promo + Pembayaran */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Form Data Pemesan */}
                <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E5E7EB', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    1. Data Pemesan (E-Tiket Receiver)
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 5 }}>
                        Nama Lengkap (Sesuai KTP / SIM) *
                      </label>
                      <input
                        type="text"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 8,
                          background: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          color: '#111827',
                          fontSize: '0.85rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 5 }}>
                          Alamat Email *
                        </label>
                        <input
                          type="email"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          placeholder="email@domain.com"
                          required
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: 8,
                            background: '#FFFFFF',
                            border: '1px solid #D1D5DB',
                            color: '#111827',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 5 }}>
                          Nomor WhatsApp / HP *
                        </label>
                        <input
                          type="tel"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          required
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: 8,
                            background: '#FFFFFF',
                            border: '1px solid #D1D5DB',
                            color: '#111827',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 5 }}>
                        Nomor Identitas NIK / Paspor (Opsional)
                      </label>
                      <input
                        type="text"
                        value={buyerNik}
                        onChange={(e) => setBuyerNik(e.target.value)}
                        placeholder="16 digit NIK KTP (untuk validasi gate masuk)"
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 8,
                          background: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          color: '#111827',
                          fontSize: '0.85rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Input Kode Promo */}
                <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E5E7EB', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    2. Kode Promo &amp; Diskon
                  </h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Gunakan EARLYBIRD30 atau NEWUSER2026"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#111827',
                        fontSize: '0.85rem',
                        outline: 'none',
                        fontFamily: 'monospace',
                        letterSpacing: '0.05em',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 8,
                        background: '#0066CC',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      Terapkan
                    </button>
                  </div>

                  {appliedPromo && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: '#D1FAE5',
                        border: '1px solid #A7F3D0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#059669',
                        fontSize: '0.78rem',
                      }}
                    >
                      <span>✓ {appliedPromo.title}</span>
                      <button
                        onClick={() => { setAppliedPromo(null); setPromoCode('') }}
                        style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontSize: '1rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <div style={{ marginTop: 8, color: '#DC2626', fontSize: '0.75rem' }}>
                      {promoError}
                    </div>
                  )}
                </div>

                {/* Metode Pembayaran */}
                <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E5E7EB', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    3. Metode Pembayaran Resmi
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
                    {/* QRIS */}
                    <div
                      onClick={() => setPaymentMethod('qris')}
                      style={{
                        padding: '14px',
                        borderRadius: 10,
                        background: paymentMethod === 'qris' ? '#EFF6FF' : '#FFFFFF',
                        border: paymentMethod === 'qris' ? '1.5px solid #0066CC' : '1px solid #E5E7EB',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: 4 }}>📲</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827', display: 'block' }}>QRIS</span>
                      <span style={{ fontSize: '0.68rem', color: '#6B7280' }}>BCA, GoPay, ShopeePay</span>
                    </div>

                    {/* Virtual Account */}
                    <div
                      onClick={() => setPaymentMethod('va')}
                      style={{
                        padding: '14px',
                        borderRadius: 10,
                        background: paymentMethod === 'va' ? '#EFF6FF' : '#FFFFFF',
                        border: paymentMethod === 'va' ? '1.5px solid #0066CC' : '1px solid #E5E7EB',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: 4 }}>🏦</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827', display: 'block' }}>Virtual Account</span>
                      <span style={{ fontSize: '0.68rem', color: '#6B7280' }}>BCA, Mandiri, BNI, BRI</span>
                    </div>

                    {/* GoPay */}
                    <div
                      onClick={() => setPaymentMethod('gopay')}
                      style={{
                        padding: '14px',
                        borderRadius: 10,
                        background: paymentMethod === 'gopay' ? '#EFF6FF' : '#FFFFFF',
                        border: paymentMethod === 'gopay' ? '1.5px solid #0066CC' : '1px solid #E5E7EB',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: 4 }}>💳</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827', display: 'block' }}>GoPay / E-Wallet</span>
                      <span style={{ fontSize: '0.68rem', color: '#6B7280' }}>Instant Auto-Debit</span>
                    </div>
                  </div>

                  {/* Payment Method Details */}
                  {paymentMethod === 'qris' && (
                    <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '16px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                      <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: '#4B5563' }}>
                        Scan QRIS langsung dengan aplikasi Mobile Banking atau E-Wallet apa saja.
                      </p>
                      <div style={{ display: 'inline-block', padding: 8, background: '#FFFFFF', borderRadius: 8, border: '1px solid #E5E7EB' }}>
                        <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', color: '#111827', fontWeight: 700, fontSize: '0.75rem', border: '2px solid #111827' }}>
                          [ QRIS SIMULASI ]
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'va' && (
                    <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '16px', border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        {['BCA', 'Mandiri', 'BNI', 'BRI'].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setVaBank(bank)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 6,
                              background: vaBank === bank ? '#0066CC' : '#FFFFFF',
                              color: vaBank === bank ? '#FFFFFF' : '#4B5563',
                              border: vaBank === bank ? 'none' : '1px solid #D1D5DB',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block' }}>Nomor Virtual Account {vaBank}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: '#0066CC' }}>
                            88019-9281-4192
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { navigator.clipboard?.writeText('8801992814192'); showToast('Nomor VA berhasil disalin!') }}
                          style={{ padding: '6px 12px', borderRadius: 6, background: '#EFF6FF', color: '#0066CC', border: '1px solid #BFDBFE', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Salin
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'gopay' && (
                    <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '16px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '0.78rem', color: '#4B5563' }}>
                        Kamu akan diarahkan ke aplikasi GoPay setelah menekan tombol konfirmasi bayar di samping.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Confirmation */}
              <div>
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    border: '1px solid #E5E7EB',
                    padding: '24px',
                    position: 'sticky',
                    top: 96,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>
                    Rincian Pembayaran
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4B5563' }}>Event</span>
                      <span style={{ color: '#111827', fontWeight: 600, maxWidth: 170, textAlign: 'right' }}>{event.title}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4B5563' }}>Kategori Seat</span>
                      <span style={{ color: '#0066CC', fontWeight: 700 }}>{TIER_CONFIG[selectedTier]?.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4B5563' }}>Jumlah Tiket</span>
                      <span style={{ color: '#111827', fontWeight: 600 }}>{quantity} Tiket</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4B5563' }}>Harga Tiket</span>
                      <span style={{ color: '#111827', fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4B5563' }}>Biaya Layanan &amp; Pajak</span>
                      <span style={{ color: '#111827', fontWeight: 600 }}>{formatPrice(adminFee)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                        <span>Potongan Promo ({appliedPromo?.code})</span>
                        <span>− {formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 12, marginTop: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>Total Bayar</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0066CC' }}>
                          {formatPrice(finalTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 10,
                      background: '#0066CC',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(0,102,204,0.25)',
                      opacity: isProcessing ? 0.7 : 1,
                      transition: 'background 0.2s ease',
                    }}
                  >
                    {isProcessing ? 'Memproses Transaksi...' : 'Bayar Sekarang (Simulasi) →'}
                  </button>

                  <div style={{ marginTop: 14, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                      🔒 Transaksi aman berstandar enkripsi 256-bit SSL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Success Modal / Pass */}
        {paymentCompleted && purchasedTicket && (
          <div
            style={{
              maxWidth: 620,
              margin: '20px auto 0',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 18,
              padding: '36px 32px',
              textAlign: 'center',
              boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
              animation: 'fadeInUp 0.3s ease-out',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#D1FAE5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '2rem',
                border: '1px solid #A7F3D0',
              }}
            >
              ✓
            </div>

            <h2
              style={{
                margin: '0 0 6px',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              Pembayaran Berhasil!
            </h2>
            <p style={{ margin: '0 0 24px', color: '#4B5563', fontSize: '0.86rem', lineHeight: 1.5 }}>
              Selamat! Tiket konsermu telah diterbitkan secara resmi dan tersimpan di menu <strong>Tiket Saya</strong>.
            </p>

            {/* Ticket Card Preview */}
            <div
              style={{
                background: '#F9FAFB',
                border: '1px dashed #D1D5DB',
                borderRadius: 12,
                padding: '20px',
                marginBottom: 24,
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.72rem', color: '#0066CC', fontWeight: 700 }}>
                  E-TIKET KONSERKU #{purchasedTicket.ticketCode}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, background: '#D1FAE5', padding: '2px 8px', borderRadius: 4 }}>
                  TERKONFIRMASI
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#111827', fontWeight: 700 }}>
                {purchasedTicket.eventTitle}
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: '#6B7280' }}>
                📅 {formatDate(purchasedTicket.eventDate)} • 📍 {purchasedTicket.location}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.78rem' }}>
                <div>
                  <span style={{ color: '#6B7280', display: 'block' }}>Kategori</span>
                  <span style={{ color: '#111827', fontWeight: 700 }}>{purchasedTicket.tier} ({purchasedTicket.quantity} Tiket)</span>
                </div>
                <div>
                  <span style={{ color: '#6B7280', display: 'block' }}>Nama Pemesan</span>
                  <span style={{ color: '#111827', fontWeight: 600 }}>{purchasedTicket.buyerName}</span>
                </div>
                <div>
                  <span style={{ color: '#6B7280', display: 'block' }}>Metode Bayar</span>
                  <span style={{ color: '#111827', fontWeight: 600 }}>{purchasedTicket.paymentMethod?.toUpperCase()}</span>
                </div>
                <div>
                  <span style={{ color: '#6B7280', display: 'block' }}>Total Pembayaran</span>
                  <span style={{ color: '#0066CC', fontWeight: 700 }}>{formatPrice(purchasedTicket.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  background: '#0066CC',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Kembali ke Beranda &amp; Lihat Tiket
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  background: '#F3F4F6',
                  color: '#111827',
                  border: '1px solid #D1D5DB',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                🖨️ Cetak Bukti Pembelian
              </button>
            </div>
          </div>
        )}
      </div>
      <LiveChatWidget />
    </div>
  )
}
