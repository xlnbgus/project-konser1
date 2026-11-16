import { useState, useEffect } from 'react'
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
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: '#0D0F14',
        }}
      >
        {/* Background image with high-contrast dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: fading ? 0 : 0.5,
            transition: 'opacity 0.5s ease',
          }}
        >
          <img
            src={s.image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Multi-layer gradient backdrop to ensure 100% readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(13,15,20,0.98) 0%, rgba(13,15,20,0.92) 48%, rgba(13,15,20,0.6) 80%, rgba(13,15,20,0.4) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(13,15,20,1) 0%, rgba(13,15,20,0.4) 40%, transparent 80%)',
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
            color: 'rgba(255,255,255,0.06)',
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
                  background: 'rgba(217,93,57,0.25)',
                  border: '1.5px solid #D95D39',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: '0 2px 10px rgba(217,93,57,0.3)',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#FF6B4A',
                    boxShadow: '0 0 8px #FF6B4A',
                    display: 'inline-block',
                  }}
                />
                {s.tag}
              </span>

              <span
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {s.badge}
              </span>
            </div>

            {/* Headline Title: FORCED HIGH-CONTRAST BRIGHT WHITE */}
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3.2rem, 7.5vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 0.95,
                color: '#FFFFFF',
                margin: '0 0 4px',
                letterSpacing: '-0.03em',
                textShadow: '0 4px 24px rgba(0,0,0,0.9)',
              }}
            >
              {s.title}
            </h1>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3.2rem, 7.5vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 0.95,
                margin: '0 0 20px',
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                textShadow: '0 4px 24px rgba(0,0,0,0.9)',
              }}
            >
              <span style={{ color: '#D95D39', textShadow: '0 0 30px rgba(217,93,57,0.5)' }}>
                {s.accent}
              </span>
            </h1>

            {/* Sub-label */}
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#FFFFFF',
                opacity: 0.9,
                textTransform: 'uppercase',
                marginBottom: 20,
                fontFamily: "'Space Grotesk', sans-serif",
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              {s.sub}
            </p>

            {/* Description: FORCED BRIGHT WHITE */}
            <p
              style={{
                fontSize: '1rem',
                color: '#FFFFFF',
                lineHeight: 1.75,
                maxWidth: 580,
                marginBottom: 28,
                textShadow: '0 2px 12px rgba(0,0,0,0.9)',
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
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(217,93,57,0.25)'
                  e.currentTarget.style.borderColor = '#D95D39'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
                }}
              >
                <svg width="14" height="14" fill="none" stroke="#D95D39" strokeWidth="2.5" viewBox="0 0 24 24">
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
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <svg width="14" height="14" fill="none" stroke="#D95D39" strokeWidth="2.5" viewBox="0 0 24 24">
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
                    color: '#FFFFFF',
                    opacity: 0.85,
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
                    color: '#FFFFFF',
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 14px rgba(0,0,0,0.9)',
                  }}
                >
                  {s.price}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                {/* Vibrant Burnt Orange Main Button */}
                <button
                  onClick={handleBuyClick}
                  style={{
                    padding: '14px 30px',
                    borderRadius: 8,
                    background: '#D95D39',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 6px 25px rgba(217,93,57,0.5)',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#C04E2D'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#D95D39'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Beli Tiket Sekarang →
                </button>

                {/* Secondary Button */}
                <button
                  onClick={() => document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  style={{
                    padding: '14px 24px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Space Grotesk', sans-serif",
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.borderColor = '#FFFFFF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  }}
                >
                  Lihat Detail
                </button>
              </div>
            </div>

            {/* Statistics: Bright White Text & High Contrast */}
            <div style={{ display: 'flex', gap: 36 }}>
              {s.stats.map((st) => (
                <div key={st.l} style={{ borderLeft: '3px solid #D95D39', paddingLeft: 14 }}>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: 0,
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                    }}
                  >
                    {st.v}
                  </p>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: '#FFFFFF',
                      opacity: 0.85,
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
                  background: i === idx ? '#D95D39' : 'rgba(255,255,255,0.35)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: i === idx ? '0 0 10px rgba(217,93,57,0.8)' : 'none',
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
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s, transform 0.2s',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D95D39'
                  e.currentTarget.style.borderColor = '#D95D39'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
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
              color: 'rgba(255,255,255,0.6)',
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
              background: 'linear-gradient(to bottom, #D95D39, transparent)',
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
            background: 'rgba(10,11,15,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 14,
              background: '#161920',
              border: '1px solid rgba(245,243,238,0.12)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              padding: '24px',
            }}
          >
            <h3
              style={{
                margin: '0 0 8px',
                color: '#F5F3EE',
                fontSize: '1.05rem',
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {locationModal}
            </h3>
            <p style={{ margin: '0 0 14px', color: '#9095A1', fontSize: '0.84rem' }}>
              Buka navigasi lokasi venue konser langsung di Google Maps.
            </p>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                background: 'rgba(245,243,238,0.04)',
                border: '1px solid rgba(245,243,238,0.08)',
                color: '#F5F3EE',
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
                  padding: '11px 20px',
                  borderRadius: 8,
                  background: '#D95D39',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Buka di Maps ↗
              </a>
              <button
                onClick={() => setLocationModal(null)}
                style={{
                  padding: '11px 20px',
                  borderRadius: 8,
                  background: 'rgba(245,243,238,0.06)',
                  border: '1px solid rgba(245,243,238,0.12)',
                  color: '#F5F3EE',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
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
