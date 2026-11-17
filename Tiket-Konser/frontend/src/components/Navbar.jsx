import { useState, useEffect } from 'react'
import MyTicketsModal from './MyTicketsModal'
import AuthModal from './AuthModal'
import { showToast } from './Toast'

const Navbar = ({ searchQuery = '', onSearchChange = () => {}, activeCategory = 'Semua', onCategoryChange = () => {} }) => {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [ticketsOpen, setTicketsOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [ticketCount, setTicketCount] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)

  // Sync ticket count & user session
  const syncState = () => {
    try {
      const tickets = JSON.parse(localStorage.getItem('my_tickets') || '[]')
      setTicketCount(tickets.length)
      const user = JSON.parse(localStorage.getItem('user_session') || 'null')
      setCurrentUser(user)
    } catch {
      setTicketCount(0)
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    syncState()
    const handleStorage = () => syncState()
    window.addEventListener('storage', handleStorage)

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY
          setScrollY(currentY)

          const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight
          if (totalDocHeight > 0) {
            const pct = Math.min(100, Math.max(0, (currentY / totalDocHeight) * 100))
            setScrollProgress(pct)
          } else {
            setScrollProgress(0)
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ticketsOpen, authOpen])

  const isScrolled = scrollY > 20
  const isDeepScrolled = scrollY > 120

  const handleLogout = () => {
    localStorage.removeItem('user_session')
    setCurrentUser(null)
    showToast('Berhasil keluar dari akun.')
  }

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

  const categories = ['Konser', 'Festival', 'Stand Up', 'Sports', 'Theater']

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: 3,
          background: '#0066CC',
          boxShadow: '0 1px 2px rgba(0, 102, 204, 0.3)',
          zIndex: 9999,
          pointerEvents: 'none',
          transition: 'width 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          transition: 'background 0.25s ease, backdrop-filter 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          background: isScrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: isScrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)' : 'none',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

            {/* Logo */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                onCategoryChange('Semua')
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#0066CC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19V6l12-3v13"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.03em', color: '#111827' }}>
                Konser<span style={{ color: '#0066CC' }}>Ku</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desktop-nav">
              {categories.map(item => (
                <a
                  key={item}
                  href="#"
                  onClick={e => { e.preventDefault(); handleCategoryClick(item) }}
                  className={`nav-link ${activeCategory === item ? 'active-nav' : ''}`}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="search-bar">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 12px', borderRadius: 8,
                  background: '#F4F5F7',
                  border: '1px solid #E5E7EB',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                  onFocusCapture={e => { e.currentTarget.style.borderColor = '#0066CC'; e.currentTarget.style.background = '#FFFFFF' }}
                  onBlurCapture={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#F4F5F7' }}
                >
                  <svg width="13" height="13" fill="none" stroke="#6B7280" strokeWidth="2" viewBox="0 0 24 24">
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
                      color: '#111827',
                      fontSize: '0.82rem',
                      width: '130px',
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  />
                </div>
              </form>

              {/* Tiket Saya Button */}
              <button
                type="button"
                onClick={() => { syncState(); setTicketsOpen(true) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 12px',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  color: '#111827',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#F4F5F7' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF' }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
                </svg>
                <span>Tiket Saya</span>
                {ticketCount > 0 && (
                  <span
                    style={{
                      background: '#0066CC',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      borderRadius: '50%',
                      width: 17,
                      height: 17,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {ticketCount}
                  </span>
                )}
              </button>

              {/* Masuk / Daftar or Profile */}
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      color: '#0066CC',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669' }} />
                    <span>{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Keluar"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      color: '#4B5563',
                      borderRadius: 6,
                      padding: '6px 8px',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                    }}
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#0066CC',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#004C99'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0066CC'}
                >
                  Masuk / Daftar
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="mobile-menu-btn"
                style={{
                  padding: 8, borderRadius: 8,
                  background: '#F4F5F7',
                  border: '1px solid #E5E7EB',
                  color: '#111827', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
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
              padding: '12px 0 16px',
              borderTop: '1px solid #E5E7EB',
              display: 'flex', flexDirection: 'column', gap: 2,
              background: '#FFFFFF',
            }}>
              {/* Mobile search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 8, marginBottom: 8,
                background: '#F4F5F7',
                border: '1px solid #E5E7EB',
              }}>
                <svg width="13" height="13" fill="none" stroke="#6B7280" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder="Cari konser atau festival..."
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#111827', fontSize: '0.875rem', flex: 1,
                    fontFamily: "'Manrope', sans-serif",
                  }}
                />
              </div>

              {categories.map(item => (
                <a key={item} href="#"
                  onClick={e => { e.preventDefault(); handleCategoryClick(item) }}
                  style={{
                    color: activeCategory === item ? '#0066CC' : '#4B5563',
                    fontWeight: activeCategory === item ? 700 : 500,
                    padding: '11px 12px', fontSize: '0.9rem',
                    textDecoration: 'none', borderRadius: 8,
                    background: activeCategory === item ? '#EFF6FF' : 'transparent',
                    transition: 'background 0.15s',
                    fontFamily: "'Manrope', sans-serif",
                  }}>{item}</a>
              ))}
            </div>
          )}
        </div>

        <style>{`
          @media (max-width: 900px) {
            .desktop-nav { display: none !important; }
            .search-bar { display: none !important; }
          }
          @media (min-width: 901px) {
            .mobile-menu-btn { display: none !important; }
          }
        `}</style>
      </nav>

      {/* Tiket Saya Modal */}
      <MyTicketsModal isOpen={ticketsOpen} onClose={() => setTicketsOpen(false)} />

      {/* Masuk / Daftar Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user)
          syncState()
        }}
      />
    </>
  )
}

export default Navbar
