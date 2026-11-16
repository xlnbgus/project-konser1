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
    <section style={{ padding: '100px 0', background: '#0D0F14' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: 56 }}>
          <p className="label-eyebrow" style={{ marginBottom: 10 }}>Lineup Musisi</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 className="section-title">Artis &amp; Band Favorit</h2>
            <p style={{ color: '#6B6E7A', fontSize: '0.88rem', maxWidth: 320, lineHeight: 1.6 }}>
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

  return (
    <div
      className={`reveal-scale delay-${((idx % 6) + 1) * 100}`}
      style={{
        borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
        border: hovered ? '1px solid rgba(217,93,57,0.3)' : '1px solid rgba(245,243,238,0.07)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.35)' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s',
        background: '#161920',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: '#0D0F14' }}>
        <img
          src={a.img}
          alt={a.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,25,32,1) 0%, rgba(22,25,32,0.1) 55%, transparent 100%)' }} />
      </div>

      {/* Info */}
      <div style={{ padding: '14px 14px 16px' }}>
        <p style={{ color: '#F5F3EE', fontWeight: 700, fontSize: '0.95rem', marginBottom: 3, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}>
          {a.name}
        </p>
        <p style={{ color: '#6B6E7A', fontSize: '0.76rem', marginBottom: 10 }}>
          {a.genre}
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 5,
          background: 'rgba(217,93,57,0.1)',
          border: '1px solid rgba(217,93,57,0.2)',
        }}>
          <svg width="10" height="10" fill="none" stroke="#D95D39" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span style={{ color: '#D95D39', fontSize: '0.72rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{a.date}</span>
        </div>
      </div>
    </div>
  )
}
