import { useEffect, useState } from 'react'
import Modal from './Modal'

import syncFestImg from '../assets/events/synchronize-fest.jpg'
import wtfImg from '../assets/events/wethefest.jpg'
import pestaporaImg from '../assets/events/pestapora.jpg'
import dwpImg from '../assets/events/dwp-fest.jpg'
import snoopyRunImg from '../assets/events/snoopy-run.jpg'
import standupImg from '../assets/events/standup-comedy.jpg'
import unguImg from '../assets/artists/ungu.jpg'
import westlifeImg from '../assets/artists/westlife.jpg'

const DEMO_EVENTS = [
  { id: 101, title: 'Synchronize Festival 2026', location: 'Gambir Expo Kemayoran, Jakarta', date: '2026-10-03', price: 450000, category: 'Festival', organizer: 'Demajors x Dyandra', status: 'available', image: syncFestImg },
  { id: 102, title: 'We The Fest (WTF) 2026', location: 'GBK Sports Complex, Jakarta', date: '2026-08-21', price: 750000, category: 'Festival', organizer: 'Ismaya Live', status: 'available', image: wtfImg },
  { id: 103, title: 'Pestapora 2026', location: 'JIExpo Kemayoran, Jakarta', date: '2026-09-18', price: 550000, category: 'Festival', organizer: 'Boss Creator', status: 'available', image: pestaporaImg },
  { id: 104, title: 'Djakarta Warehouse Project (DWP) 2026', location: 'JIExpo Kemayoran, Jakarta', date: '2026-12-11', price: 950000, category: 'Festival', organizer: 'Ismaya Live', status: 'available', image: dwpImg },
  { id: 1, title: 'UNGU – Waktu yang Dinanti Final Chapter', location: 'ICE BSD, Tangerang', date: '2026-10-30', price: 550000, category: 'Konser', organizer: 'TipTip', status: 'available', image: unguImg },
  { id: 2, title: 'Westlife World Tour 2026', location: 'GBK Stadium, Jakarta', date: '2026-09-15', price: 750000, category: 'Konser', organizer: 'PK Entertainment', status: 'available', image: westlifeImg },
  { id: 3, title: 'SNOOPY RUN 2026', location: 'Tangerang Selatan', date: '2026-09-06', price: 499000, category: 'Sports', organizer: 'Provaliant Sports', status: 'available', image: snoopyRunImg },
  { id: 4, title: 'Stand Up Comedy Special: Cerita Rasa', location: 'Teater Jakarta, TIM', date: '2026-11-08', price: 250000, category: 'Stand Up', organizer: 'Majelis Lucu Indonesia', status: 'available', image: standupImg },
]

function resolveImage(ev) {
  if (ev.image && typeof ev.image !== 'string') return ev.image
  if (ev.image && typeof ev.image === 'string' && (ev.image.startsWith('/') || ev.image.startsWith('http'))) return ev.image
  const t = (ev.title || '').toLowerCase()
  if (t.includes('synchronize')) return syncFestImg
  if (t.includes('we the fest') || t.includes('wtf')) return wtfImg
  if (t.includes('pestapora')) return pestaporaImg
  if (t.includes('dwp') || t.includes('djakarta')) return dwpImg
  if (t.includes('snoopy') || t.includes('run')) return snoopyRunImg
  if (t.includes('stand up') || t.includes('comedy')) return standupImg
  if (t.includes('ungu')) return unguImg
  if (t.includes('westlife')) return westlifeImg
  if (ev.category === 'Festival') return syncFestImg
  return unguImg
}

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const parseDateParts = (dateStr) => {
  if (!dateStr) return { mon: '???', day: '??' }
  try {
    const d = new Date(dateStr)
    const mon = d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase().replace('.', '')
    const day = String(d.getDate()).padStart(2, '0')
    return { mon, day }
  } catch { return { mon: '???', day: '??' } }
}

const getMapsUrl = (venue) => {
  const q = encodeURIComponent(`${venue || ''}, Indonesia`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

const getMapsEmbedUrl = (venue) => {
  const q = encodeURIComponent(`${venue || ''}, Indonesia`)
  return `https://www.google.com/maps?q=${q}&output=embed`
}

export default function UpcomingEvents({ searchQuery = '', onSelectEvent }) {
  const [events, setEvents] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
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
    <section id="jadwal-agenda" className="reveal-section" style={{ padding: '100px 0', background: '#F4F5F7', position: 'relative' }}>
      <div id="upcoming" style={{ position: 'absolute', top: -70 }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div className="reveal" style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 44, flexWrap: 'wrap', gap: 14,
        }}>
          <div>
            <p className="label-eyebrow" style={{ marginBottom: 10 }}>Jadwal Agenda</p>
            <h2 className="section-title">Event &amp; Festival Mendatang</h2>
            <p style={{ color: '#4B5563', fontSize: '0.9rem', marginTop: 10 }}>
              Pastikan tanggalnya tidak terlewat dan pesan tiketmu sekarang
            </p>
          </div>
          <a href="#top-events" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#0066CC', fontWeight: 600, fontSize: '0.86rem',
            textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Pesan Tiket
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* Empty search state */}
        {normalizedQuery && filteredList.length === 0 && !fetchLoading && (
          <div style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 9, background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#4B5563' }}>
            Tidak ada event untuk pencarian "{searchQuery}".
          </div>
        )}

        {/* List */}
        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#4B5563', fontSize: '0.9rem' }}>
            Memuat jadwal event…
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredList.map((ev, idx) => {
              const { mon, day } = parseDateParts(ev.date)
              const img = resolveImage(ev)
              const staggerDelay = (idx % 6) * 90 // 80ms-100ms interval

              return (
                <div
                  key={ev.id}
                  className="reveal-left"
                  onClick={() => {
                    if (onSelectEvent) onSelectEvent(ev)
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 20,
                    padding: '16px 20px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 10,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${staggerDelay}ms`,
                    cursor: onSelectEvent ? 'pointer' : 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#FAFAFA'
                    e.currentTarget.style.borderColor = '#0066CC'
                    e.currentTarget.style.transform = 'translateX(6px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#FFFFFF'
                    e.currentTarget.style.borderColor = '#E5E7EB'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  {/* Date block */}
                  <div style={{
                    flexShrink: 0, width: 56, textAlign: 'center',
                    borderRight: '1px solid #E5E7EB',
                    paddingRight: 18, marginRight: 4,
                  }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#0066CC', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {mon}
                    </span>
                    <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {day}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div style={{
                    flexShrink: 0, width: 56, height: 56, borderRadius: 8,
                    overflow: 'hidden', background: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                  }}>
                    <img
                      src={img}
                      alt={ev.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: '#111827', fontWeight: 700, fontSize: '0.95rem',
                      marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif",
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em',
                    }}>
                      {ev.title}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <svg width="11" height="11" fill="none" stroke="#6B7280" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span style={{ fontSize: '0.78rem', color: '#6B7280', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ev.location}
                        </span>
                      </div>
                      <span style={{
                        padding: '3px 8px', borderRadius: 4,
                        background: '#F3F4F6', border: '1px solid #E5E7EB',
                        color: '#4B5563', fontSize: '0.68rem', fontWeight: 600,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}>
                        {ev.category}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedLocation(ev) }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 10px', borderRadius: 5,
                          border: '1px solid #BFDBFE',
                          background: '#EFF6FF', color: '#0066CC',
                          cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
                          transition: 'background 0.2s, border-color 0.2s',
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#DBEAFE' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#EFF6FF' }}
                      >
                        Lokasi
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 100 }}>
                    <p style={{ fontSize: '0.68rem', color: '#6B7280', marginBottom: 2, fontFamily: "'Space Grotesk', sans-serif" }}>Mulai dari</p>
                    {ev.status === 'soldout'
                      ? <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.84rem' }}>Habis</span>
                      : <span style={{ color: '#0066CC', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Space Grotesk', sans-serif" }}>{formatPrice(ev.price)}</span>
                    }
                  </div>
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
          <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827' }}>
            <strong style={{ display: 'block', marginBottom: 4, fontSize: '0.86rem', color: '#4B5563', fontWeight: 600 }}>Alamat</strong>
            <span style={{ fontSize: '0.9rem' }}>{selectedLocation?.location}</span>
          </div>
          <div style={{ width: '100%', height: 0, paddingBottom: '56.25%', position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
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
