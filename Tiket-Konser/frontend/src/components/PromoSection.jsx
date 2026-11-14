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

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // fallback untuk browser tanpa Clipboard API
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export default function PromoSection() {
  // copiedCode: kode yang baru saja disalin via tombol copy icon
  const [copiedCode, setCopiedCode] = useState('')
  // usedCode: kode yang baru saja disalin via tombol "Pakai Sekarang"
  const [usedCode, setUsedCode]     = useState('')

  const handleCopyIcon = async (code, e) => {
    e.stopPropagation()
    await copyToClipboard(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  // "Pakai Sekarang" = salin kode lalu scroll ke section event
  const handleUsePromo = async (code) => {
    await copyToClipboard(code)
    setUsedCode(code)
    setTimeout(() => setUsedCode(''), 2500)
    // scroll ke #top-events agar user bisa langsung paste kode
    const section = document.getElementById('top-events')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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

        {/* Promo cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24, marginBottom: 52,
        }}>
          {promos.map(p => {
            const isCopied = copiedCode === p.code
            const isUsed   = usedCode === p.code

            return (
              <div
                key={p.id}
                style={{
                  borderRadius: 28, padding: '44px 40px',
                  background: `linear-gradient(135deg, ${p.gradFrom}, ${p.gradTo})`,
                  position: 'relative', overflow: 'hidden', cursor: 'default',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 28px 56px rgba(0,0,0,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Glow */}
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
                    {/* Kode + tombol salin */}
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
                      {/* Tombol salin ikon */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyIcon(p.code, e)}
                        title={isCopied ? 'Tersalin!' : 'Salin kode promo'}
                        style={{
                          background: isCopied ? 'rgba(255,255,255,0.2)' : 'none',
                          border: 'none', cursor: 'pointer', padding: '3px 5px',
                          borderRadius: 6, lineHeight: 1,
                          color: isCopied ? '#fff' : 'rgba(255,255,255,0.55)',
                          transition: 'color 0.2s, background 0.2s',
                        }}
                      >
                        {isCopied
                          ? (
                            /* centang */
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            /* copy */
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                          )
                        }
                      </button>
                    </div>

                    {/* Pakai Sekarang */}
                    <button
                      type="button"
                      onClick={() => handleUsePromo(p.code)}
                      title="Salin kode dan pergi ke daftar event"
                      style={{
                        padding: '10px 22px', borderRadius: 12,
                        background: isUsed ? 'rgba(0,0,0,0.5)' : '#fff',
                        color: isUsed ? '#86efac' : '#111',
                        fontWeight: 700, fontSize: '0.875rem',
                        border: 'none', cursor: 'pointer',
                        transition: 'transform 0.2s, background 0.2s, color 0.2s',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                      onMouseEnter={e => { if (!isUsed) e.currentTarget.style.transform = 'scale(1.04)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      {isUsed
                        ? <>✓ Kode Disalin & Siap Dipakai</>
                        : <>Pakai Sekarang →</>
                      }
                    </button>
                  </div>

                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: 14 }}>
                    Berlaku hingga: {p.expires}
                  </p>

                  {/* Feedback copy */}
                  {(isCopied || isUsed) && (
                    <div style={{
                      marginTop: 10, padding: '8px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ fontSize: 14 }}>📋</span>
                      <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
                        {isUsed
                          ? `Kode "${p.code}" disalin! Tempel di kolom promo saat checkout.`
                          : `Kode "${p.code}" berhasil disalin ke clipboard.`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats */}
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
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'
                e.currentTarget.style.background  = 'rgba(124,58,237,0.06)'
                e.currentTarget.style.transform   = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.background  = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.transform   = 'translateY(0)'
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
