import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const CAT_EMOJI = { Konser: '🎤', Festival: '🎪', 'Stand Up': '🎙️', Sports: '🏃', Theater: '🎭' }

export default function EventDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [event, setEvent] = useState(location.state?.event || null)
  const [loading, setLoading] = useState(!location.state?.event)
  const [imgError, setImgError] = useState(false)
  const [stockHovered, setStockHovered] = useState(false)

  useEffect(() => {
    if (event) return
    setLoading(true)
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data.events) ? data.events : []
        const found = list.find(e => String(e.id) === String(id))
        if (found) setEvent(found)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, event])

  if (loading) {
    return (
      <div style={{ background: '#08090d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar searchQuery='' onSearchChange={() => {}} activeCategory='Semua' onCategoryChange={() => {}} />
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Memuat detail event…</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div style={{ background: '#08090d', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Navbar searchQuery='' onSearchChange={() => {}} activeCategory='Semua' onCategoryChange={() => {}} />
        <p style={{ color: '#f8fafc', fontSize: '1.1rem', fontFamily: 'Poppins,sans-serif', fontWeight: 700 }}>Event tidak ditemukan.</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#ff462b,#ff7a00)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
          ← Kembali ke Beranda
        </button>
      </div>
    )
  }

  const emoji = CAT_EMOJI[event.category] || '🎵'
  const imgSrc = imgError ? null : (typeof event.image === 'string' ? event.image : null)
  const stock = event.stock ?? event.ticketsAvailable ?? 150

  return (
    <div style={{ background: '#08090d', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar searchQuery='' onSearchChange={() => {}} activeCategory='Semua' onCategoryChange={() => {}} />

      {/* Hero Banner */}
      <div style={{ position: 'relative', width: '100%', height: 420, overflow: 'hidden', background: '#0f1118' }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={event.title}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e1003 0%, #ff462b44 100%)' }} />
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #08090d 0%, rgba(8,9,13,0.55) 55%, rgba(8,9,13,0.2) 100%)',
        }} />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 24, left: 24, zIndex: 10,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 12,
            background: 'rgba(8,9,13,0.75)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.14)', color: '#f8fafc',
            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,70,43,0.18)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(8,9,13,0.75)' }}
        >
          ← Kembali
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Category badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 99, background: 'rgba(255,122,0,0.12)', border: '1px solid rgba(255,122,0,0.3)', width: 'fit-content' }}>
              <span>{emoji}</span>
              <span style={{ color: '#ff7a00', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{event.category}</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'Poppins,sans-serif', fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: '#f8fafc', lineHeight: 1.15, margin: 0,
            }}>
              {event.title}
            </h1>

            {/* Description */}
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 10 }}>TENTANG EVENT</p>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                {event.description || 'Nikmati pengalaman tak terlupakan bersama ribuan penonton di event spektakuler ini. Dapatkan tiket sebelum habis!'}
              </p>
            </div>

            {/* Info cards */}
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14 }}>INFORMASI EVENT</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '📅', label: 'Tanggal', value: formatDate(event.date) },
                  { icon: '📍', label: 'Venue', value: event.location || event.venue || '-' },
                  { icon: '🏢', label: 'Organizer', value: event.organizer || 'KonserKu' },
                  { icon: '🏷️', label: 'Kategori', value: event.category || '-' },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: '16px 18px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 4px' }}>{item.label}</p>
                      <p style={{ color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — sticky card */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{
              borderRadius: 24,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              {/* Card thumbnail */}
              {imgSrc && (
                <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                  <img src={imgSrc} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,13,0.9) 0%, transparent 60%)' }} />
                </div>
              )}

              <div style={{ padding: '24px' }}>
                {/* Price */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 6 }}>HARGA TIKET</p>
                  <p style={{
                    fontFamily: 'Poppins,sans-serif', fontWeight: 900,
                    fontSize: '2rem', margin: 0,
                    background: 'linear-gradient(135deg, #ff462b, #ff7a00)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {event.status === 'soldout' ? (
                      <span style={{ color: '#64748b', WebkitTextFillColor: '#64748b', fontSize: '1.1rem', fontWeight: 600 }}>Habis Terjual</span>
                    ) : formatPrice(event.price)}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: 4 }}>per tiket · sudah termasuk pajak</p>
                </div>

                {/* Stock */}
                <div
                  style={{
                    padding: '12px 16px', borderRadius: 12, marginBottom: 20,
                    background: stockHovered ? 'rgba(255,122,0,0.1)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'background 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={() => setStockHovered(true)}
                  onMouseLeave={() => setStockHovered(false)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🎟️</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Stok tiket tersisa</span>
                  </div>
                  <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.95rem' }}>{stock} tiket</span>
                </div>

                {/* CTA button */}
                {event.status === 'soldout' ? (
                  <div style={{ padding: '16px', borderRadius: 14, background: 'rgba(100,116,139,0.12)', border: '1px solid rgba(100,116,139,0.2)', textAlign: 'center', color: '#64748b', fontWeight: 700, fontSize: '0.95rem' }}>
                    Tiket Habis
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/checkout/' + event.id, { state: { event } })}
                    style={{
                      width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                      background: 'linear-gradient(135deg, #ff462b, #ff7a00)',
                      color: '#fff', fontFamily: 'Poppins,sans-serif',
                      fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 8px 28px rgba(255,70,43,0.4)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(255,70,43,0.55)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,70,43,0.4)' }}
                  >
                    🎟️ Beli Tiket Sekarang
                  </button>
                )}

                <p style={{ color: '#374151', fontSize: '0.72rem', textAlign: 'center', marginTop: 12 }}>
                  🔒 Transaksi dienkripsi & aman
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .event-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
