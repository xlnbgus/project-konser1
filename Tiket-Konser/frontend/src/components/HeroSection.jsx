import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    tag: 'FEATURED EVENT',
    badge: '2 Hari',
    badgeColor: '#7c3aed',
    title: 'Echoes of',
    accent: 'Innocence',
    sub: 'THE RHYTHM OF OUR ROOTS',
    venue: 'Usmar Ismail Hall',
    date: '29–30 Agustus 2026',
    price: 'Mulai Rp350.000',
    ticketsAvailable: '2.800',
    emoji: '🎸',
    bgFrom: '#1a0533',
    bgVia: '#0d0620',
    orb1: '#7c3aed',
    orb2: '#ec4899',
    accentColor: '#a78bfa',
    headerGrad: 'linear-gradient(135deg, #4c1d95, #5b21b6)',
    particles: ['🎵','🎶','🎸','🎹','🎼'],
    stats: [{ v: '12.4K+', l: 'Tiket Terjual' }, { v: '15K', l: 'Kapasitas' }, { v: '4.9★', l: 'Rating' }],
  },
  {
    tag: 'HOT TICKET',
    badge: 'Hampir Habis',
    badgeColor: '#f97316',
    title: 'Westlife',
    accent: 'World Tour',
    sub: 'THE GREATEST HITS LIVE',
    venue: 'GBK Arena, Jakarta',
    date: '15 September 2026',
    price: 'Mulai Rp750.000',
    ticketsAvailable: '420',
    emoji: '🎤',
    bgFrom: '#001a33',
    bgVia: '#030d1a',
    orb1: '#3b82f6',
    orb2: '#06b6d4',
    accentColor: '#60a5fa',
    headerGrad: 'linear-gradient(135deg, #1e3a5f, #1e40af)',
    particles: ['⭐','🌟','✨','💫','🎤'],
    stats: [{ v: '18K+', l: 'Tiket Terjual' }, { v: '20K', l: 'Kapasitas' }, { v: '5.0★', l: 'Rating' }],
  },
  {
    tag: 'EXCLUSIVE SHOW',
    badge: 'Baru Dibuka',
    badgeColor: '#16a34a',
    title: 'Jazz Under',
    accent: 'The Stars',
    sub: 'AN INTIMATE JAZZ EXPERIENCE',
    venue: 'Taman Ismail Marzuki',
    date: '5 Oktober 2026',
    price: 'Mulai Rp450.000',
    ticketsAvailable: '5.800',
    emoji: '🎺',
    bgFrom: '#1a0f00',
    bgVia: '#120a00',
    orb1: '#d97706',
    orb2: '#ea580c',
    accentColor: '#fbbf24',
    headerGrad: 'linear-gradient(135deg, #78350f, #92400e)',
    particles: ['🎺','🎷','🎻','🎹','🎵'],
    stats: [{ v: '3.2K+', l: 'Tiket Terjual' }, { v: '5K', l: 'Kapasitas' }, { v: '4.8★', l: 'Rating' }],
  },
]

// Floating particle
const Particle = ({ emoji, top, right, delay, duration }) => (
  <div style={{
    position: 'absolute', top, right,
    fontSize: 22, opacity: 0.25,
    animation: `float ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    pointerEvents: 'none', userSelect: 'none',
  }}>
    {emoji}
  </div>
)

export default function HeroSection() {
  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = (next) => {
    if (fading) return
    setFading(true)
    setTimeout(() => { setIdx(next); setFading(false) }, 280)
  }

  const handleBuyTicket = () => navigate('/login')
  const handleViewDetail = () => document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  useEffect(() => {
    const t = setInterval(() => goTo((idx + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [idx])

  const s = slides[idx]

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${s.bgFrom} 0%, ${s.bgVia} 50%, #0a0a0f 100%)`,
      transition: 'background 0.8s',
    }}>
      {/* Orb glow backgrounds */}
      <div style={{
        position: 'absolute', top: '15%', left: '5%',
        width: 480, height: 480, borderRadius: '50%',
        background: s.orb1, filter: 'blur(130px)', opacity: 0.18,
        transition: 'background 0.8s',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 360, height: 360, borderRadius: '50%',
        background: s.orb2, filter: 'blur(100px)', opacity: 0.14,
        transition: 'background 0.8s',
        pointerEvents: 'none',
      }} />

      {/* Grid dots */}
      <div className="dots-pattern" style={{
        position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
      }} />

      {/* Particles */}
      {s.particles.map((p, i) => (
        <Particle
          key={`${idx}-${i}`}
          emoji={p}
          top={`${12 + i * 14}%`}
          right={`${3 + i * 5}%`}
          delay={i * 0.4}
          duration={3 + i * 0.5}
        />
      ))}

      {/* Content */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        width: '100%', paddingTop: 80, paddingBottom: 60,
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(10px)' : 'translateY(0)',
        transition: 'opacity 0.28s, transform 0.28s',
      }}>
        <div className="hero-grid">
          {/* ── LEFT: Text ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Tags row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 99,
                background: `${s.accentColor}22`,
                border: `1px solid ${s.accentColor}44`,
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
                color: s.accentColor, textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: s.accentColor,
                  animation: 'pulseDot 1.5s ease-in-out infinite',
                  display: 'inline-block',
                }} />
                {s.tag}
              </div>
              <span style={{
                padding: '5px 12px', borderRadius: 99,
                background: s.badgeColor, color: '#fff',
                fontSize: '0.72rem', fontWeight: 700,
              }}>
                {s.badge}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                fontWeight: 900, lineHeight: 1.05,
                color: '#fff', margin: 0,
              }}>
                {s.title}
              </h1>
              <h1 className="text-gradient" style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                fontWeight: 900, lineHeight: 1.05,
                margin: 0,
              }}>
                {s.accent}
              </h1>
            </div>

            {/* Subtitle */}
            <p style={{
              fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.3em', color: '#6b7280',
              textTransform: 'uppercase',
            }}>
              {s.sub}
            </p>

            {/* Info chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { icon: '📍', text: s.venue },
                { icon: '📅', text: s.date },
              ].map(chip => (
                <div key={chip.text} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${s.accentColor}33`,
                  fontSize: '0.82rem', color: '#d1d5db',
                  backdropFilter: 'blur(8px)',
                }}>
                  <span>{chip.icon}</span>
                  {chip.text}
                </div>
              ))}
            </div>

            {/* Price + CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: 2 }}>Harga tiket</p>
                <p style={{
                  fontSize: '1.4rem', fontWeight: 800,
                  color: s.accentColor,
                }}>
                  {s.price}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" onClick={handleBuyTicket}>Beli Tiket Sekarang</button>
                <button className="btn-outline" onClick={handleViewDetail}>Lihat Detail</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 28, paddingTop: 8 }}>
              {s.stats.map(st => (
                <div key={st.l}>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>{st.v}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{st.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Ticket visual ── */}
          <div className="hero-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              {/* Floating card */}
              <div className="hero-ticket animate-float" style={{ position: 'relative', zIndex: 2 }}>
                {/* Header */}
                <div className="hero-ticket-header" style={{ background: s.headerGrad }}>
                  <div className="dots-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
                  <div style={{ position: 'relative', textAlign: 'center', zIndex: 2 }}>
                    <div style={{ fontSize: 52, marginBottom: 6 }}>{s.emoji}</div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      Live Performance
                    </p>
                    <p style={{
                      color: '#fff', fontFamily: 'Poppins,sans-serif', fontWeight: 800,
                      fontSize: '1.05rem', marginTop: 4,
                    }}>
                      {s.accent}
                    </p>
                  </div>
                  {/* Spotlight */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12), transparent 70%)',
                  }} />
                </div>

                {/* Perforated divider */}
                <div className="hero-ticket-perforated">
                  <div style={{
                    position: 'absolute', left: '20px', right: '20px', top: '50%',
                    borderTop: '1px dashed rgba(255,255,255,0.12)',
                  }} />
                </div>

                {/* Body */}
                <div className="hero-ticket-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Venue</p>
                      <p style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{s.venue}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Tanggal</p>
                      <p style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{s.date}</p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: '#6b7280', marginBottom: 3 }}>Harga</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 800, color: s.accentColor }}>{s.price}</p>
                    </div>
                    {/* QR placeholder */}
                    <div style={{
                      width: 56, height: 56, background: '#fff', borderRadius: 10, padding: 6,
                      display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 2,
                    }}>
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} style={{ borderRadius: 1, background: [0,2,4,10,14,20,22,24,6,12,18].includes(i) ? '#111' : '#fff' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="glass" style={{
                position: 'absolute', top: 18, right: 18,
                padding: '10px 16px', borderRadius: 14,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 10,
              }}>
                <p style={{ fontSize: '0.68rem', color: '#9ca3af', marginBottom: 2 }}>Tersedia</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{s.ticketsAvailable || '2.800'} tiket</p>
              </div>
              <div className="glass" style={{
                position: 'absolute', bottom: 18, left: 18,
                padding: '10px 16px', borderRadius: 14,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                zIndex: 10,
              }}>
                <p style={{ fontSize: '0.68rem', color: '#9ca3af', marginBottom: 2 }}>Terjual</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#22c55e' }}>82% ✓</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide controls ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 48, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  height: 8, borderRadius: 4,
                  width: i === idx ? 32 : 8,
                  background: i === idx ? s.accentColor : 'rgba(255,255,255,0.2)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: '‹', fn: () => goTo((idx - 1 + slides.length) % slides.length) },
              { label: '›', fn: () => goTo((idx + 1) % slides.length) },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.fn}
                className="glass"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  color: '#fff', fontSize: 22, border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#4b5563', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{
          width: 22, height: 36, borderRadius: 11,
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          paddingTop: 6,
        }}>
          <div className="animate-bounce-y" style={{
            width: 4, height: 8, borderRadius: 2,
            background: 'rgba(255,255,255,0.4)',
          }} />
        </div>
      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .hero-right { display: none !important; }
        }
      `}</style>
    </section>
  )
}
