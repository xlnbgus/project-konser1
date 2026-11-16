import { useState } from 'react'

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'cs',
      text: 'Halo! Selamat datang di KonserKu. Ada yang bisa kami bantu terkait tiket konser atau pembayaran?',
      time: 'Baru saja',
    },
  ])
  const [inputText, setInputText] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return
    const userMsg = { sender: 'user', text: inputText, time: 'Baru saja' }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'cs',
          text: 'Terima kasih atas pesanmu! Tim Customer Support kami sedang memeriksa kendalamu atau kamu bisa langsung terhubung ke WhatsApp resmi kami di 0812-3456-7890.',
          time: 'Baru saja',
        },
      ])
    }, 800)
  }

  const handleQuickQuestion = (q) => {
    const userMsg = { sender: 'user', text: q, time: 'Baru saja' }
    setMessages((prev) => [...prev, userMsg])

    setTimeout(() => {
      let reply = 'Tim kami siap membantu.'
      if (q.includes('Cara Beli')) {
        reply = 'Pilih konser di halaman utama, klik "Beli", pilih kategori seat map & jumlah tiket (maks 4), lalu bayar via QRIS/VA.'
      } else if (q.includes('Kendala')) {
        reply = 'Bila ada kendala QRIS atau VA, mohon simpan bukti transaksi dan kirimkan ke tim CS melalui WhatsApp di 0812-3456-7890.'
      }
      setMessages((prev) => [...prev, { sender: 'cs', text: reply, time: 'Baru saja' }])
    }, 600)
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div
        className="live-chat-floating-container"
        style={{
          position: 'fixed',
          bottom: 84,
          right: 80,
          zIndex: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: '#D95D39',
              color: '#fff',
              border: 'none',
              borderRadius: 30,
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(217,93,57,0.35)',
              transition: 'transform 0.2s, background 0.2s',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '0.84rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 8px #4ade80',
              }}
            />
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>Live Chat / WA</span>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div
            style={{
              width: 360,
              maxWidth: 'calc(100vw - 32px)',
              background: '#161920',
              border: '1px solid rgba(245,243,238,0.12)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeInUp 0.2s ease-out',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #1A1D25 0%, #111318 100%)',
                borderBottom: '1px solid rgba(245,243,238,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: '#D95D39',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                  }}
                >
                  🎧
                </div>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      color: '#F5F3EE',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    Support KonserKu
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                    <span style={{ color: '#4ade80', fontSize: '0.7rem', fontWeight: 600 }}>Online 24/7</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20KonserKu,%20saya%20butuh%20bantuan%20terkait%20tiket%20konser"
                  target="_blank"
                  rel="noreferrer"
                  title="Buka WhatsApp Langsung"
                  style={{
                    background: 'rgba(74,222,128,0.15)',
                    color: '#4ade80',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 10px',
                    fontSize: '0.72rem',
                    textDecoration: 'none',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  WA ↗
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9095A1',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div
              style={{
                height: 280,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                background: '#111318',
              }}
            >
              {messages.map((m, idx) => {
                const isUser = m.sender === 'user'
                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        background: isUser ? '#D95D39' : '#161920',
                        color: isUser ? '#fff' : '#F5F3EE',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                        border: isUser ? 'none' : '1px solid rgba(245,243,238,0.08)',
                      }}
                    >
                      {m.text}
                    </div>
                    <span style={{ fontSize: '0.64rem', color: '#6B6E7A', display: 'block', marginTop: 3, textAlign: isUser ? 'right' : 'left' }}>
                      {m.time}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Quick Suggestions */}
            <div
              style={{
                padding: '8px 12px',
                background: '#161920',
                borderTop: '1px solid rgba(245,243,238,0.06)',
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
              }}
            >
              <button
                type="button"
                onClick={() => handleQuickQuestion('Cara Beli Tiket?')}
                style={{
                  background: 'rgba(245,243,238,0.05)',
                  border: '1px solid rgba(245,243,238,0.1)',
                  color: '#9095A1',
                  borderRadius: 20,
                  padding: '4px 10px',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                Cara Beli?
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion('Kendala Pembayaran?')}
                style={{
                  background: 'rgba(245,243,238,0.05)',
                  border: '1px solid rgba(245,243,238,0.1)',
                  color: '#9095A1',
                  borderRadius: 20,
                  padding: '4px 10px',
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                Kendala Bayar?
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              style={{
                padding: '12px 14px',
                background: '#161920',
                borderTop: '1px solid rgba(245,243,238,0.08)',
                display: 'flex',
                gap: 8,
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik pertanyaanmu..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(245,243,238,0.05)',
                  border: '1px solid rgba(245,243,238,0.1)',
                  color: '#F5F3EE',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#D95D39',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Kirim
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .live-chat-floating-container {
            right: 18px !important;
            bottom: 76px !important;
          }
        }
      `}</style>
    </>
  )
}
