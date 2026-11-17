import { useState, useEffect } from 'react'

let toastListener = null

export function showToast(message, type = 'success') {
  if (toastListener) {
    toastListener({ message, type, id: Date.now() })
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastListener = (newToast) => {
      setToasts((prev) => [...prev, newToast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id))
      }, 3500)
    }
    return () => {
      toastListener = null
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            pointerEvents: 'auto',
            minWidth: 280,
            maxWidth: 380,
            padding: '12px 18px',
            borderRadius: 10,
            background: '#FFFFFF',
            border: t.type === 'error' ? '1px solid #FECACA' : '1px solid #BFDBFE',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'fadeInUp 0.25s ease-out',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: t.type === 'error' ? '#FEE2E2' : '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: t.type === 'error' ? '#DC2626' : '#0066CC',
            }}
          >
            {t.type === 'error' ? (
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <p
            style={{
              margin: 0,
              color: '#111827',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: "'Manrope', sans-serif",
              lineHeight: 1.4,
            }}
          >
            {t.message}
          </p>
        </div>
      ))}
    </div>
  )
}
