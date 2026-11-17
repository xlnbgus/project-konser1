import { useState } from 'react'
import { showToast } from './Toast'
import CountUpNumber from './CountUpNumber'

const promos = [
  {
    id: 1, tag: 'EARLY BIRD', title: 'Early Bird Pass',
    sub: 'Diskon 30%',
    desc: 'Pesan tiket festival & konser lebih awal dan hemat hingga 30% untuk event pilihan.',
    code: 'EARLYBIRD30', expires: '31 Agustus 2026',
  },
  {
    id: 2, tag: 'NEW USER', title: 'Pengguna Baru',
    sub: 'Bebas Biaya Admin',
    desc: 'Daftar sekarang dan nikmati pembelian tiket pertamamu tanpa potongan biaya admin.',
    code: 'NEWUSER2026', expires: 'Tidak terbatas',
  },
]

const stats = [
  { val: '50.000+', label: 'Tiket Terjual' },
  { val: '500+',    label: 'Event & Festival' },
  { val: '200+',    label: 'Musisi & Artis' },
  { val: '4.9/5',   label: 'Rating Pengguna' },
]

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true }
    const ta = document.createElement('textarea')
    ta.value = text; ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
    document.body.appendChild(ta); ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta); return ok
  } catch { return false }
}

export default function PromoSection() {
  const [copiedCode, setCopiedCode] = useState('')
  const [usedCode, setUsedCode] = useState('')

  const handleCopyIcon = async (code, e) => {
    e.stopPropagation()
    await copyToClipboard(code)
    setCopiedCode(code)
    showToast(`Kode "${code}" berhasil disalin!`)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const handleUsePromo = async (code) => {
    await copyToClipboard(code)
    setUsedCode(code)
    showToast(`Kode "${code}" disalin! Gunakan saat checkout.`)
    setTimeout(() => setUsedCode(''), 2500)
    document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="promo" className="reveal-section" style={{ padding: '90px 0', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Stats row with Count-Up animation */}
        <div className="reveal" style={{ marginBottom: 64 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden', background: '#E5E7EB' }}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`reveal-scale delay-${(i % 4) * 90}`}
                style={{
                  padding: '28px 24px', textAlign: 'center',
                  background: '#FFFFFF',
                  borderRight: i < stats.length - 1 ? '1px solid #E5E7EB' : 'none',
                }}
              >
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.75rem', color: '#111827', marginBottom: 4, letterSpacing: '-0.03em' }}>
                  <CountUpNumber value={s.val} />
                </p>
                <p style={{ color: '#4B5563', fontSize: '0.82rem', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: 40 }}>
          <p className="label-eyebrow" style={{ marginBottom: 10 }}>Penawaran Spesial</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 className="section-title">Promo &amp; Diskon Menarik</h2>
            <p style={{ color: '#4B5563', fontSize: '0.88rem', maxWidth: 320, lineHeight: 1.6 }}>
              Gunakan voucher dan nikmati pengalaman nonton lebih hemat
            </p>
          </div>
        </div>

        {/* Promo cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {promos.map((p, idx) => {
            const isCopied = copiedCode === p.code
            const isUsed = usedCode === p.code
            return (
              <div
                key={p.id}
                className={`reveal-scale ${idx === 1 ? 'delay-200' : 'delay-100'}`}
                style={{
                  borderRadius: 12, padding: '36px 32px',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  position: 'relative', overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.borderColor = '#0066CC'
                  e.currentTarget.style.boxShadow = '0 10px 20px -3px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#E5E7EB'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Accent top line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#0066CC' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#0066CC',
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                    marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {p.tag}
                  </span>

                  <h3 style={{ color: '#111827', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.25rem', marginBottom: 4 }}>
                    {p.title}
                  </h3>
                  <p style={{ color: '#0066CC', fontWeight: 800, fontSize: '1.65rem', marginBottom: 12, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                    {p.sub}
                  </p>
                  <p style={{ color: '#4B5563', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 24 }}>
                    {p.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                    {/* Code pill */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#F4F5F7', border: '1px dashed #D1D5DB',
                      borderRadius: 8, padding: '9px 14px',
                    }}>
                      <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>KODE:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#111827', letterSpacing: '0.1em' }}>
                        {p.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyIcon(p.code, e)}
                        title={isCopied ? 'Tersalin!' : 'Salin kode'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 4, color: isCopied ? '#059669' : '#6B7280', transition: 'color 0.15s' }}
                      >
                        {isCopied ? (
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() => handleUsePromo(p.code)}
                      style={{
                        padding: '10px 20px', borderRadius: 8,
                        background: isUsed ? '#D1FAE5' : '#0066CC',
                        color: isUsed ? '#059669' : '#FFFFFF',
                        fontWeight: 700, fontSize: '0.84rem',
                        border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s',
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                      onMouseEnter={e => { if (!isUsed) e.currentTarget.style.background = '#004C99' }}
                      onMouseLeave={e => { if (!isUsed) e.currentTarget.style.background = '#0066CC' }}
                    >
                      {isUsed ? '✓ Disalin' : 'Pakai →'}
                    </button>
                  </div>

                  <p style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: 14 }}>
                    Berlaku hingga: {p.expires}
                  </p>

                  {(isCopied || isUsed) && (
                    <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#059669', fontSize: '0.78rem', fontWeight: 600 }}>
                      {isUsed
                        ? `Kode "${p.code}" disalin! Tempel di kolom promo saat checkout.`
                        : `Kode "${p.code}" berhasil disalin ke clipboard.`
                      }
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
