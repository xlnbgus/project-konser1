import React from 'react'
import raisaImg    from '../assets/artists/raisa.jpg'
import unguImg     from '../assets/artists/ungu.jpg'
import westlifeImg from '../assets/artists/westlife.jpg'
import noahImg     from '../assets/artists/noah.jpg'
import dewa19Img   from '../assets/artists/dewa19.jpg'
import isyanaImg   from '../assets/artists/isyana.jpg'

const artists = [
  { id:1, name:'Raisa',    genre:'Pop · Soul',     date:'12 Des 2026', img: raisaImg,    fans:'2.1M' },
  { id:2, name:'UNGU',     genre:'Pop Rock',       date:'30 Okt 2026', img: unguImg,     fans:'3.5M' },
  { id:3, name:'Westlife', genre:'Pop Arena',      date:'15 Sep 2026', img: westlifeImg, fans:'5.2M' },
  { id:4, name:'Noah',     genre:'Alternative',   date:'10 Nov 2026', img: noahImg,     fans:'4.1M' },
  { id:5, name:'Dewa 19',  genre:'Rock Legenda',  date:'22 Des 2026', img: dewa19Img,   fans:'3.8M' },
  { id:6, name:'Isyana',   genre:'Pop · Opera',   date:'05 Okt 2026', img: isyanaImg,   fans:'1.7M' },
]

export default function FeaturedArtists() {
  return (
    <section id="artis-favorit" className="reveal-section" style={{ padding: '90px 0', background: '#FFFFFF', position: 'relative' }}>
      <div id="artists" style={{ position: 'absolute', top: -70 }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: 48 }}>
          <p className="label-eyebrow" style={{ marginBottom: 10 }}>Lineup Musisi</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 className="section-title">Artis &amp; Band Favorit</h2>
            <p style={{ color: '#4B5563', fontSize: '0.88rem', maxWidth: 320, lineHeight: 1.6 }}>
              Temukan konser artis idola kamu sebelum kehabisan tiket
            </p>
          </div>
        </div>

        {/* Grid — 3 col desktop, 2 col tablet, 1 col mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 16,
        }}>
          {artists.map((a, idx) => (
            <ArtistCard key={a.id} artist={a} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArtistCard({ artist: a, idx }) {
  const [hovered, setHovered] = React.useState(false)
  const staggerDelay = (idx % 6) * 90 // 80ms-100ms interval (0ms, 90ms, 180ms, 270ms, 360ms, 450ms)

  return (
    <div
      className="reveal-scale"
      style={{
        borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
        border: hovered ? '1px solid #0066CC' : '1px solid #E5E7EB',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 10px 20px -3px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        transitionDelay: `${staggerDelay}ms`,
        background: '#FFFFFF',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: '#F4F5F7' }}>
        <img
          src={a.img}
          alt={a.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 16px', background: '#FFFFFF' }}>
        <p style={{ color: '#111827', fontWeight: 700, fontSize: '0.95rem', marginBottom: 3, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}>
          {a.name}
        </p>
        <p style={{ color: '#4B5563', fontSize: '0.78rem', marginBottom: 10 }}>
          {a.genre}
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 6,
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
        }}>
          <svg width="11" height="11" fill="none" stroke="#0066CC" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span style={{ color: '#0066CC', fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{a.date}</span>
        </div>
      </div>
    </div>
  )
}
