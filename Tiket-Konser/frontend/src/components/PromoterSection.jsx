const PROMOTERS = [
  {
    name: 'Ismaya Live',
    desc: 'DWP, We The Fest, Joyland',
    badge: 'RESMI',
    gradient: 'linear-gradient(135deg, #FF3366 0%, #FF6B4A 100%)',
    glowColor: 'rgba(255, 51, 102, 0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    name: 'PK Entertainment',
    desc: 'Coldplay, Westlife, Ed Sheeran',
    badge: 'RESMI',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    name: 'Demajors',
    desc: 'Synchronize Festival',
    badge: 'RESMI',
    gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    ),
  },
  {
    name: 'Boss Creator',
    desc: 'Pestapora Festival',
    badge: 'RESMI',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <circle cx="8" cy="12" r="2.5" />
        <circle cx="16" cy="12" r="2.5" />
        <path d="M8 8h8" />
      </svg>
    ),
  },
  {
    name: 'Dyandra Global',
    desc: 'K-Pop Tours, SMTOWN',
    badge: 'RESMI',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    glowColor: 'rgba(236, 72, 153, 0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M2 9h20" />
        <path d="M10 3l2 6 2-6" />
      </svg>
    ),
  },
  {
    name: 'Otello Asia',
    desc: 'Dewa 19 All Stars Stadium',
    badge: 'RESMI',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
  {
    name: 'Majelis Lucu Indonesia',
    desc: 'Comedy Tours Nasional',
    badge: 'RESMI',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    name: 'Aloka Live',
    desc: 'Noah The Great Journey',
    badge: 'RESMI',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)',
    glowColor: 'rgba(6, 182, 212, 0.3)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10v3" />
        <path d="M6 6v11" />
        <path d="M10 3v18" />
        <path d="M14 8v7" />
        <path d="M18 5v13" />
        <path d="M22 10v3" />
      </svg>
    ),
  },
]

export default function PromoterSection() {
  const marqueeList = [...PROMOTERS, ...PROMOTERS]

  return (
    <section id="promotor" className="reveal-section" style={{ padding: '80px 0 90px', background: '#F4F5F7', borderTop: '1px solid #E5E7EB', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }} className="reveal">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              marginBottom: 12,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0066CC' }} />
            <span
              style={{
                color: '#0066CC',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                fontFamily: "'Space Grotesk', sans-serif",
                textTransform: 'uppercase',
              }}
            >
              Kemitraan Promotor Resmi
            </span>
          </div>
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 8 }}>
            Dipercaya Promotor &amp; Event Organizer Terbesar
          </h2>
          <p style={{ color: '#4B5563', fontSize: '0.88rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            Semua tiket yang dijual di KonserKu berasal langsung dari promotor resmi dengan jaminan keaslian 100% barcode gate-entry.
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Marquee Track (Slows down on hover) */}
      <div
        className="promoter-marquee-container reveal delay-100"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          padding: '12px 0 24px',
        }}
      >
        {/* Soft gradient edge masks */}
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 120,
            background: 'linear-gradient(to right, #F4F5F7 25%, transparent)',
            zIndex: 6, pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 120,
            background: 'linear-gradient(to left, #F4F5F7 25%, transparent)',
            zIndex: 6, pointerEvents: 'none',
          }}
        />

        <div className="promoter-marquee-track">
          {marqueeList.map((p, idx) => (
            <div
              key={`${p.name}-${idx}`}
              style={{
                width: 290,
                flexShrink: 0,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0066CC'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 102, 204, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Aesthetic Vector Icon Badge */}
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: p.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'transform 0.25s ease',
                }}
              >
                {p.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <h4
                    style={{
                      margin: 0,
                      color: '#111827',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.name}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      background: '#D1FAE5',
                      border: '1px solid #A7F3D0',
                      color: '#059669',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 700,
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
                <p style={{ margin: 0, color: '#4B5563', fontSize: '0.74rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
