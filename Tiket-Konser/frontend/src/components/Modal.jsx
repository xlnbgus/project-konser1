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
    <div style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(2,6,23,0.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ width:'100%', maxWidth:520, borderRadius:24, background:'rgba(15,23,42,0.96)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 30px 80px rgba(0,0,0,0.45)', padding:'28px' }}>
        <h3 style={{ margin:'0 0 10px', color:'#fff', fontSize:'1.15rem', fontWeight:800 }}>{title}</h3>
        <p style={{ margin:'0 0 22px', color:'#cbd5e1', lineHeight:1.6, fontSize:'0.95rem' }}>{description}</p>
        {children}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
          <button
            onClick={() => {
              if (onSecondary) onSecondary()
              onClose()
            }}
            style={{ padding:'10px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)', color:'#e2e8f0', cursor:'pointer', fontWeight:600 }}
          >
            {secondaryLabel}
          </button>
          <button
            onClick={handleCta}
            style={{ padding:'10px 16px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#7c3aed,#ec4899)', color:'#fff', cursor:'pointer', fontWeight:700 }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
