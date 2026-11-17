import { useState, useEffect } from 'react'
import CountUpNumber from './CountUpNumber'
import syncImg from '../assets/events/synchronize-fest.jpg'
import westlifeImg from '../assets/artists/westlife.jpg'
import wtfImg from '../assets/events/wethefest.jpg'

const slides = [
  {
    tag: 'FESTIVAL MUSIK',
    badge: '3 Hari Penuh Musik',
    title: 'Synchronize',
    accent: 'Festival 2026',
    sub: 'INDONESIAN MULTI-GENRE MUSIC CELEBRATION',
    description: 'Perayaan musik Indonesia terbesar yang menampilkan ratusan artis dari berbagai genre — rock, pop, jazz, hingga elektronik. Selama 3 hari penuh di bawah langit malam Jakarta.',
    venue: 'Gambir Expo Kemayoran, Jakarta',
    date: '3–5 Oktober 2026',
    price: 'Mulai Rp450.000',
    priceRaw: 450000,
    eventTitle: 'Synchronize Festival 2026',
    ticketsAvailable: '2.800',
    image: syncImg,
    stats: [{ v: '35K+', l: 'Tiket Terjual' }, { v: '40K', l: 'Kapasitas' }, { v: '4.9★', l: 'Rating' }],
  },
  {
    tag: 'WORLD TOUR',
    badge: 'Hampir Habis',
    title: 'Westlife',
    accent: 'World Tour',
    sub: 'THE GREATEST HITS LIVE ARENA TOUR',
    description: 'Westlife kembali ke Indonesia dalam tur dunia mereka yang epik! Nikmati medley hits legendaris dari "Swear It Again", "Flying Without Wings", hingga "My Love" live di hadapan puluhan ribu penonton.',
    venue: 'GBK Stadium, Jakarta',
    date: '15 September 2026',
    price: 'Mulai Rp750.000',
    priceRaw: 750000,
    eventTitle: 'Westlife World Tour 2026',
    ticketsAvailable: '420',
    image: westlifeImg,
    stats: [{ v: '18K+', l: 'Tiket Terjual' }, { v: '20K', l: 'Kapasitas' }, { v: '5.0★', l: 'Rating' }],
  },
  {
    tag: 'SUMMER FESTIVAL',
    badge: 'Presale 2 Dibuka',
    title: 'We The Fest',
    accent: 'Summer 2026',
    sub: 'MUSIC · ARTS · FASHION · FOOD EXPERIENCE',
    description: 'We The Fest bukan sekadar konser — ini adalah perayaan gaya hidup. Musik dari artis lokal dan internasional, pameran seni interaktif, fashion bazaar, dan kuliner terbaik.',
    venue: 'GBK Sports Complex, Jakarta',
    date: '21–23 Agustus 2026',
    price: 'Mulai Rp750.000',
    priceRaw: 750000,
    eventTitle: 'We The Fest (WTF) 2026',
    ticketsAvailable: '3.400',
    image: wtfImg,
    stats: [{ v: '24K+', l: 'Tiket Terjual' }, { v: '30K', l: 'Kapasitas' }, { v: '4.9★', l: 'Rating' }],
  },
]

export default function HeroSection({ onSelectEvent }) {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [locationModal, setLocationModal] = useState(null)

  const goTo = (next) => {
    if (fading) return
    setFading(true)
    setTimeout(() => {
      setIdx(next)
      setFading(false)
    }, 280)
  }

  useEffect(() => {
    const t = setInterval(() => {
      goTo((idx + 1) % slides.length)
    }, 6000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  const s = slides[idx]

  const handleBuyClick = () => {
    if (onSelectEvent) {
      onSelectEvent(s)
    }
  }

  return (
    <>
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: '#FFFFFF',
        }}
      >
        {/* Background image with clean light overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: fading ? 0 : 0.6,
            transition: 'opacity 0.4s ease',
          }}
        >
          <img
            src={s.image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Light gradient overlays for 100% text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, #FFFFFF 0%, #FFFFFF 45%, rgba(255,255,255,0.88) 68%, rgba(255,255,255,0.25) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0.4) 30%, transparent 70%)',
            }}
          />
        </div>

        {/* Slide number watermark */}
        <div
          style={{
            position: 'absolute',
            top: 90,
            right: 36,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '5rem',
            fontWeight: 800,
            color: 'rgba(17, 24, 39, 0.05)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.04em',
          }}
        >
          0{idx + 1}
        </div>

        {/* Content Container */}
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            width: '100%',
            paddingTop: 110,
            paddingBottom: 90,
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.28s ease, transform 0.28s ease',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div style={{ maxWidth: 700 }}>

            {/* Eyebrow Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '6px 14px',
                  borderRadius: 6,
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#0066CC',
                  textTransform: 'uppercase',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#0066CC',
                    display: 'inline-block',
                  }}
                />
                {s.tag}
              </span>

              <span
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  background: '#FEE2E2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {s.badge}
              </span>
            </div>

            {/* Headline Title */}
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3.2rem, 7.5vw, 5.2rem)',
                fontWeight: 800,
                lineHeight: 0.98,
                color: '#111827',
                margin: '0 0 4px',
                letterSpacing: '-0.03em',
              }}
            >
              {s.title}
            </h1>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3.2rem, 7.5vw, 5.2rem)',
                fontWeight: 800,
                lineHeight: 0.98,
                margin: '0 0 20px',
                letterSpacing: '-0.03em',
                color: '#0066CC',
              }}
            >
              {s.accent}
            </h1>

            {/* Sub-label */}
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#4B5563',
                textTransform: 'uppercase',
                marginBottom: 16,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {s.sub}
            </p>

            {/* Description */}
            <p
              style={{
                fontSize: '1rem',
                color: '#4B5563',
                lineHeight: 1.7,
                maxWidth: 580,
                marginBottom: 28,
                fontWeight: 400,
              }}
            >
              {s.description}
            </p>

            {/* Meta pills: Venue & Date */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
              <button
                onClick={() => setLocationModal(s.venue)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#111827',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F4F5F7'
                  e.currentTarget.style.borderColor = '#0066CC'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF'
                  e.currentTarget.style.borderColor = '#E5E7EB'
                }}
              >
                <svg width="14" height="14" fill="none" stroke="#0066CC" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {s.venue}
              </button>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#111827',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <svg width="14" height="14" fill="none" stroke="#0066CC" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {s.date}
              </div>
            </div>

            {/* Price + CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24, marginBottom: 40 }}>
              <div>
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: '#6B7280',
                    marginBottom: 2,
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  Harga Tiket
                </p>
                <p
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#111827',
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.price}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                {/* Royal Blue Main Button */}
                <button
                  onClick={handleBuyClick}
                  style={{
                    padding: '13px 28px',
                    borderRadius: 8,
                    background: '#0066CC',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'background 0.15s ease',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#004C99'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0066CC'
                  }}
                >
                  Beli Tiket Sekarang →
                </button>

                {/* Secondary Button */}
                <button
                  onClick={() => document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  style={{
                    padding: '13px 24px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    color: '#111827',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F4F5F7'
                    e.currentTarget.style.borderColor = '#D1D5DB'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF'
                    e.currentTarget.style.borderColor = '#E5E7EB'
                  }}
                >
                  Lihat Detail
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div style={{ display: 'flex', gap: 36 }}>
              {s.stats.map((st) => (
                <div key={st.l} style={{ borderLeft: '3px solid #0066CC', paddingLeft: 14 }}>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#111827',
                      margin: 0,
                    }}
                  >
                    <CountUpNumber value={st.v} />
                  </p>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: '#6B7280',
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {st.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicators & Navigation Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            zIndex: 3,
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  height: 4,
                  borderRadius: 2,
                  width: i === idx ? 32 : 12,
                  background: i === idx ? '#0066CC' : '#E5E7EB',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: '←', fn: () => goTo((idx - 1 + slides.length) % slides.length) },
              { label: '→', fn: () => goTo((idx + 1) % slides.length) },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.fn}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  color: '#111827',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0066CC'
                  e.currentTarget.style.borderColor = '#0066CC'
                  e.currentTarget.style.color = '#FFFFFF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF'
                  e.currentTarget.style.borderColor = '#E5E7EB'
                  e.currentTarget.style.color = '#111827'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 36,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: '#6B7280',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1.5,
              height: 32,
              background: 'linear-gradient(to bottom, #0066CC, transparent)',
            }}
          />
        </div>
      </section>

      {/* Location Modal */}
      {locationModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setLocationModal(null)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(17, 24, 39, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 12,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              padding: '24px',
            }}
          >
            <h3
              style={{
                margin: '0 0 8px',
                color: '#111827',
                fontSize: '1.05rem',
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {locationModal}
            </h3>
            <p style={{ margin: '0 0 14px', color: '#4B5563', fontSize: '0.84rem' }}>
              Buka navigasi lokasi venue konser langsung di Google Maps.
            </p>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: '#F4F5F7',
                border: '1px solid #E5E7EB',
                color: '#111827',
                marginBottom: 16,
                fontSize: '0.88rem',
              }}
            >
              📍 {locationModal}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationModal + ', Indonesia')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px 20px',
                  borderRadius: 8,
                  background: '#0066CC',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Buka di Maps ↗
              </a>
              <button
                onClick={() => setLocationModal(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  color: '#4B5563',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
