import { useState, useEffect } from 'react'
import MyTicketsModal from './MyTicketsModal'
import AuthModal from './AuthModal'
import { showToast } from './Toast'

const Navbar = ({ searchQuery = '', onSearchChange = () => {}, activeCategory = 'Semua', onCategoryChange = () => {} }) => {
  const [scrolled, setScrolled] = useState(false)
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
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ticketsOpen, authOpen])

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
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          transition: 'background 0.3s ease, border-color 0.3s ease',
          background: scrolled ? 'rgba(17, 19, 24, 0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(245, 243, 238, 0.07)' : '1px solid transparent',
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
                background: '#D95D39',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19V6l12-3v13"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', color: '#F5F3EE' }}>
                Konser<span style={{ color: '#D95D39' }}>Ku</span>
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
                  padding: '7px 12px', borderRadius: 7,
                  background: 'rgba(245, 243, 238, 0.06)',
                  border: '1px solid rgba(245, 243, 238, 0.1)',
                  transition: 'border-color 0.2s',
                }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(217, 93, 57, 0.4)'}
                  onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(245, 243, 238, 0.1)'}
                >
                  <svg width="13" height="13" fill="none" stroke="#6B6E7A" strokeWidth="2" viewBox="0 0 24 24">
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
                      color: '#F5F3EE',
                      fontSize: '0.8rem',
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
                  borderRadius: 7,
                  background: 'rgba(245, 243, 238, 0.06)',
                  border: '1px solid rgba(245, 243, 238, 0.12)',
                  color: '#F5F3EE',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D95D39'; e.currentTarget.style.background = 'rgba(217,93,57,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,243,238,0.12)'; e.currentTarget.style.background = 'rgba(245,243,238,0.06)' }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
                </svg>
                <span>Tiket Saya</span>
                {ticketCount > 0 && (
                  <span
                    style={{
                      background: '#D95D39',
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
                      borderRadius: 7,
                      background: 'rgba(217, 93, 57, 0.15)',
                      border: '1px solid rgba(217, 93, 57, 0.3)',
                      color: '#F5F3EE',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
                    <span>{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Keluar"
                    style={{
                      background: 'rgba(245,243,238,0.06)',
                      border: '1px solid rgba(245,243,238,0.1)',
                      color: '#9095A1',
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
                    padding: '7px 14px',
                    borderRadius: 7,
                    background: '#D95D39',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#C04E2D'}
                  onMouseLeave={e => e.currentTarget.style.background = '#D95D39'}
                >
                  Masuk / Daftar
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="mobile-menu-btn"
                style={{
                  padding: 8, borderRadius: 7,
                  background: 'rgba(245, 243, 238, 0.07)',
                  border: '1px solid rgba(245, 243, 238, 0.1)',
                  color: '#F5F3EE', cursor: 'pointer',
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
              borderTop: '1px solid rgba(245, 243, 238, 0.07)',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              {/* Mobile search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 7, marginBottom: 8,
                background: 'rgba(245, 243, 238, 0.05)',
                border: '1px solid rgba(245, 243, 238, 0.09)',
              }}>
                <svg width="13" height="13" fill="none" stroke="#6B6E7A" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder="Cari konser atau festival..."
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#F5F3EE', fontSize: '0.875rem', flex: 1,
                    fontFamily: "'Manrope', sans-serif",
                  }}
                />
              </div>

              {categories.map(item => (
                <a key={item} href="#"
                  onClick={e => { e.preventDefault(); handleCategoryClick(item) }}
                  style={{
                    color: activeCategory === item ? '#D95D39' : 'rgba(245, 243, 238, 0.65)',
                    fontWeight: activeCategory === item ? 600 : 500,
                    padding: '11px 12px', fontSize: '0.9rem',
                    textDecoration: 'none', borderRadius: 7,
                    background: activeCategory === item ? 'rgba(217, 93, 57, 0.08)' : 'transparent',
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
