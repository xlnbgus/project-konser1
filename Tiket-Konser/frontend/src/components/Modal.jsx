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
      background: 'rgba(10, 11, 15, 0.9)',
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
        background: '#161920',
        border: '1px solid rgba(245, 243, 238, 0.08)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        padding: '28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: description ? 6 : 20 }}>
          <h3 style={{
            margin: 0,
            color: '#F5F3EE',
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
              background: 'rgba(245, 243, 238, 0.06)',
              color: '#9095A1',
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
            onMouseEnter={e => { e.currentTarget.style.color = '#F5F3EE'; e.currentTarget.style.background = 'rgba(245, 243, 238, 0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9095A1'; e.currentTarget.style.background = 'rgba(245, 243, 238, 0.06)' }}
          >
            ×
          </button>
        </div>

        {description && (
          <p style={{
            margin: '0 0 22px',
            color: '#6B6E7A',
            lineHeight: 1.6,
            fontSize: '0.86rem',
            fontFamily: "'Manrope', sans-serif",
          }}>
            {description}
          </p>
        )}

        {children}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(245, 243, 238, 0.06)' }}>
          <button
            onClick={() => {
              if (onSecondary) onSecondary()
              onClose()
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid rgba(245, 243, 238, 0.12)',
              background: 'transparent',
              color: '#9095A1',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F5F3EE'; e.currentTarget.style.borderColor = 'rgba(245, 243, 238, 0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9095A1'; e.currentTarget.style.borderColor = 'rgba(245, 243, 238, 0.12)' }}
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
