const steps = [
  {
    n: '01',
    title: 'Temukan Event',
    desc: 'Cari konser atau festival musik favoritmu dari puluhan jadwal di seluruh Indonesia.',
  },
  {
    n: '02',
    title: 'Pilih Tiket',
    desc: 'Pilih kategori tiket sesuai preferensimu — VIP, Festival Pass, atau Regular.',
  },
  {
    n: '03',
    title: 'Bayar Aman',
    desc: 'Tersedia QRIS, transfer bank, e-wallet, dan kartu kredit dengan konfirmasi instan.',
  },
  {
    n: '04',
    title: 'Nikmati Acara',
    desc: 'Dapatkan e-tiket dengan QR code resmi di email dan tunjukkan di pintu masuk venue.',
  },
]

export default function HowItWorks() {
  return (
    <section id="cara-beli" className="reveal-section" style={{ padding: '100px 0', background: '#FFFFFF', position: 'relative' }}>
      <div id="tentang-kami" style={{ position: 'absolute', top: -70 }} />
      <div id="how-it-works" style={{ position: 'absolute', top: -70 }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: 56 }}>
          <p className="label-eyebrow" style={{ marginBottom: 10 }}>Cara Pembelian &amp; Tentang Kami</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 className="section-title">Cara Membeli Tiket di KonserKu</h2>
            <p style={{ color: '#4B5563', fontSize: '0.9rem', maxWidth: 360, lineHeight: 1.6 }}>
              Dapatkan tiket konser &amp; festival impianmu hanya dalam 4 langkah mudah dan terpercaya
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 48 }}>
          {steps.map((st, i) => (
            <div
              key={st.n}
              className="reveal-scale"
              style={{
                padding: '32px 26px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                position: 'relative',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${(i % 4) * 90}ms`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#FFFFFF'
                e.currentTarget.style.borderColor = '#0066CC'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#F9FAFB'
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Number */}
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '2.8rem',
                fontWeight: 700,
                color: '#BFDBFE',
                lineHeight: 1,
                marginBottom: 16,
                letterSpacing: '-0.04em',
              }}>
                {st.n}
              </div>

              {/* Accent line */}
              <div style={{ width: 32, height: 3, background: '#0066CC', marginBottom: 16, borderRadius: 2 }} />

              <h3 style={{
                color: '#111827',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '1.05rem', marginBottom: 10,
                letterSpacing: '-0.01em',
              }}>
                {st.title}
              </h3>
              <p style={{ color: '#4B5563', fontSize: '0.875rem', lineHeight: 1.7 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="reveal delay-200" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
          background: '#F4F5F7',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
          padding: '32px 36px',
        }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.35rem', color: '#111827', marginBottom: 6, letterSpacing: '-0.02em' }}>
              Siap menemukan konser impianmu?
            </h3>
            <p style={{ color: '#4B5563', fontSize: '0.88rem', margin: 0 }}>Proses pemesanan instan, tiket resmi dikirim langsung ke email kamu.</p>
          </div>
          <button
            onClick={() => document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '0.9rem', flexShrink: 0 }}
          >
            Mulai Beli Tiket →
          </button>
        </div>
      </div>
    </section>
  )
}
