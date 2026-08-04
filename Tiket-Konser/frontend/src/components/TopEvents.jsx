import { useEffect, useState } from 'react'
import Modal from './Modal'
import { checkoutApi } from '../api'

const categories = ['Semua', 'Konser', 'Festival', 'Stand Up', 'Sports', 'Theater']

const buildEventImage = (title, startColor, endColor, emoji) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="800" height="480" rx="32" fill="url(#g)" />
      <circle cx="660" cy="140" r="140" fill="rgba(255,255,255,0.16)" />
      <circle cx="180" cy="370" r="180" fill="rgba(255,255,255,0.10)" />
      <rect x="72" y="76" width="320" height="120" rx="24" fill="rgba(255,255,255,0.18)" />
      <text x="92" y="132" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#fff">${title}</text>
      <text x="92" y="182" font-family="Arial, sans-serif" font-size="24" font-weight="500" fill="rgba(255,255,255,0.8)">Live Experience</text>
      <rect x="70" y="242" width="220" height="124" rx="24" fill="rgba(0,0,0,0.22)" />
      <text x="108" y="312" font-family="Arial, sans-serif" font-size="88" fill="#fff">${emoji}</text>
      <text x="70" y="410" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#fff">KonserKu</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const events = [
  { id:1, image:buildEventImage('UNGU Final Chapter', '#3b0764', '#5b21b6', '🎤'), placeholder:'linear-gradient(135deg,#3b0764,#5b21b6)', title:'UNGU – Waktu yang Dinanti Final Chapter',       cat:'Konser',  date:'30 Okt 2026',     price:'Rp550.000',   org:'TipTip',            status:'available', hot:true, cover:'🎤' },
  { id:2, image:buildEventImage('SNOOPY RUN 2026', '#7c2d12', '#c2410c', '🏃'), placeholder:'linear-gradient(135deg,#7c2d12,#c2410c)', title:'SNOOPY RUN 2026',                                cat:'Sports',  date:'06 Sep 2026',     price:'Rp499.000',   org:'Provaliant Sports', status:'available', hot:false, cover:'🏃' },
  { id:3, image:buildEventImage('Beyond Eyes Surabaya', '#0c4a6e', '#0369a1', '🎸'), placeholder:'linear-gradient(135deg,#0c4a6e,#0369a1)', title:'Beyond Eyes 15th Anniversary – Surabaya',       cat:'Konser',  date:'28 Agt 2026',     price:'Rp900.000',   org:'Maryhouse Media',   status:'available', hot:true, cover:'🎸' },
  { id:4, image:buildEventImage('Beyond Eyes Jakarta', '#831843', '#be185d', '🌟'), placeholder:'linear-gradient(135deg,#831843,#be185d)', title:'Beyond Eyes 1st Tour – Jakarta 2026',           cat:'Konser',  date:'30 Agt 2026',     price:'Rp1.700.000', org:'Maryhouse Media',   status:'available', hot:true, cover:'🌟' },
  { id:5, image:buildEventImage('LaLaLa Festival', '#064e3b', '#059669', '🎪'), placeholder:'linear-gradient(135deg,#064e3b,#059669)', title:'LaLaLa Festival 2026',                          cat:'Festival',date:'22–23 Agt 2026',  price:'Rp800.000',   org:'The Group',         status:'available', hot:false, cover:'🎪' },
  { id:6, image:buildEventImage('Twilite Orchestra', '#18181b', '#3f3f46', '🎼'), placeholder:'linear-gradient(135deg,#18181b,#3f3f46)', title:'Twilite Orchestra 35th Anniversary Concert',    cat:'Theater', date:'06 Sep 2026',     price:'Rp500.000',   org:'TWILITE ORCHESTRA', status:'soldout',   hot:false, cover:'🎼' },
  { id:7, image:buildEventImage('Raisa Live Concert', '#4c1d95', '#7c3aed', '🎶'), placeholder:'linear-gradient(135deg,#4c1d95,#7c3aed)', title:'Raisa Live in Concert 2026',                   cat:'Konser',  date:'12 Des 2026',     price:'Rp650.000',   org:'Raisa Production',  status:'available', hot:true, cover:'🎶' },
  { id:8, image:buildEventImage('Synchronize Festival', '#78350f', '#d97706', '🎆'), placeholder:'linear-gradient(135deg,#78350f,#d97706)', title:'Synchronize Festival 2026',                    cat:'Festival',date:'3–5 Okt 2026',    price:'Rp600.000',   org:'Demajors',          status:'available', hot:false, cover:'🎆' },
]

function OrgAvatar({ name }) {
  const initials = name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
  const palette  = ['#7c3aed','#0891b2','#0f766e','#b45309','#be123c','#1d4ed8']
  const color    = palette[name.charCodeAt(0) % palette.length]
  return (
    <div style={{
      width:28, height:28, borderRadius:8, flexShrink:0,
      background:color, display:'flex', alignItems:'center',
      justifyContent:'center', fontSize:'0.6rem', fontWeight:800, color:'#fff',
    }}>
      {initials}
    </div>
  )
}

function EventCard({ ev, onBuy }) {
  return (
    <div
      style={{
        background:'#13131f',
        borderRadius:16,
        overflow:'hidden',
        cursor:'pointer',
        border:'1px solid rgba(255,255,255,0.07)',
        transition:'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform    = 'translateY(-6px)'
        e.currentTarget.style.boxShadow    = '0 20px 40px rgba(124,58,237,0.25)'
        e.currentTarget.style.borderColor  = 'rgba(124,58,237,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform    = 'translateY(0)'
        e.currentTarget.style.boxShadow    = 'none'
        e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.07)'
      }}
    >
      {/* ── Foto / Placeholder ── */}
      <div style={{
        position:'relative',
        width:'100%',
        paddingTop:'60%',      /* rasio ~5:3, lebih lega dari 16:9 */
        background: ev.placeholder,
        overflow:'hidden',
      }}>
        {ev.image && (
          <img
            src={ev.image}
            alt={ev.title}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
          />
        )}

        {/* overlay gradien bawah supaya badge terbaca */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
        }} />

        {/* placeholder icon saat belum ada foto */}
        {!ev.image && (
          <div style={{
            position:'absolute', inset:0,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', gap:10, opacity:0.95,
            padding:'24px',
          }}>
            <div style={{ fontSize:'3rem', filter:'drop-shadow(0 8px 20px rgba(0,0,0,0.25))' }}>{ev.cover}</div>
            <div style={{ textAlign:'center', color:'#fff', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>
              {ev.cat} Showcase
            </div>
          </div>
        )}

        {/* Hot badge — kanan atas */}
        {ev.hot && (
          <div style={{
            position:'absolute', top:12, right:12,
            padding:'4px 10px', borderRadius:8,
            background:'rgba(239,68,68,0.88)',
            color:'#fff', fontSize:'0.65rem', fontWeight:700,
            backdropFilter:'blur(4px)',
          }}>
            🔥 Hot
          </div>
        )}

        {/* Status badge — kiri bawah */}
        <div style={{
          position:'absolute', bottom:12, left:12,
          padding:'5px 11px', borderRadius:8,
          background: ev.status === 'soldout'
            ? 'rgba(39,39,42,0.88)'
            : 'rgba(22,163,74,0.88)',
          color: ev.status === 'soldout' ? '#a1a1aa' : '#fff',
          fontSize:'0.65rem', fontWeight:700,
          backdropFilter:'blur(4px)',
          border: ev.status === 'soldout'
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(255,255,255,0.15)',
        }}>
          {ev.status === 'soldout' ? 'Tiket Habis' : 'Tiket Tersedia'}
        </div>
      </div>

      {/* ── Info ── */}
      <div style={{ padding:'16px 16px 18px' }}>

        {/* Judul */}
        <h3 style={{
          fontSize:'0.9rem', fontWeight:700, color:'#f9fafb',
          lineHeight:1.4, marginBottom:9,
          display:'-webkit-box', WebkitLineClamp:2,
          WebkitBoxOrient:'vertical', overflow:'hidden',
          minHeight:'2.52em',
        }}>
          {ev.title}
        </h3>

        {/* Tanggal */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
          <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span style={{ fontSize:'0.78rem', color:'#6b7280' }}>{ev.date}</span>
        </div>

        {/* Harga */}
        <p style={{ fontSize:'1.05rem', fontWeight:800, marginBottom:14 }}>
          {ev.status === 'soldout'
            ? <span style={{ color:'#52525b', fontWeight:600, fontSize:'0.85rem' }}>Habis Terjual</span>
            : <span style={{
                background:'linear-gradient(135deg,#a78bfa,#ec4899)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text',
              }}>{ev.price}</span>
          }
        </p>

        {/* Divider */}
        <div style={{ height:1, background:'rgba(255,255,255,0.06)', marginBottom:12 }} />

        {/* Organizer + tombol beli */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
            <OrgAvatar name={ev.org} />
            <span style={{
              fontSize:'0.75rem', color:'#6b7280', fontWeight:500,
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            }}>
              {ev.org}
            </span>
          </div>

          {ev.status !== 'soldout' && (
            <button
              onClick={() => onBuy(ev)}
              style={{
                flexShrink:0, padding:'7px 16px', borderRadius:9,
                background:'linear-gradient(135deg,#7c3aed,#ec4899)',
                color:'#fff', fontSize:'0.73rem', fontWeight:700,
                border:'none', cursor:'pointer',
                boxShadow:'0 4px 12px rgba(124,58,237,0.35)',
                transition:'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow='0 6px 18px rgba(124,58,237,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)';    e.currentTarget.style.boxShadow='0 4px 12px rgba(124,58,237,0.35)' }}
            >
              Beli →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TopEvents() {
  const [active, setActive] = useState('Semua')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState('debit')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const filtered = active === 'Semua' ? events : events.filter(e => e.cat === active)

  useEffect(() => {
    checkoutApi.paymentMethods()
      .then((data) => {
        setPaymentMethods(data.paymentMethods || [])
        if (data.paymentMethods?.length) {
          setSelectedMethod(data.paymentMethods[0].value)
        }
      })
      .catch(() => setPaymentMethods([]))
  }, [])

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Silakan masuk dulu sebelum lanjut checkout.')
      return
    }

    if (!selectedEvent) return

    setLoading(true)
    setMessage('')

    try {
      const data = await checkoutApi.checkout(token, {
        eventId: selectedEvent.id,
        quantity: 1,
        paymentMethod: selectedMethod,
      })

      if (data?.order) {
        window.location.href = '/payment-success'
        return
      }

      setMessage(`Checkout berhasil! Metode pembayaran: ${data.order.paymentLabel}. Total: Rp${data.order.total.toLocaleString('id-ID')}`)
    } catch (error) {
      setMessage(error.message || 'Checkout gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="top-events" style={{ padding:'80px 0', background:'#0a0a0f' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>

        {/* ── Header ── */}
        <div style={{
          display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          marginBottom:24, flexWrap:'wrap', gap:12,
        }}>
          <div>
            <p style={{
              fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.18em',
              textTransform:'uppercase', color:'#a78bfa', marginBottom:8,
            }}>
              🎵 Pilihan Terbaik
            </p>
            <h2 style={{
              fontFamily:'Poppins,sans-serif',
              fontSize:'clamp(1.6rem,3.5vw,2.2rem)',
              fontWeight:900, color:'#fff', lineHeight:1.1,
            }}>
              Top{' '}
              <span style={{
                background:'linear-gradient(135deg,#a78bfa,#ec4899,#f59e0b)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text',
              }}>
                Events
              </span>
            </h2>
          </div>
          <a href="#" style={{
            display:'flex', alignItems:'center', gap:5,
            color:'#a78bfa', fontWeight:600, fontSize:'0.85rem', textDecoration:'none',
          }}>
            Lihat Semua
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* ── Category chips ── */}
        <div
          className="no-scrollbar"
          style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:28 }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                flexShrink:0, padding:'8px 18px', borderRadius:99,
                fontSize:'0.82rem', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap',
                border: active === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                background: active === cat
                  ? 'linear-gradient(135deg,#7c3aed,#ec4899)'
                  : 'rgba(255,255,255,0.05)',
                color: active === cat ? '#fff' : '#9ca3af',
                boxShadow: active === cat ? '0 4px 14px rgba(124,58,237,0.35)' : 'none',
                transition:'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
          gap:24,
        }}>
          {filtered.map(ev => <EventCard key={ev.id} ev={ev} onBuy={setSelectedEvent} />)}
        </div>

        {/* ── Load more ── */}
        <div style={{ textAlign:'center', marginTop:40 }}>
          <button style={{
            padding:'12px 36px', borderRadius:99,
            border:'1px solid rgba(255,255,255,0.12)',
            background:'rgba(255,255,255,0.04)',
            color:'#9ca3af', fontWeight:600, fontSize:'0.875rem',
            cursor:'pointer', transition:'all 0.2s',
            backdropFilter:'blur(8px)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(124,58,237,0.15)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(124,58,237,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#9ca3af'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)' }}
          >
            Lihat Lainnya
          </button>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={`Beli tiket ${selectedEvent?.title || ''}`}
        description="Pilih metode pembayaran dan lanjutkan checkout dengan sekali klik."
        ctaLabel={loading ? 'Memproses...' : 'Bayar Sekarang'}
        onCta={handleCheckout}
        secondaryLabel="Batal"
        closeOnCta={false}
      >
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ padding:'12px 14px', borderRadius:12, background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.25)', color:'#ddd6fe' }}>
            <strong style={{ display:'block', marginBottom:4 }}>Event</strong>
            <span>{selectedEvent?.title}</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <label style={{ color:'#cbd5e1', fontSize:'0.86rem', fontWeight:700 }}>Metode Pembayaran</label>
            <div style={{ display:'grid', gap:8 }}>
              {paymentMethods.map((method) => (
                <label key={method.value} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:selectedMethod === method.value ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.08)', cursor:'pointer' }}>
                  <input type="radio" name="payment-method" value={method.value} checked={selectedMethod === method.value} onChange={() => setSelectedMethod(method.value)} />
                  <span style={{ color:'#f8fafc', fontWeight:700 }}>{method.label}</span>
                  <span style={{ color:'#94a3b8', fontSize:'0.8rem', marginLeft:'auto' }}>{method.description}</span>
                </label>
              ))}
            </div>
          </div>

          {message && (
            <div style={{ padding:'10px 12px', borderRadius:10, background: message.includes('berhasil') ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', border: message.includes('berhasil') ? '1px solid rgba(34,197,94,0.22)' : '1px solid rgba(239,68,68,0.22)', color: message.includes('berhasil') ? '#bbf7d0' : '#fecaca', fontSize:'0.85rem' }}>
              {message}
            </div>
          )}
        </div>
      </Modal>
    </section>
  )
}
