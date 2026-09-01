import { useState } from 'react'

const promos = [
  {
    id: 1, tag: 'LIMITED OFFER', title: 'Early Bird', sub: 'Diskon 30%',
    desc: 'Pesan tiket lebih awal dan hemat hingga 30% untuk konser pilihan bulan ini.',
    code: 'EARLYBIRD30', expires: '31 Agustus 2026', emoji: '🎟️',
    gradFrom: '#5b21b6', gradTo: '#7c3aed',
  },
  {
    id: 2, tag: 'NEW USER', title: 'Pengguna Baru', sub: 'Bebas Biaya Admin',
    desc: 'Daftar sekarang dan nikmati pembelian pertama tanpa biaya admin apapun.',
    code: 'NEWUSER2026', expires: 'Tidak terbatas', emoji: '🎉',
    gradFrom: '#9f1239', gradTo: '#ec4899',
  },
]

const stats = [
  { icon: '🎫', val: '50.000+', label: 'Tiket Terjual' },
  { icon: '🎪', val: '500+',    label: 'Event Aktif' },
  { icon: '🎤', val: '200+',    label: 'Artis Terdaftar' },
  { icon: '⭐', val: '4.9/5',   label: 'Rating Pengguna' },
]

export default function PromoSection() {
  const [copiedCode, setCopiedCode] = useState('')
  const [usedCode, setUsedCode] = useState('')

  const handleCopy = async (code) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.setAttribute('readonly', '')
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      setCopiedCode(code)
      setTimeout(() => setCopiedCode(''), 1800)
    } catch {
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(''), 1800)
    }
  }

  const handleUsePromo = (code) => {
    setUsedCode(code)
    setTimeout(() => setUsedCode(''), 2200)
  }

  return (
    <section style={{
      padding: '96px 0',
      background: 'linear-gradient(180deg,#0a0a0f,#0d0620 50%,#0a0a0f)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#ec4899', marginBottom: 10,
          }}>
            🎁 Penawaran Spesial
          </p>
          <h2 style={{
            fontFamily: 'Poppins,sans-serif',
            fontSize: 'clamp(1.6rem,3.5vw,2.2rem)',
            fontWeight: 900, color: '#fff',
          }}>
            Promo &{' '}
            <span style={{
              background: 'linear-gradient(135deg,#a78bfa,#ec4899,#f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Diskon</span>
          </h2>
        </div>

        {/* Promo cards — padding lebih besar, min lebih lebar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24, marginBottom: 52,
        }}>
          {promos.map(p => (
            <div
              key={p.id}
              style={{
                borderRadius: 28, padding: '44px 40px',
                background: `linear-gradient(135deg, ${p.gradFrom}, ${p.gradTo})`,
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform  = 'translateY(-6px)'
                e.currentTarget.style.boxShadow  = '0 28px 56px rgba(0,0,0,0.45)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform  = 'translateY(0)'
                e.currentTarget.style.boxShadow  = 'none'
              }}
            >
              {/* Glow orb */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 80% 10%, rgba(255,255,255,0.15), transparent 55%)',
                pointerEvents: 'none',
              }} />
              {/* Big emoji bg */}
              <div style={{
                position: 'absolute', top: -16, right: -16,
                fontSize: 120, opacity: 0.1, lineHeight: 1, pointerEvents: 'none',
              }}>
                {p.emoji}
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                  display: 'inline-block', padding: '5px 14px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.18)', color: '#fff',
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
                  marginBottom: 20,
                }}>
                  {p.tag}
                </span>

                <h3 style={{
                  color: '#fff', fontFamily: 'Poppins,sans-serif',
                  fontWeight: 800, fontSize: '1.4rem', marginBottom: 6,
                }}>
                  {p.title}
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.95)', fontWeight: 900,
                  fontSize: '1.9rem', marginBottom: 14,
                  fontFamily: 'Poppins,sans-serif',
                }}>
                  {p.sub}
                </p>
                <p style={{
                  color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem',
                  lineHeight: 1.6, marginBottom: 28,
                }}>
                  {p.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                  {/* Kode */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.22)',
                    borderRadius: 12, padding: '10px 18px',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>Kode:</span>
                    <span style={{
                      fontFamily: 'monospace', fontWeight: 800,
                      fontSize: '0.95rem', color: '#fff', letterSpacing: '0.1em',
                    }}>
                      {p.code}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleCopy(p.code)
                      }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: copiedCode === p.code ? '#fff' : 'rgba(255,255,255,0.5)', padding: 0, lineHeight: 1,
                      }}
                      title="Salin kode promo"
                    >
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                  </div>
                  {/* CTA */}
                  <button
                    onClick={() => handleUsePromo(p.code)}
                    style={{
                      padding: '10px 22px', borderRadius: 12,
                      background: usedCode === p.code ? '#111827' : '#fff', color: usedCode === p.code ? '#fff' : '#111',
                      fontWeight: 700, fontSize: '0.875rem',
                      border: 'none', cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                  >
                    {usedCode === p.code ? 'Kode Dipakai ✓' : 'Pakai Sekarang →'}
                  </button>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: 14 }}>
                  Berlaku hingga: {p.expires}
                </p>
                {(copiedCode === p.code || usedCode === p.code) && (
                  <p style={{ color: '#fef3c7', fontSize: '0.8rem', marginTop: 8, fontWeight: 600 }}>
                    {copiedCode === p.code ? 'Kode promo berhasil disalin.' : 'Kode promo berhasil dipilih.'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats — lebih tinggi */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
        }}>
          {stats.map(s => (
            <div
              key={s.label}
              style={{
                textAlign: 'center', padding: '36px 24px', borderRadius: 24,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor  = 'rgba(124,58,237,0.35)'
                e.currentTarget.style.background   = 'rgba(124,58,237,0.06)'
                e.currentTarget.style.transform    = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.background   = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.transform    = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
              <p style={{
                fontFamily: 'Poppins,sans-serif', fontWeight: 900,
                fontSize: '1.8rem', color: '#fff', marginBottom: 6,
              }}>
                {s.val}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
