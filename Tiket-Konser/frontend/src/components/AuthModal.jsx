import { useState } from 'react'
import { showToast } from './Toast'

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      showToast('Mohon isi email dan kata sandi.', 'error')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const user = {
        name: email.split('@')[0].toUpperCase(),
        email,
        phone: '08123456789',
      }
      localStorage.setItem('user_session', JSON.stringify(user))
      showToast(`Selamat datang kembali, ${user.name}!`)
      if (onAuthSuccess) onAuthSuccess(user)
      onClose()
    }, 600)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (!name || !email || !password || !phone) {
      showToast('Mohon lengkapi semua data pendaftaran.', 'error')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const user = { name, email, phone }
      localStorage.setItem('user_session', JSON.stringify(user))
      showToast(`Akun berhasil dibuat! Selamat datang, ${name}.`)
      if (onAuthSuccess) onAuthSuccess(user)
      onClose()
    }, 600)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(17, 24, 39, 0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          width: '100%',
          maxWidth: 440,
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E5E7EB',
            background: '#F9FAFB',
          }}
        >
          <button
            onClick={() => setTab('login')}
            style={{
              flex: 1,
              padding: '16px',
              background: tab === 'login' ? '#FFFFFF' : 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid #0066CC' : '2px solid transparent',
              color: tab === 'login' ? '#111827' : '#6B7280',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            Masuk ke Akun
          </button>
          <button
            onClick={() => setTab('register')}
            style={{
              flex: 1,
              padding: '16px',
              background: tab === 'register' ? '#FFFFFF' : 'transparent',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid #0066CC' : '2px solid transparent',
              color: tab === 'register' ? '#111827' : '#6B7280',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 6, fontWeight: 600 }}>
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    color: '#111827',
                    fontSize: '0.86rem',
                    outline: 'none',
                    fontFamily: "'Manrope', sans-serif",
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0066CC')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.78rem', color: '#4B5563', fontWeight: 600 }}>Kata Sandi</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); showToast('Tautan reset sandi dikirim ke email.') }} style={{ fontSize: '0.74rem', color: '#0066CC', textDecoration: 'none' }}>
                    Lupa sandi?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    color: '#111827',
                    fontSize: '0.86rem',
                    outline: 'none',
                    fontFamily: "'Manrope', sans-serif",
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0066CC')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 8,
                  padding: '12px',
                  borderRadius: 8,
                  background: '#0066CC',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  opacity: loading ? 0.7 : 1,
                  transition: 'background 0.2s',
                }}
              >
                {loading ? 'Memverifikasi...' : 'Masuk ke KonserKu'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <span style={{ fontSize: '0.76rem', color: '#6B6E7A' }}>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    style={{ background: 'none', border: 'none', color: '#0066CC', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Daftar sekarang
                  </button>
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 5, fontWeight: 600 }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    color: '#111827',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0066CC')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 5, fontWeight: 600 }}>
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    color: '#111827',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0066CC')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 5, fontWeight: 600 }}>
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    color: '#111827',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0066CC')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563', marginBottom: 5, fontWeight: 600 }}>
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    color: '#111827',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0066CC')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 6,
                  padding: '12px',
                  borderRadius: 8,
                  background: '#0066CC',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
