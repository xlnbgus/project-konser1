import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PaymentDetailForm from './PaymentDetailForm'

const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString('id-ID')}`

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function StepBar({ step }) {
  const steps = ['Detail & Tiket', 'Metode Pembayaran']
  return (
    <div style={{ display: 'flex', alignItems: 'center', maxWidth: 460, margin: '0 auto 36px' }}>
      {steps.map((label, i) => {
        const active = step === i + 1
        const done = step > i + 1
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                border: '1.5px solid',
                borderColor: done || active ? '#D95D39' : 'rgba(245,243,238,0.15)',
                background: done ? '#D95D39' : active ? 'rgba(217,93,57,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700,
                color: done ? '#fff' : active ? '#D95D39' : '#6B6E7A',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'all 0.3s ease',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '0.82rem', fontWeight: active ? 700 : 500,
                color: active ? '#F5F3EE' : done ? '#9095A1' : '#6B6E7A',
                whiteSpace: 'nowrap', fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1.5, margin: '0 16px',
                background: step > 1 ? '#D95D39' : 'rgba(245,243,238,0.1)',
                transition: 'background 0.4s ease',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function EventDetailView({ event, onBack }) {
  const navigate = useNavigate()
  const [step, setStep]                   = useState(1)
  const [quantity, setQuantity]           = useState(1)
  const [promoCode, setPromoCode]         = useState('')
  const [appliedPromo, setAppliedPromo]   = useState(null)
  const [promoError, setPromoError]       = useState('')
  const [promoLoading, setPromoLoading]   = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState('')
  const [paymentDetail, setPaymentDetail] = useState({})
  const [loading, setLoading]             = useState(false)
  const [message, setMessage]             = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    fetch('/api/payment-methods')
      .then(r => r.json())
      .then(d => {
        const methods = Array.isArray(d.paymentMethods) ? d.paymentMethods : []
        const withQris = methods.some(m => m.value === 'qris')
          ? methods
          : [...methods, { value: 'qris', label: 'QRIS', description: 'Scan QR dengan kamera HP' }]
        setPaymentMethods(withQris)
        if (withQris.length > 0) setSelectedMethod(withQris[0].value)
      })
      .catch(() => {
        const fallback = [{ value: 'qris', label: 'QRIS', description: 'Scan QR dengan kamera HP' }]
        setPaymentMethods(fallback)
        setSelectedMethod('qris')
      })
  }, [])

  const rawPrice = Number(event.priceRaw || event.price || 0)
  const subtotal = rawPrice * quantity
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
      if (!found) {
        setPromoError('Kode promo tidak valid atau sudah tidak aktif.')
      } else {
        setAppliedPromo(found)
        setPromoError('')
      }
    } catch {
      setPromoError('Gagal memvalidasi kode promo.')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!selectedMethod) {
      setMessage('Pilih metode pembayaran terlebih dahulu.')
      return
    }

    if (selectedMethod === 'debit' || selectedMethod === 'credit') {
      const { cardNumber = '', cardName = '', expiry = '', cvv = '' } = paymentDetail
      if (cardNumber.replace(/\s/g, '').length < 16) { setMessage('Nomor kartu harus 16 digit.'); return }
      if (!cardName.trim()) { setMessage('Nama di kartu wajib diisi.'); return }
      if (expiry.length < 5) { setMessage('Tanggal kadaluarsa tidak valid.'); return }
      if (cvv.length < 3) { setMessage('CVV tidak valid.'); return }
    }
    if (selectedMethod === 'bank' && !paymentDetail.senderName?.trim()) {
      setMessage('Nama pengirim wajib diisi.')
      return
    }
    if (selectedMethod === 'e-wallet' && (!paymentDetail.phone || paymentDetail.phone.length < 9)) {
      setMessage('Nomor HP akun e-wallet tidak valid.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      let eventId = Number(event.id)
      if (!eventId) {
        const evRes = await fetch('/api/events')
        const evData = await evRes.json()
        const evList = Array.isArray(evData.events) ? evData.events : []
        const matched = evList.find(e =>
          e.title?.toLowerCase().includes((event.accent || event.title || '').toLowerCase()) ||
          e.title === event.eventTitle ||
          e.title === event.title
        )
        if (matched) eventId = matched.id
      }

      if (!eventId) {
        setMessage('Event tidak ditemukan di database.')
        setLoading(false)
        return
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          quantity: Number(quantity),
          paymentMethod: selectedMethod,
          promoCode: appliedPromo ? appliedPromo.code : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Checkout gagal diproses.')

      if (data.order) {
        navigate('/payment-success', {
          state: {
            eventTitle:   data.order.eventTitle || event.title,
            paymentLabel: data.order.paymentLabel || selectedMethod.toUpperCase(),
            total:        data.order.total,
            orderId:      data.order.id,
            quantity:     data.order.quantity,
            subtotal:     data.order.subtotal || subtotal,
            discountAmount: data.order.discountAmount || discountAmount,
            promoCode:    data.order.promoCode || appliedPromo?.code,
            eventDate:    event.date,
          },
        })
      }
    } catch (err) {
      setMessage(err.message || 'Terjadi kesalahan sistem saat checkout.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    flex: 1,
    padding: '12px 14px',
    borderRadius: 8,
    background: 'rgba(245, 243, 238, 0.05)',
    color: '#F5F3EE',
    border: '1px solid rgba(245, 243, 238, 0.1)',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Manrope', sans-serif",
  }

  const displayTitle = event.title || event.eventTitle || 'Konser Musik'
  const displayVenue = event.venue || event.location || 'Jakarta, Indonesia'
  const displayDate  = event.date ? formatDate(event.date) : 'Jadwal diumumkan'
  const displayBadge = event.badge || event.category || 'Event Pilihan'
  const displayImage = event.image

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111318',
      color: '#F5F3EE',
      fontFamily: "'Manrope', sans-serif",
      position: 'relative',
      paddingBottom: 80,
    }}>

      {/* Top Header Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(17, 19, 24, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(245, 243, 238, 0.08)',
        padding: '16px 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(245, 243, 238, 0.06)',
              border: '1px solid rgba(245, 243, 238, 0.1)',
              color: '#F5F3EE',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(217,93,57,0.15)'; e.currentTarget.style.borderColor = 'rgba(217,93,57,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245, 243, 238, 0.06)'; e.currentTarget.style.borderColor = 'rgba(245, 243, 238, 0.1)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Kembali ke Daftar Konser
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: '0.72rem',
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(217, 93, 57, 0.12)',
              border: '1px solid rgba(217, 93, 57, 0.25)',
              color: '#D95D39',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {displayBadge}
            </span>
            <span style={{ color: '#6B6E7A', fontSize: '0.82rem' }}>Pemesanan Tiket Resmi</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 24px' }}>

        {/* Stepper Progress Bar */}
        <StepBar step={step} />

        {/* 2-Column Full Page Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 36,
          alignItems: 'start',
        }} className="full-detail-grid">

          {/* LEFT COLUMN: Event Visual Poster, Details & Description */}
          <div style={{
            background: '#161920',
            borderRadius: 14,
            border: '1px solid rgba(245, 243, 238, 0.08)',
            overflow: 'hidden',
          }}>
            {/* Visual Event Banner */}
            <div style={{ position: 'relative', width: '100%', height: 320, background: '#0D0F14' }}>
              {displayImage && (
                <img
                  src={displayImage}
                  alt={displayTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                />
              )}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(22, 25, 32, 1) 0%, rgba(22, 25, 32, 0.2) 60%, transparent 100%)',
              }} />

              <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 5,
                  background: '#D95D39',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  marginBottom: 10,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  {displayBadge}
                </span>
                <h1 style={{
                  color: '#F5F3EE',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
                  margin: 0,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}>
                  {displayTitle} {event.accent ? <span style={{ color: '#D95D39' }}>{event.accent}</span> : ''}
                </h1>
              </div>
            </div>

            {/* Information Meta */}
            <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#D95D39',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  Tentang Acara
                </p>
                <p style={{ color: '#9095A1', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>
                  {event.description || 'Saksikan pertunjukan spektakuler dengan tata panggung audio visual berstandar internasional dan pengalaman konser tak terlupakan.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Venue / Lokasi', value: displayVenue },
                  { label: 'Tanggal Event', value: displayDate },
                  { label: 'Harga Satuan', value: formatPrice(rawPrice) },
                  { label: 'Kategori Tiket', value: event.category || 'General Admission' },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'rgba(245, 243, 238, 0.04)',
                    border: '1px solid rgba(245, 243, 238, 0.07)',
                  }}>
                    <span style={{ color: '#6B6E7A', fontSize: '0.72rem', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                      {item.label}
                    </span>
                    <span style={{ color: '#F5F3EE', fontSize: '0.86rem', fontWeight: 700 }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {event.stats && (
                <div style={{
                  display: 'flex',
                  gap: 16,
                  padding: '14px 18px',
                  borderRadius: 8,
                  background: 'rgba(217, 93, 57, 0.08)',
                  border: '1px solid rgba(217, 93, 57, 0.18)',
                }}>
                  {event.stats.map(st => (
                    <div key={st.l} style={{ textAlign: 'center', flex: 1 }}>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#D95D39', fontSize: '1.15rem', margin: 0 }}>{st.v}</p>
                      <p style={{ color: '#6B6E7A', fontSize: '0.72rem', margin: 0 }}>{st.l}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Stepper (Detail Tiket -> Pembayaran) */}
          <div style={{
            background: '#161920',
            borderRadius: 14,
            border: '1px solid rgba(245, 243, 238, 0.08)',
            padding: '32px 28px',
          }}>

            {/* STEP 1: Pilih Jumlah Tiket & Promo */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: '#F5F3EE',
                    marginBottom: 6,
                    letterSpacing: '-0.01em',
                  }}>
                    Pilih Jumlah &amp; Promo Tiket
                  </h3>
                  <p style={{ color: '#6B6E7A', fontSize: '0.84rem', margin: 0 }}>
                    Tentukan kuota tiket yang ingin dipesan dan gunakan kode voucher diskon.
                  </p>
                </div>

                {/* Ticket Quantity Stepper */}
                <div>
                  <label style={{
                    color: '#9095A1',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 10,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    Jumlah Tiket
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => { if (quantity > 1) { setQuantity(q => q - 1); setAppliedPromo(null) } }}
                      style={{
                        width: 44, height: 44, borderRadius: 8,
                        border: `1px solid rgba(245,243,238,${quantity > 1 ? '0.18' : '0.06'})`,
                        background: 'rgba(245,243,238,0.05)',
                        color: '#F5F3EE', fontSize: 22,
                        cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                        opacity: quantity > 1 ? 1 : 0.3,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                      }}
                    >
                      −
                    </button>

                    <div style={{
                      flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8,
                      background: 'rgba(245,243,238,0.05)',
                      border: '1px solid rgba(245,243,238,0.1)',
                      color: '#F5F3EE', fontWeight: 700, fontSize: '1.25rem',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                      {quantity} Tiket
                    </div>

                    <button
                      onClick={() => { if (quantity < 10) { setQuantity(q => q + 1); setAppliedPromo(null) } }}
                      style={{
                        width: 44, height: 44, borderRadius: 8,
                        border: `1px solid rgba(245,243,238,${quantity < 10 ? '0.18' : '0.06'})`,
                        background: 'rgba(245,243,238,0.05)',
                        color: '#F5F3EE', fontSize: 22,
                        cursor: quantity < 10 ? 'pointer' : 'not-allowed',
                        opacity: quantity < 10 ? 1 : 0.3,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p style={{ color: '#6B6E7A', fontSize: '0.74rem', marginTop: 8 }}>
                    Maksimal 10 tiket dalam satu kali transaksi pembelian.
                  </p>
                </div>

                {/* Promo Code Input */}
                <div>
                  <label style={{
                    color: '#9095A1',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 8,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    Kode Promo Diskon
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => { setPromoCode(e.target.value.toUpperCase()); setAppliedPromo(null); setPromoError('') }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo() } }}
                      placeholder="Masukkan kode promo (contoh: EARLYBIRD30)"
                      style={{
                        ...inputStyle,
                        border: appliedPromo ? '1px solid rgba(34,197,94,0.4)' : promoError ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(245,243,238,0.1)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim() || promoLoading}
                      className="btn-primary"
                      style={{
                        padding: '12px 20px',
                        borderRadius: 8,
                        fontSize: '0.84rem',
                        whiteSpace: 'nowrap',
                        opacity: !promoCode.trim() || promoLoading ? 0.6 : 1,
                      }}
                    >
                      {promoLoading ? 'Memeriksa…' : 'Gunakan'}
                    </button>
                  </div>

                  {appliedPromo && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginTop: 10, padding: '10px 14px', borderRadius: 8,
                      background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)',
                    }}>
                      <div>
                        <div style={{ color: '#86efac', fontSize: '0.82rem', fontWeight: 700 }}>{appliedPromo.title}</div>
                        <div style={{ color: '#4ade80', fontSize: '0.74rem' }}>
                          Diskon {appliedPromo.discountPercent}% — hemat {formatPrice(discountAmount)}
                        </div>
                      </div>
                      <button
                        onClick={() => { setAppliedPromo(null); setPromoCode(''); setPromoError('') }}
                        style={{ background: 'none', border: 'none', color: '#6B6E7A', cursor: 'pointer', fontSize: 18 }}
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <div style={{
                      marginTop: 10, padding: '9px 12px', borderRadius: 8,
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#fca5a5', fontSize: '0.78rem',
                    }}>
                      {promoError}
                    </div>
                  )}
                </div>

                {/* Price Breakdown Summary */}
                <div style={{
                  padding: '18px 20px',
                  borderRadius: 10,
                  background: 'rgba(245, 243, 238, 0.03)',
                  border: '1px solid rgba(245, 243, 238, 0.08)',
                }}>
                  <p style={{
                    color: '#6B6E7A',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    Rincian Biaya
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B6E7A', fontSize: '0.86rem', marginBottom: 8 }}>
                    <span>{formatPrice(rawPrice)} × {quantity} tiket</span>
                    <span style={{ color: '#F5F3EE', fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontSize: '0.86rem', marginBottom: 8 }}>
                      <span>Diskon ({appliedPromo?.discountPercent}%)</span>
                      <span>− {formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div style={{ height: 1, background: 'rgba(245,243,238,0.08)', margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#F5F3EE', fontWeight: 700, fontSize: '0.95rem' }}>Total Pembayaran</span>
                    <span style={{ color: '#D95D39', fontSize: '1.25rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Step Action Button */}
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '0.92rem' }}
                >
                  Lanjut ke Pembayaran →
                </button>
              </div>
            )}

            {/* STEP 2: Pilih Metode Pembayaran & Verifikasi */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: '#F5F3EE',
                    marginBottom: 6,
                    letterSpacing: '-0.01em',
                  }}>
                    Pilih Metode Pembayaran
                  </h3>
                  <p style={{ color: '#6B6E7A', fontSize: '0.84rem', margin: 0 }}>
                    Transaksi aman dan terenkripsi. Konfirmasi instan setelah pembayaran.
                  </p>
                </div>

                {/* Ringkasan Singkat Pesanan */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 8,
                  background: 'rgba(217, 93, 57, 0.08)',
                  border: '1px solid rgba(217, 93, 57, 0.2)',
                }}>
                  <div>
                    <p style={{ color: '#F5F3EE', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 2px' }}>{displayTitle}</p>
                    <p style={{ color: '#6B6E7A', fontSize: '0.78rem', margin: 0 }}>{quantity} tiket · {displayDate}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#D95D39', fontWeight: 700, fontSize: '1.1rem', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Payment Methods Grid */}
                <div>
                  <label style={{
                    color: '#9095A1',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 12,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    Metode Yang Tersedia
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
                    {paymentMethods.map(method => {
                      const isSelected = selectedMethod === method.value
                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => {
                            setSelectedMethod(method.value)
                            setPaymentDetail(method.value === 'qris' ? { eventTitle: displayTitle, total: totalPrice, orderId: `KO-${Date.now()}` } : {})
                            setMessage('')
                          }}
                          style={{
                            padding: '14px 16px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.86rem',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            background: isSelected ? 'rgba(217,93,57,0.15)' : 'rgba(245,243,238,0.04)',
                            color: '#F5F3EE',
                            border: isSelected ? '1px solid #D95D39' : '1px solid rgba(245,243,238,0.08)',
                            fontFamily: "'Manrope', sans-serif",
                          }}
                        >
                          <div style={{ fontWeight: 700, color: isSelected ? '#D95D39' : '#F5F3EE' }}>{method.label}</div>
                          <div style={{ color: 'rgba(245,243,238,0.4)', fontSize: '0.72rem', fontWeight: 400, marginTop: 4 }}>
                            {method.description}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Detailed Verification Form for Chosen Method */}
                {selectedMethod && (
                  <div style={{
                    padding: '20px',
                    borderRadius: 10,
                    background: 'rgba(245, 243, 238, 0.03)',
                    border: '1px solid rgba(245, 243, 238, 0.08)',
                  }}>
                    <p style={{
                      color: '#9095A1',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 16,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                      Detail Verifikasi — {paymentMethods.find(m => m.value === selectedMethod)?.label}
                    </p>
                    <PaymentDetailForm method={selectedMethod} detail={paymentDetail} onChange={setPaymentDetail} />
                  </div>
                )}

                {message && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    fontSize: '0.84rem',
                  }}>
                    {message}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      padding: '14px 22px',
                      borderRadius: 8,
                      border: '1px solid rgba(245, 243, 238, 0.12)',
                      background: 'transparent',
                      color: '#9095A1',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    ← Kembali
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      padding: '14px',
                      fontSize: '0.92rem',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'Memproses Transaksi…' : `Bayar ${formatPrice(totalPrice)} Sekarang`}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .full-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
