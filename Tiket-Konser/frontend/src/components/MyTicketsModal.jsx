import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function MyTicketsModal({ isOpen, onClose }) {
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [qrMap, setQrMap] = useState({})

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = JSON.parse(localStorage.getItem('my_tickets') || '[]')
        setTickets(stored)
        if (stored.length > 0) {
          setSelectedTicket(stored[0])
        }
      } catch {
        setTickets([])
      }
    }
  }, [isOpen])

  // Generate QR codes for tickets
  useEffect(() => {
    tickets.forEach((t) => {
      const code = t.ticketCode || t.id || 'KONSERKU-TICKET'
      if (!qrMap[code]) {
        QRCode.toDataURL(code, {
          width: 240,
          margin: 1,
          color: {
            dark: '#111318',
            light: '#F5F3EE',
          },
        })
          .then((url) => {
            setQrMap((prev) => ({ ...prev, [code]: url }))
          })
          .catch(() => {})
      }
    })
  }, [tickets, qrMap])

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDelete = (ticketId) => {
    const updated = tickets.filter((t) => t.id !== ticketId && t.ticketCode !== ticketId)
    setTickets(updated)
    localStorage.setItem('my_tickets', JSON.stringify(updated))
    if (selectedTicket && (selectedTicket.id === ticketId || selectedTicket.ticketCode === ticketId)) {
      setSelectedTicket(updated.length > 0 ? updated[0] : null)
    }
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
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#161920',
          border: '1px solid rgba(245,243,238,0.12)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 920,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(245,243,238,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(217,93,57,0.15)',
                color: '#D95D39',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
                <path d="M13 5v2m0 4v2m0 4v2" />
              </svg>
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  color: '#F5F3EE',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Tiket Saya ({tickets.length})
              </h2>
              <p style={{ margin: 0, color: '#6B6E7A', fontSize: '0.78rem' }}>
                Daftar E-Tiket resmi dengan QR Code untuk akses gate venue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(245,243,238,0.06)',
              border: '1px solid rgba(245,243,238,0.1)',
              color: '#9095A1',
              borderRadius: 8,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 420 }}>
          {tickets.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: 'rgba(245,243,238,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  color: '#6B6E7A',
                }}
              >
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
                </svg>
              </div>
              <h3
                style={{
                  color: '#F5F3EE',
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  marginBottom: 6,
                }}
              >
                Belum Ada E-Tiket
              </h3>
              <p style={{ color: '#6B6E7A', fontSize: '0.82rem', maxWidth: 300, lineHeight: 1.5, marginBottom: 20 }}>
                Kamu belum memiliki transaksi tiket aktif. Jelajahi konser menarik dan pesan tiket sekarang.
              </p>
              <button
                onClick={onClose}
                style={{
                  background: '#D95D39',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 7,
                  padding: '9px 18px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Jelajahi Konser
              </button>
            </div>
          ) : (
            <>
              {/* Left Column: Ticket List */}
              <div
                style={{
                  width: '42%',
                  borderRight: '1px solid rgba(245,243,238,0.08)',
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {tickets.map((t) => {
                  const isSelected = selectedTicket && (selectedTicket.id === t.id || selectedTicket.ticketCode === t.ticketCode)
                  return (
                    <div
                      key={t.id || t.ticketCode}
                      onClick={() => setSelectedTicket(t)}
                      style={{
                        padding: '14px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(217,93,57,0.1)' : 'rgba(245,243,238,0.03)',
                        border: isSelected ? '1px solid #D95D39' : '1px solid rgba(245,243,238,0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#D95D39',
                            fontFamily: "'Space Grotesk', sans-serif",
                            letterSpacing: '0.05em',
                          }}
                        >
                          {t.tier || 'FESTIVAL'} • {t.quantity || 1} TIKET
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#6B6E7A', fontFamily: 'monospace' }}>
                          #{t.ticketCode || t.id}
                        </span>
                      </div>
                      <h4
                        style={{
                          margin: '0 0 6px',
                          color: '#F5F3EE',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          fontFamily: "'Space Grotesk', sans-serif",
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t.eventTitle || t.title || 'Event Musik'}
                      </h4>
                      <p style={{ margin: 0, color: '#9095A1', fontSize: '0.74rem' }}>
                        📅 {t.eventDate || t.date || '2026'} • 📍 {t.location || 'Jakarta'}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Right Column: Active Ticket Pass + QR Code */}
              <div
                style={{
                  flex: 1,
                  padding: '24px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: '#111318',
                }}
              >
                {selectedTicket && (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 420,
                      background: '#161920',
                      borderRadius: 14,
                      border: '1px solid rgba(245,243,238,0.1)',
                      overflow: 'hidden',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Ticket Header Banner */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #D95D39 0%, #a43818 100%)',
                        padding: '16px 20px',
                        color: '#fff',
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          opacity: 0.9,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        E-TIKET RESMI KONSERKU
                      </span>
                      <h3
                        style={{
                          margin: '6px 0 2px',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {selectedTicket.eventTitle || selectedTicket.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.76rem', opacity: 0.85 }}>
                        {selectedTicket.organizer ? `Promotor: ${selectedTicket.organizer}` : 'Tiket Masuk Resmi'}
                      </p>
                    </div>

                    {/* QR Code Section */}
                    <div
                      style={{
                        padding: '24px 20px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: '1px dashed rgba(245,243,238,0.15)',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          background: '#F5F3EE',
                          padding: 12,
                          borderRadius: 10,
                          display: 'inline-block',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                          marginBottom: 12,
                        }}
                      >
                        {qrMap[selectedTicket.ticketCode || selectedTicket.id] ? (
                          <img
                            src={qrMap[selectedTicket.ticketCode || selectedTicket.id]}
                            alt="QR E-Ticket"
                            style={{ width: 150, height: 150, display: 'block' }}
                          />
                        ) : (
                          <div style={{ width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111318', fontSize: '0.75rem' }}>
                            Membuat QR...
                          </div>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: '0.15em',
                          color: '#D95D39',
                          fontSize: '0.95rem',
                        }}
                      >
                        {selectedTicket.ticketCode || selectedTicket.id}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#6B6E7A', marginTop: 4 }}>
                        Tunjukkan QR Code ini pada scanner gate masuk konser
                      </span>
                    </div>

                    {/* Ticket Metadata */}
                    <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#6B6E7A', display: 'block' }}>Kategori / Tier</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F5F3EE' }}>
                          {selectedTicket.tier || 'FESTIVAL'} ({selectedTicket.quantity || 1}x)
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#6B6E7A', display: 'block' }}>Pemegang Tiket</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F5F3EE' }}>
                          {selectedTicket.buyerName || selectedTicket.customerName || 'Penonton Konser'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#6B6E7A', display: 'block' }}>Tanggal Acara</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F5F3EE' }}>
                          {selectedTicket.eventDate || selectedTicket.date || 'Oktober 2026'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#6B6E7A', display: 'block' }}>Lokasi Venue</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F5F3EE' }}>
                          {selectedTicket.location || 'Jakarta'}
                        </span>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ fontSize: '0.68rem', color: '#6B6E7A', display: 'block' }}>Total Pembayaran</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#D95D39', fontFamily: "'Space Grotesk', sans-serif" }}>
                          Rp {Number(selectedTicket.total || selectedTicket.price || 0).toLocaleString('id-ID')} ({selectedTicket.paymentMethod?.toUpperCase() || 'QRIS'})
                        </span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div
                      style={{
                        padding: '12px 20px',
                        background: 'rgba(245,243,238,0.02)',
                        borderTop: '1px solid rgba(245,243,238,0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <button
                        onClick={() => handleDelete(selectedTicket.id || selectedTicket.ticketCode)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          opacity: 0.8,
                        }}
                      >
                        Hapus Riwayat
                      </button>
                      <button
                        onClick={handlePrint}
                        style={{
                          background: 'rgba(245,243,238,0.08)',
                          border: '1px solid rgba(245,243,238,0.15)',
                          color: '#F5F3EE',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          borderRadius: 6,
                          padding: '6px 12px',
                          cursor: 'pointer',
                        }}
                      >
                        🖨️ Cetak / Simpan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
