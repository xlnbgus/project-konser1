export default function Modal({ isOpen, onClose, title, description, ctaLabel = 'Lanjut', onCta, secondaryLabel = 'Tutup', onSecondary, children, closeOnCta = true }) {
  if (!isOpen) return null

  const handleCta = async () => {
    if (onCta) {
      await onCta()
    }
    if (closeOnCta) {
      onClose()
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      background: 'rgba(17, 24, 39, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 14,
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: description ? 6 : 20 }}>
          <h3 style={{
            margin: 0,
            color: '#111827',
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: '#F3F4F6',
              color: '#4B5563',
              cursor: 'pointer',
              borderRadius: 6,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              marginLeft: 12,
              flexShrink: 0,
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.background = '#E5E7EB' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.background = '#F3F4F6' }}
          >
            ×
          </button>
        </div>

        {description && (
          <p style={{
            margin: '0 0 22px',
            color: '#4B5563',
            lineHeight: 1.6,
            fontSize: '0.86rem',
            fontFamily: "'Manrope', sans-serif",
          }}>
            {description}
          </p>
        )}

        {children}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
          <button
            onClick={() => {
              if (onSecondary) onSecondary()
              onClose()
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#4B5563',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = '#F9FAFB' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF' }}
          >
            {secondaryLabel}
          </button>
          <button
            onClick={handleCta}
            className="btn-primary"
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              fontSize: '0.86rem',
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
