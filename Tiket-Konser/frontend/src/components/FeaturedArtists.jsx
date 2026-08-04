const artists = [
  { id:1, name:'Raisa',    genre:'Pop',         date:'12 Des 2026', emoji:'💜', gradFrom:'#4c1d95', gradTo:'#6d28d9', fans:'2.1M' },
  { id:2, name:'UNGU',     genre:'Rock',        date:'30 Okt 2026', emoji:'🎸', gradFrom:'#1e3a5f', gradTo:'#1e40af', fans:'3.5M' },
  { id:3, name:'Westlife', genre:'Pop',         date:'15 Sep 2026', emoji:'🌟', gradFrom:'#065f46', gradTo:'#0d9488', fans:'5.2M' },
  { id:4, name:'Noah',     genre:'Alternative', date:'10 Nov 2026', emoji:'🎵', gradFrom:'#881337', gradTo:'#be123c', fans:'4.1M' },
  { id:5, name:'Dewa 19',  genre:'Rock',        date:'22 Des 2026', emoji:'🔥', gradFrom:'#78350f', gradTo:'#b45309', fans:'3.8M' },
  { id:6, name:'Isyana',   genre:'Pop',         date:'05 Okt 2026', emoji:'✨', gradFrom:'#064e3b', gradTo:'#047857', fans:'1.7M' },
]

export default function FeaturedArtists() {
  return (
    <section style={{
      padding: '96px 0',
      background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0620 50%, #0a0a0f 100%)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#ec4899', marginBottom: 10,
          }}>
            🌟 Artis Pilihan
          </p>
          <h2 style={{
            fontFamily: 'Poppins,sans-serif',
            fontSize: 'clamp(1.6rem,3.5vw,2.2rem)',
            fontWeight: 900, color: '#fff', lineHeight: 1.1,
          }}>
            Artis{' '}
            <span style={{
              background: 'linear-gradient(135deg,#a78bfa,#ec4899,#f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Populer</span>
          </h2>
          <p style={{ color: '#6b7280', marginTop: 12, fontSize: '0.9rem' }}>
            Temukan konser artis favorit kamu sebelum tiket habis
          </p>
        </div>

        {/* Grid — min 200px, lebih besar dari sebelumnya (160px) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 20,
        }}>
          {artists.map(a => (
            <div
              key={a.id}
              style={{
                borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform   = 'translateY(-8px) scale(1.03)'
                e.currentTarget.style.boxShadow   = '0 24px 48px rgba(124,58,237,0.28)'
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.45)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform   = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow   = 'none'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
              }}
            >
              {/* Avatar — lebih tinggi */}
              <div style={{
                height: 180,
                background: `linear-gradient(135deg, ${a.gradFrom}, ${a.gradTo})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.22), transparent 60%)',
                }} />
                {/* Dots pattern */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.08,
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }} />
                <span style={{ fontSize: '4rem', position: 'relative', zIndex: 1, transition: 'transform 0.3s' }}>
                  {a.emoji}
                </span>
              </div>

              {/* Info */}
              <div style={{
                background: '#13131f',
                padding: '18px 16px 20px',
                textAlign: 'center',
              }}>
                <p style={{ color: '#f9fafb', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                  {a.name}
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: 10 }}>
                  {a.genre}
                </p>
                {/* Concert date pill */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 99,
                  background: 'rgba(167,139,250,0.12)',
                  border: '1px solid rgba(167,139,250,0.25)',
                  marginBottom: 10,
                }}>
                  <span style={{ fontSize: 11 }}>📅</span>
                  <span style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600 }}>{a.date}</span>
                </div>
                <p style={{ color: '#374151', fontSize: '0.72rem' }}>{a.fans} fans</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
