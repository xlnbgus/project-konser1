import { useNavigate } from 'react-router-dom'

const steps = [
  { n:'01', icon:'🔍', title:'Cari Event',     desc:'Temukan konser atau event favoritmu dari ribuan pilihan di seluruh Indonesia.',        gradFrom:'#4c1d95', gradTo:'#7c3aed' },
  { n:'02', icon:'🎫', title:'Pilih Tiket',    desc:'Pilih kategori tiket yang sesuai budget dan preferensi tempat dudukmu.',               gradFrom:'#881337', gradTo:'#ec4899' },
  { n:'03', icon:'💳', title:'Bayar Mudah',    desc:'Bayar dengan transfer bank, e-wallet, kartu kredit, dan banyak metode lainnya.',       gradFrom:'#0c4a6e', gradTo:'#0ea5e9' },
  { n:'04', icon:'🎉', title:'Nikmati Konser', desc:'Dapatkan e-tiket di emailmu dan tunjukkan QR code saat masuk ke venue.',               gradFrom:'#78350f', gradTo:'#f59e0b' },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <section style={{ padding: '96px 0', background: '#0a0a0f' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#22d3ee', marginBottom: 10,
          }}>
            ⚡ Mudah & Cepat
          </p>
          <h2 style={{
            fontFamily: 'Poppins,sans-serif',
            fontSize: 'clamp(1.6rem,3.5vw,2.2rem)',
            fontWeight: 900, color: '#fff',
          }}>
            Cara{' '}
            <span style={{
              background: 'linear-gradient(135deg,#a78bfa,#ec4899,#f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Kerja</span>
          </h2>
          <p style={{ color: '#6b7280', marginTop: 14, fontSize: '0.9rem', maxWidth: 380, margin: '14px auto 0' }}>
            Beli tiket konser favoritmu dalam 4 langkah mudah, hanya butuh beberapa menit
          </p>
        </div>

        {/* Steps — min 240px, padding lebih besar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24, marginBottom: 60,
        }}>
          {steps.map((st, i) => (
            <div
              key={st.n}
              style={{
                borderRadius: 24, padding: '36px 28px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                textAlign: 'center', position: 'relative',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, background 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform   = 'translateY(-10px)'
                e.currentTarget.style.borderColor = `rgba(124,58,237,0.4)`
                e.currentTarget.style.background  = 'rgba(124,58,237,0.07)'
                e.currentTarget.style.boxShadow   = '0 20px 40px rgba(124,58,237,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform   = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.background  = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.boxShadow   = 'none'
              }}
            >
              {/* Step number badge */}
              <div style={{
                display: 'inline-block', padding: '4px 14px', borderRadius: 99,
                background: `linear-gradient(135deg,${st.gradFrom},${st.gradTo})`,
                color: '#fff', fontSize: '0.72rem', fontWeight: 800,
                marginBottom: 24, letterSpacing: '0.05em',
              }}>
                {st.n}
              </div>

              {/* Icon — lebih besar */}
              <div style={{
                width: 80, height: 80, borderRadius: 22, margin: '0 auto 20px',
                background: `linear-gradient(135deg,${st.gradFrom},${st.gradTo})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36,
                boxShadow: `0 12px 28px rgba(0,0,0,0.35)`,
              }}>
                {st.icon}
              </div>

              <h3 style={{
                color: '#fff', fontFamily: 'Poppins,sans-serif',
                fontWeight: 700, fontSize: '1.1rem', marginBottom: 12,
              }}>
                {st.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.65 }}>
                {st.desc}
              </p>

              {/* Connector arrow between cards */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: '50%', right: -16,
                  transform: 'translateY(-50%)',
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.3)', fontSize: 18,
                  zIndex: 10,
                }}>
                  ›
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              padding: '16px 44px', borderRadius: 18, fontSize: '1rem', fontWeight: 700,
              color: '#fff', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
              boxShadow: '0 8px 28px rgba(124,58,237,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 14px 36px rgba(124,58,237,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 8px 28px rgba(124,58,237,0.4)' }}
          >
            Mulai Beli Tiket Sekarang
          </button>
          <p style={{ color: '#4b5563', fontSize: '0.82rem', marginTop: 12 }}>
            Tidak perlu mendaftar untuk melihat event
          </p>
        </div>
      </div>
    </section>
  )
}
