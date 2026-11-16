import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const formatPrice = (price) => `Rp ${Number(price).toLocaleString('id-ID')}`

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function StepIndicator({ step }) {
  const steps = ['Pilih Tiket', 'Pembayaran']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
      {steps.map((label, i) => {
        const active = step === i + 1
        const done = step > i + 1
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                border: `2px solid ${done || active ? '#ff7a00' : 'rgba(255,255,255,0.15)'}`,
                background: done ? '#ff7a00' : active ? 'rgba(255,122,0,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: 800,
                color: done ? '#fff' : active ? '#ff7a00' : '#4b5563',
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: active ? '#ff7a00' : done ? '#6b7280' : '#374151', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 10px', marginBottom: 20, background: step > 1 ? '#ff7a00' : 'rgba(255,255,255,0.1)', borderRadius: 2, transition: 'background 0.4s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CheckoutPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const event = location.state?.event
  const [quantity, setQuantity] = useState(1)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!event) navigate('/', { replace: true })
  }, [event, navigate])

  if (!event) return null

  const imgSrc = imgError ? null : (typeof event.image === 'string' ? event.image : null)
  const subtotal = Number(event.price) * quantity
  const discountAmount = appliedPromo ? Math.round(subtotal * (Number(appliedPromo.discountPercent || 0) / 100)) : 0
  const totalPrice = Math.max(0, subtotal - discountAmount)

  const handleApplyPromo = async () => {
    const code = promoCode.trim()
    if (!code) return
    setPromoLoading(true)
    setPromoError('')
    setAppliedPromo(null)
    try {
      const res = await fetch('/api/promos')
      const data = await res.json()
      const promos = Array.isArray(data.promos) ? data.promos : []
      const found = promos.find(p => p.code?.toUpperCase() === code.toUpperCase())
      if (!found) setPromoError('Kode promo tidak valid atau sudah tidak aktif.')
      else { setAppliedPromo(found); setPromoError('') }
    } catch {
      setPromoError('Gagal memvalidasi kode promo.')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleNext = () => {
    navigate('/payment/' + event.id, {
      state: { event, quantity, appliedPromo, totalPrice, subtotal, discountAmount },
    })
  }

  return (
    <div style={{ background: '#08090d', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar searchQuery='' onSearchChange={() => {}} activeCategory='Semua' onCategoryChange={() => {}} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Page title */}
        <div style={{ marginBottom: 36 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', padding: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Kembali
          </button>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 900, color: '#f8fafc', fontSize: 'clamp(1.5rem, 3vw, 2rem)', margin: 0 }}>Pesan Tiket</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: 6 }}>Langkah 1 dari 2</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 32, alignItems: 'start' }}>

          {/* LEFT — event summary */}
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            position: 'sticky', top: 100,
          }}>
            {imgSrc && (
              <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                <img src={imgSrc} alt={event.title} onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,13,0.85) 0%, transparent 50%)' }} />
              </div>
            )}
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, color: '#f8fafc', fontSize: '1rem', margin: '0 0 14px', lineHeight: 1.3 }}>{event.title}</h3>
              {[
                { icon: '📍', text: event.location || event.venue || '-' },
                { icon: '📅', text: formatDate(event.date) },
                { icon: '🏷️', text: formatPrice(event.price) + ' / tiket' },
              ].map(item => (
                <div key={item.icon} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Stepper */}
            <div style={{ padding: '24px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <StepIndicator step={1} />

              {/* Quantity */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 12 }}>JUMLAH TIKET</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <button
                    onClick={() => { if (quantity > 1) { setQuantity(q => q - 1); setAppliedPromo(null) } }}
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      border: `1px solid ${quantity > 1 ? 'rgba(255,122,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 22,
                      cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                      opacity: quantity > 1 ? 1 : 0.35,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >−</button>
                  <div style={{
                    flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,122,0,0.3)',
                    color: '#fff', fontWeight: 800, fontSize: '1.3rem', fontFamily: 'Poppins',
                  }}>
                    {quantity}
                  </div>
                  <button
                    onClick={() => { if (quantity < 10) { setQuantity(q => q + 1); setAppliedPromo(null) } }}
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      border: `1px solid ${quantity < 10 ? 'rgba(255,122,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 22,
                      cursor: quantity < 10 ? 'pointer' : 'not-allowed',
                      opacity: quantity < 10 ? 1 : 0.35,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >+</button>
                </div>
                <p style={{ color: '#374151', fontSize: '0.74rem', marginTop: 8 }}>Maks. 10 tiket per transaksi</p>
              </div>

              {/* Promo */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 10 }}>KODE PROMO</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value.toUpperCase()); setAppliedPromo(null); setPromoError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo() } }}
                    placeholder="Contoh: EARLYBIRD30"
                    style={{
                      flex: 1, padding: '11px 14px', borderRadius: 12,
                      background: '#0f172a', color: '#f8fafc',
                      border: appliedPromo ? '1px solid rgba(34,197,94,0.5)' : promoError ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                      fontSize: '0.9rem', outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim() || promoLoading}
                    style={{
                      padding: '11px 20px', borderRadius: 12, border: 'none',
                      background: !promoCode.trim() || promoLoading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #ff462b, #ff7a00)',
                      color: '#fff', fontWeight: 700, fontSize: '0.88rem',
                      cursor: !promoCode.trim() || promoLoading ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {promoLoading ? '...' : 'Pakai'}
                  </button>
                </div>

                {appliedPromo && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.22)' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span>✅</span>
                      <div>
                        <div style={{ color: '#86efac', fontSize: '0.82rem', fontWeight: 700 }}>{appliedPromo.title}</div>
                        <div style={{ color: '#4ade80', fontSize: '0.75rem' }}>Diskon {appliedPromo.discountPercent}% — hemat {formatPrice(discountAmount)}</div>
                      </div>
                    </div>
                    <button onClick={() => { setAppliedPromo(null); setPromoCode(''); setPromoError('') }} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 18 }}>×</button>
                  </div>
                )}

                {promoError && (
                  <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#fca5a5', fontSize: '0.82rem' }}>
                    ⚠️ {promoError}
                  </div>
                )}
              </div>

              {/* Price summary */}
              <div style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 12 }}>RINGKASAN HARGA</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 8 }}>
                  <span>Subtotal ({quantity} tiket)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontSize: '0.85rem', marginBottom: 8 }}>
                    <span>Diskon ({appliedPromo?.discountPercent}%)</span>
                    <span>− {formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.1rem' }}>
                  <span style={{ color: '#fff' }}>Total</span>
                  <span style={{ background: 'linear-gradient(135deg,#ff462b,#ff7a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleNext}
                style={{
                  width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #ff462b, #ff7a00)',
                  color: '#fff', fontFamily: 'Poppins,sans-serif',
                  fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(255,70,43,0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(255,70,43,0.55)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,70,43,0.4)' }}
              >
                Lanjut ke Pembayaran →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
