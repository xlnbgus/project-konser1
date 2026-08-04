export default function Footer() {
  return (
    <footer style={{ background:'#070710', borderTop:'1px solid rgba(255,255,255,0.05)' }}>

      {/* Newsletter */}
      <div style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 24px' }}>
          <div className="newsletter-row">
            <div>
              <h3 style={{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'1.2rem', marginBottom:6 }}>
                Jangan Ketinggalan Event <span className="text-gradient">Seru</span>
              </h3>
              <p style={{ color:'#6b7280', fontSize:'0.85rem' }}>Info event terbaru langsung ke emailmu</p>
            </div>
            <div style={{ display:'flex', gap:8, flex:'1 1 auto', maxWidth:420 }}>
              <input
                type="email"
                placeholder="Masukkan email kamu..."
                style={{
                  flex:1, padding:'11px 16px', borderRadius:12,
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  color:'#fff', fontSize:'0.85rem', outline:'none',
                }}
              />
              <button className="btn-primary" style={{ flexShrink:0, padding:'11px 20px' }}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 24px' }}>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{
                width:34, height:34, borderRadius:10,
                background:'linear-gradient(135deg,#7c3aed,#ec4899)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{ fontSize:16 }}>🎵</span>
              </div>
              <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'1.1rem' }}>
                <span className="text-gradient">Konser</span>
                <span style={{ color:'#fff' }}>Ku</span>
              </span>
            </div>
            <p style={{ color:'#6b7280', fontSize:'0.82rem', lineHeight:1.65, marginBottom:20, maxWidth:240 }}>
              Platform tiket konser terpercaya di Indonesia. Temukan dan pesan tiket favoritmu dengan mudah dan aman.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {['📘','📸','🐦','▶️'].map((icon,i) => (
                <a key={i} href="#" style={{
                  width:34, height:34, borderRadius:10,
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:14, textDecoration:'none', transition:'background 0.2s',
                }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title:'Event', links:['Semua Konser','Festival Musik','Stand Up Comedy','Olahraga','Theater'] },
            { title:'Bantuan', links:['FAQ','Cara Pembelian','Kebijakan Refund','Hubungi Kami','Lapor Masalah'] },
            { title:'Perusahaan', links:['Tentang Kami','Karir','Blog','Mitra Kami','Press Kit'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ color:'#fff', fontWeight:700, fontSize:'0.875rem', marginBottom:16 }}>{col.title}</h4>
              {col.links.map(link => (
                <a key={link} href="#" className="footer-link">{link}</a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'16px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:10 }}>
          <p style={{ color:'#374151', fontSize:'0.75rem' }}>© 2026 KonserKu. All rights reserved.</p>
          <div style={{ display:'flex', gap:16 }}>
            {['Syarat & Ketentuan','Kebijakan Privasi','Cookie'].map(l => (
              <a key={l} href="#" style={{ color:'#374151', fontSize:'0.75rem', textDecoration:'none' }}>{l}</a>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ color:'#374151', fontSize:'0.72rem' }}>Pembayaran:</span>
            {['💳','🏦','📱'].map((p,i) => (
              <span key={i} style={{
                padding:'2px 8px', borderRadius:6, fontSize:'0.72rem',
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
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
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
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
