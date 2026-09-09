import { useState, useEffect } from 'react'

const Navbar = ({ searchQuery = '', onSearchChange = () => {}, activeCategory = 'Semua', onCategoryChange = () => {} }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCategoryClick = (cat) => {
    onCategoryChange(cat)
    setTimeout(() => {
      document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    setMobileOpen(false)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(10,10,20,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 18 }}>🎵</span>
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>
              <span className="text-gradient">Konser</span>
              <span style={{ color: '#fff' }}>Ku</span>
            </span>
          </div>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desktop-nav">
            {['Konser', 'Festival', 'Stand Up', 'Sports', 'Theater'].map(item => (
              <a
                key={item}
                href="#"
                onClick={e => { e.preventDefault(); handleCategoryClick(item) }}
                className="nav-link"
                style={{
                  color: activeCategory === item ? '#a78bfa' : '',
                  fontWeight: activeCategory === item ? 700 : 500,
                }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }} className="search-bar">
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Cari konser..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f3f4f6',
                    fontSize: '0.8rem',
                    width: '140px',
                  }}
                />
              </div>
            </form>

            {/* Location */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', color: '#d1d5db', fontSize: '0.8rem',
            }}
              className="location-btn"
            >
              <span style={{ color: '#a78bfa' }}>📍</span>
              Jakarta
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-menu-btn"
              style={{
                padding: 8, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                border: 'none', color: '#fff', cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path d="M6 18L18 6M6 6l12 12"/>
                  : <path d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{
            padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {['Konser', 'Festival', 'Stand Up', 'Sports', 'Theater'].map(item => (
              <a key={item} href="#"
                onClick={e => { e.preventDefault(); handleCategoryClick(item) }}
                style={{
                  color: activeCategory === item ? '#a78bfa' : '#d1d5db',
                  fontWeight: activeCategory === item ? 700 : 400,
                  padding: '10px 8px', fontSize: '0.9rem',
                  textDecoration: 'none', borderRadius: 8,
                  transition: 'background 0.2s',
                }}>{item}</a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .search-bar { display: none !important; }
          .location-btn { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
