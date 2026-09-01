import { useEffect, useState } from 'react'
import Modal from './Modal'

const DEMO_EVENTS = [
  { id: 1, title: 'Beyond Eyes 15th Anniversary – Surabaya', location: 'Surabaya Convention Center', date: '2026-08-28', price: 900000, category: 'Konser',  organizer: 'Maryhouse Media',   status: 'available' },
  { id: 2, title: 'SNOOPY RUN 2026',                         location: 'Tangerang Selatan',          date: '2026-09-06', price: 499000, category: 'Sports',  organizer: 'Provaliant Sports', status: 'available' },
  { id: 3, title: 'UNGU – Waktu yang Dinanti Final Chapter', location: 'ICE BSD, Tangerang',         date: '2026-10-30', price: 550000, category: 'Konser',  organizer: 'TipTip',            status: 'available' },
]

const CAT_DOT = {
  Konser:    '#3b82f6',
  Festival:  '#f97316',
  'Stand Up':'#facc15',
  Sports:    '#eab308',
  Theater:   '#a855f7',
}

const CAT_EMOJI = { Konser: '🎤', Festival: '🎪', 'Stand Up': '😂', Sports: '🏃', Theater: '🎭' }

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const parseDateParts = (dateStr) => {
  if (!dateStr) return { mon: '???', day: '??' }
  try {
    const d   = new Date(dateStr)
    const mon = d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase().replace('.', '')
    const day = String(d.getDate()).padStart(2, '0')
    return { mon, day }
  } catch {
    return { mon: '???', day: '??' }
  }
}

const formatTime = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
  } catch {
    return '19:00 WIB'
  }
}

const getMapsUrl = (venue) => {
  const q = encodeURIComponent(`${venue || ''}, Indonesia`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

const getMapsEmbedUrl = (venue) => {
  const q = encodeURIComponent(`${venue || ''}, Indonesia`)
  return `https://www.google.com/maps?q=${q}&output=embed`
}

export default function UpcomingEvents({ searchQuery = '' }) {
  const [events, setEvents]                     = useState([])
  const [fetchLoading, setFetchLoading]         = useState(true)
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    setFetchLoading(true)
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data.events) ? data.events : []
        setEvents(list.length > 0 ? list : DEMO_EVENTS)
      })
      .catch(() => setEvents(DEMO_EVENTS))
      .finally(() => setFetchLoading(false))
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredList = events.filter(ev => {
    if (!normalizedQuery) return true
    const hay = [ev.title, ev.location, ev.category, ev.date, ev.organizer].join(' ').toLowerCase()
    return hay.includes(normalizedQuery)
  })

  return (
    <section style={{ padding: '96px 0', background: '#0a0a0f' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 36, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <p style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#fbbf24', marginBottom: 10,
            }}>
              📅 Jadwal
            </p>
            <h2 style={{
              fontFamily: 'Poppins,sans-serif',
              fontSize: 'clamp(1.6rem,3.5vw,2.2rem)',
              fontWeight: 900, color: '#fff',
            }}>
              Event{' '}
              <span style={{
                background: 'linear-gradient(135deg,#a78bfa,#ec4899,#f59e0b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Mendatang</span>
            </h2>
          </div>
          <a href="#" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: '#a78bfa', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
          }}>
            Lihat Semua
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {normalizedQuery && filteredList.length === 0 && !fetchLoading && (
          <div style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1' }}>
            Tidak ada event yang cocok dengan pencarian &quot;{searchQuery}&quot;.
          </div>
        )}

        {/* List */}
        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280', fontSize: '0.95rem' }}>
            Memuat jadwal event…
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredList.map(ev => {
              const { mon, day } = parseDateParts(ev.date)
              const emoji        = CAT_EMOJI[ev.category] || '🎵'
              const dotColor     = CAT_DOT[ev.category]   || '#6b7280'
              const timeStr      = formatTime(ev.date)

              return (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 20,
                    padding: '22px 28px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background  = 'rgba(124,58,237,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'
                    e.currentTarget.style.transform   = 'translateX(6px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background  = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.transform   = 'translateX(0)'
                  }}
                >
                  {/* Date box */}
                  <div style={{
                    flexShrink: 0, width: 64, height: 64, borderRadius: 16,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {mon}
                    </span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
                      {day}
                    </span>
                  </div>

                  {/* Emoji box */}
                  <div style={{
                    flexShrink: 0, width: 52, height: 52, borderRadius: 14,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24,
                  }}>
                    {emoji}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: '#f3f4f6', fontWeight: 700, fontSize: '1rem',
                      marginBottom: 8,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {ev.title}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                      {/* Lokasi */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                          {ev.location}
                        </span>
                      </div>
                      {/* Jam */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <svg width="13" height="13" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                          {timeStr}
                        </span>
                      </div>
                      {/* Tombol Lihat Lokasi */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedLocation(ev) }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', borderRadius: 999,
                          border: '1px solid rgba(124,58,237,0.4)',
                          background: 'rgba(124,58,237,0.1)', color: '#c4b5fd',
                          cursor: 'pointer', fontSize: '0.73rem', fontWeight: 600,
                          transition: 'all 0.2s', whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.22)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.7)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)';  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)' }}
                      >
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        Lihat Lokasi
                      </button>
                    </div>
                  </div>

                  {/* Category dot */}
                  <div style={{
                    flexShrink: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: dotColor, display: 'block',
                      boxShadow: `0 0 8px ${dotColor}`,
                    }} />
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{ev.category}</span>
                  </div>

                  {/* Price */}
                  <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 100 }}>
                    <p style={{ fontSize: '0.68rem', color: '#4b5563', marginBottom: 3 }}>Mulai dari</p>
                    <p style={{
                      fontWeight: 800, fontSize: '0.95rem',
                      background: 'linear-gradient(135deg,#a78bfa,#ec4899)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {formatPrice(ev.price)}
                    </p>
                  </div>

                  {/* Status badge untuk soldout */}
                  {ev.status === 'soldout' && (
                    <div style={{
                      flexShrink: 0, padding: '8px 14px', borderRadius: 10,
                      background: 'rgba(39,39,42,0.6)', color: '#71717a',
                      fontSize: '0.78rem', fontWeight: 700,
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      Habis
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Location Modal */}
      <Modal
        isOpen={Boolean(selectedLocation)}
        onClose={() => setSelectedLocation(null)}
        title={selectedLocation?.location || 'Lokasi Event'}
        description={`Lihat titik lokasi ${selectedLocation?.title || 'event'} dan arahkan dengan Google Maps.`}
        ctaLabel="Buka di Google Maps"
        onCta={() => window.open(getMapsUrl(selectedLocation?.location), '_blank')}
        secondaryLabel="Tutup"
        closeOnCta={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0' }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>Alamat</strong>
            <span>{selectedLocation?.location}</span>
          </div>
          <div style={{ width: '100%', height: 0, paddingBottom: '56.25%', position: 'relative', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)' }}>
            {selectedLocation && (
              <iframe
                title="Event location map"
                src={getMapsEmbedUrl(selectedLocation.location)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </div>
      </Modal>
    </section>
  )
}
