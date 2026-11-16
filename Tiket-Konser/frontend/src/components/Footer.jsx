export default function Footer() {
  return (
    <footer style={{ background: '#0D0F14', borderTop: '1px solid rgba(245,243,238,0.07)' }}>

      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(245,243,238,0.07)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
          <div className="newsletter-row reveal">
            <div>
              <h3 style={{
                color: '#F5F3EE',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '1.2rem', marginBottom: 6, letterSpacing: '-0.02em',
              }}>
                Info Event & Festival Terkini
              </h3>
              <p style={{ color: '#6B6E7A', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Jadwal konser terbaru, presale festival, dan voucher diskon langsung ke emailmu
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flex: '1 1 auto', maxWidth: 400 }}>
              <input
                type="email"
                placeholder="alamat@email.com"
                style={{
                  flex: 1, padding: '11px 16px', borderRadius: 7,
                  background: 'rgba(245,243,238,0.05)',
                  border: '1px solid rgba(245,243,238,0.1)',
                  color: '#F5F3EE', fontSize: '0.875rem', outline: 'none',
                  fontFamily: "'Manrope', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(217,93,57,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,243,238,0.1)'}
              />
              <button className="btn-primary" style={{ flexShrink: 0, padding: '11px 22px' }}>Langganan</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main links */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '52px 24px' }}>
        <div className="footer-grid reveal delay-100">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 7,
                background: '#D95D39',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19V6l12-3v13"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#F5F3EE' }}>
                Konser<span style={{ color: '#D95D39' }}>Ku</span>
              </span>
            </div>
            <p style={{ color: '#6B6E7A', fontSize: '0.84rem', lineHeight: 1.65, marginBottom: 20, maxWidth: 240 }}>
              Platform resmi pemesanan tiket festival musik dan konser paling lengkap, aman, dan terpercaya di Indonesia.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: 'ig', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { icon: 'tw', path: 'M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.944 13.944 0 011.64 3.161a4.916 4.916 0 001.523 6.573 4.903 4.903 0 01-2.229-.616v.061a4.916 4.916 0 003.946 4.827 4.937 4.937 0 01-2.224.085 4.919 4.919 0 004.6 3.419 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.945 13.945 0 007.548 2.212c9.057 0 14.01-7.503 14.01-14.01 0-.213-.005-.425-.014-.636A9.936 9.936 0 0024 4.557z' },
                { icon: 'yt', path: 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
              ].map(s => (
                <a key={s.icon} href="#" style={{
                  width: 32, height: 32, borderRadius: 7,
                  background: 'rgba(245,243,238,0.05)',
                  border: '1px solid rgba(245,243,238,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(217,93,57,0.3)'; e.currentTarget.style.background = 'rgba(217,93,57,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,243,238,0.08)'; e.currentTarget.style.background = 'rgba(245,243,238,0.05)' }}
                >
                  <svg width="13" height="13" fill="#6B6E7A" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title:'Kategori Event', links:['Synchronize Festival','We The Fest','Pestapora','DWP Festival','Konser Musik','Stand Up Comedy'] },
            { title:'Bantuan & Layanan', links:['FAQ & Bantuan','Cara Pembelian','Kebijakan E-Tiket','Hubungi Support','Status Pemesanan'] },
            { title:'Tentang KonserKu', links:['Tentang Kami','Mitra Promotor','Karir','Blog Musik','Syarat & Ketentuan'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color: '#F5F3EE', fontWeight: 700, fontSize: '0.86rem', marginBottom: 18, letterSpacing: '-0.01em', fontFamily: "'Space Grotesk', sans-serif" }}>{col.title}</h4>
              {col.links.map(link => (
                <a key={link} href="#" className="footer-link">{link}</a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(245,243,238,0.06)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <p style={{ color: '#3A3D47', fontSize: '0.76rem' }}>© 2026 KonserKu Indonesia. Hak cipta dilindungi undang-undang.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Syarat & Ketentuan','Kebijakan Privasi','Keamanan Pembayaran'].map(l => (
              <a key={l} href="#" style={{ color: '#3A3D47', fontSize: '0.76rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#6B6E7A'}
                onMouseLeave={e => e.currentTarget.style.color = '#3A3D47'}
              >{l}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#3A3D47', fontSize: '0.73rem' }}>Pembayaran:</span>
            {['QRIS','BCA','Mandiri','GoPay','Visa'].map((p, i) => (
              <span key={i} style={{
                padding: '3px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600,
                background: 'rgba(245,243,238,0.04)', border: '1px solid rgba(245,243,238,0.07)',
                color: '#6B6E7A', fontFamily: "'Space Grotesk', sans-serif",
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .newsletter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1fr;
          gap: 48px;
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  )
}
