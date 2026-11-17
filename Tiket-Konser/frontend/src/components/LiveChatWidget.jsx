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
              background: '#0066CC',
              color: '#fff',
              border: 'none',
              borderRadius: 30,
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 102, 204, 0.3)',
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
                background: '#10B981',
                boxShadow: '0 0 6px #10B981',
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
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeInUp 0.2s ease-out',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                background: '#FFFFFF',
                borderBottom: '1px solid #E5E7EB',
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
                    background: '#EFF6FF',
                    color: '#0066CC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                      color: '#111827',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    Support KonserKu
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
                    <span style={{ color: '#059669', fontSize: '0.7rem', fontWeight: 600 }}>Online 24/7</span>
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
                    background: '#D1FAE5',
                    color: '#059669',
                    border: '1px solid #A7F3D0',
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
                    color: '#4B5563',
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
                background: '#F9FAFB',
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
                        background: isUser ? '#0066CC' : '#FFFFFF',
                        color: isUser ? '#fff' : '#111827',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                        border: isUser ? 'none' : '1px solid #E5E7EB',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
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
                background: '#FFFFFF',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
              }}
            >
              <button
                type="button"
                onClick={() => handleQuickQuestion('Cara Beli Tiket?')}
                style={{
                  background: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  color: '#4B5563',
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
                  background: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  color: '#4B5563',
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
                background: '#FFFFFF',
                borderTop: '1px solid #E5E7EB',
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
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  color: '#111827',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0066CC')}
                onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
              />
              <button
                type="submit"
                style={{
                  background: '#0066CC',
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
