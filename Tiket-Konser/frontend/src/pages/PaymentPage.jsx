import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PaymentDetailForm from '../components/PaymentDetailForm'

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

export default function PaymentPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const stateData = location.state
  const event = stateData?.event
  const quantity = stateData?.quantity || 1
  const appliedPromo = stateData?.appliedPromo || null
  const totalPrice = stateData?.totalPrice ?? (event ? Number(event.price) * quantity : 0)
  const subtotal = stateData?.subtotal ?? totalPrice
  const discountAmount = stateData?.discountAmount ?? 0

  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState('')
  const [paymentDetail, setPaymentDetail] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!event) { navigate('/', { replace: true }); return }
    fetch('/api/payment-methods')
      .then(r => r.json())
      .then(d => {
        const methods = Array.isArray(d.paymentMethods) ? d.paymentMethods : []
        const withQris = methods.some(m => m.value === 'qris') ? methods : [...methods, { value: 'qris', label: 'QRIS', description: 'Scan QR dengan kamera HP' }]
        setPaymentMethods(withQris)
        if (withQris.length > 0) setSelectedMethod(withQris[0].value)
      })
      .catch(() => {
        const fallback = [{ value: 'qris', label: 'QRIS', description: 'Scan QR dengan kamera HP' }]
        setPaymentMethods(fallback)
        setSelectedMethod('qris')
      })
  }, [event, navigate])

  if (!event) return null

  const imgSrc = imgError ? null : (typeof event.image === 'string' ? event.image : null)

  const handleSelectMethod = (method) => {
    setSelectedMethod(method)
    setPaymentDetail(method === 'qris' ? {
      eventTitle: event.title,
      total: totalPrice,
      orderId: `KO-${Date.now()}`,
    } : {})
    setErrorMsg('')
  }

  const handlePay = async () => {
    if (!selectedMethod) { setErrorMsg('Pilih metode pembayaran terlebih dahulu.'); return }

    if (selectedMethod === 'debit' || selectedMethod === 'credit') {
      const { cardNumber = '', cardName = '', expiry = '', cvv = '' } = paymentDetail
      if (cardNumber.replace(/\s/g, '').length < 16) { setErrorMsg('Nomor kartu harus 16 digit.'); return }
      if (!cardName.trim()) { setErrorMsg('Nama di kartu wajib diisi.'); return }
      if (expiry.length < 5) { setErrorMsg('Tanggal kadaluarsa tidak valid.'); return }
      if (cvv.length < 3) { setErrorMsg('CVV tidak valid.'); return }
    }
    if (selectedMethod === 'bank') {
      if (!paymentDetail.senderName?.trim()) { setErrorMsg('Nama pengirim wajib diisi.'); return }
    }
    if (selectedMethod === 'e-wallet') {
      if (!paymentDetail.phone || paymentDetail.phone.length < 9) { setErrorMsg('Nomor HP tidak valid.'); return }
    }

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          quantity: Number(quantity),
          paymentMethod: selectedMethod,
          promoCode: appliedPromo ? appliedPromo.code : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Checkout gagal')
      if (data.order) {
        navigate('/payment-success', {
          state: {
            eventTitle: data.order.eventTitle,
            paymentLabel: data.order.paymentLabel,
            total: data.order.total,
            orderId: data.order.id,
            quantity: data.order.quantity,
            subtotal: data.order.subtotal ?? subtotal,
            discountAmount: data.order.discountAmount ?? discountAmount,
            promoCode: data.order.promoCode ?? appliedPromo?.code,
          },
        })
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses pembayaran.')
    } finally {
      setLoading(false)
    }
  }

  const methodLabel = paymentMethods.find(m => m.value === selectedMethod)?.label || ''

  return (
    <div style={{ background: '#08090d', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar searchQuery='' onSearchChange={() => {}} activeCategory='Semua' onCategoryChange={() => {}} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Page title */}
        <div style={{ marginBottom: 36 }}>
          <button
            onClick={() => navigate('/checkout/' + event.id, { state: { event } })}
            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', padding: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Kembali
          </button>
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 900, color: '#f8fafc', fontSize: 'clamp(1.5rem, 3vw, 2rem)', margin: 0 }}>Pembayaran</h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: 6 }}>Langkah 2 dari 2</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 32, alignItems: 'start' }}>

          {/* LEFT — Order summary */}
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            position: 'sticky', top: 100,
          }}>
            {imgSrc && (
              <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                <img src={imgSrc} alt={event.title} onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,13,0.9) 0%, transparent 50%)' }} />
              </div>
            )}
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem', margin: '0 0 14px', lineHeight: 1.3 }}>{event.title}</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13 }}>📅</span>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{formatDate(event.date)}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 13 }}>🎟️</span>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{quantity} tiket</span>
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 14 }} />

              <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 10 }}>RINCIAN HARGA</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem', marginBottom: 6 }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80', fontSize: '0.82rem', marginBottom: 6 }}>
                  <span>Diskon</span>
                  <span>− {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
                <span style={{ color: '#fff', fontSize: '0.95rem' }}>Total</span>
                <span style={{ background: 'linear-gradient(135deg,#ff462b,#ff7a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.05rem' }}>
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — payment form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ padding: '24px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <StepIndicator step={2} />

              {/* Payment methods grid */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14 }}>METODE PEMBAYARAN</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                  {paymentMethods.map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => handleSelectMethod(method.value)}
                      style={{
                        padding: '14px', borderRadius: 14, cursor: 'pointer',
                        fontWeight: 700, fontSize: '0.85rem', textAlign: 'left',
                        background: selectedMethod === method.value
                          ? 'linear-gradient(135deg, rgba(255,70,43,0.8), rgba(255,122,0,0.6))'
                          : 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        border: selectedMethod === method.value ? '1px solid rgba(255,122,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: selectedMethod === method.value ? '0 4px 16px rgba(255,70,43,0.3)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div>{method.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', fontWeight: 400, marginTop: 4 }}>{method.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment detail form */}
              {selectedMethod && (
                <div style={{ padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 14 }}>
                    🔐 DETAIL VERIFIKASI — {methodLabel}
                  </p>
                  <PaymentDetailForm method={selectedMethod} detail={paymentDetail} onChange={setPaymentDetail} />
                </div>
              )}

              {/* Error */}
              {errorMsg && (
                <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.22)', color: '#fca5a5', fontSize: '0.85rem', marginBottom: 20 }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => navigate('/checkout/' + event.id, { state: { event } })}
                  style={{
                    padding: '14px 20px', borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)', color: '#94a3b8',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  ← Kembali
                </button>
                <button
                  onClick={handlePay}
                  disabled={loading}
                  style={{
                    flex: 1, padding: '14px', borderRadius: 14, border: 'none',
                    background: loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #ff462b, #ff7a00)',
                    color: '#fff', fontFamily: 'Poppins,sans-serif',
                    fontSize: '0.95rem', fontWeight: 800,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 8px 28px rgba(255,70,43,0.4)',
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(255,70,43,0.55)' } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 28px rgba(255,70,43,0.4)' }}
                >
                  {loading ? 'Memproses…' : `🔒 Bayar ${formatPrice(totalPrice)} Sekarang`}
                </button>
              </div>

              <p style={{ color: '#374151', fontSize: '0.72rem', textAlign: 'center', marginTop: 12 }}>
                Transaksi dienkripsi & dilindungi keamanan berlapis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
