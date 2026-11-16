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
    <section style={{ padding: '100px 0', background: '#111318', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: 64 }}>
          <p className="label-eyebrow" style={{ marginBottom: 10 }}>Cara Pembelian</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 className="section-title">Cara Membeli Tiket</h2>
            <p style={{ color: '#6B6E7A', fontSize: '0.88rem', maxWidth: 320, lineHeight: 1.6 }}>
              Dapatkan tiket konser & festival impianmu hanya dalam 4 langkah mudah
            </p>
          </div>
        </div>

        {/* Steps — editorial numbered layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 0 }}>
          {steps.map((st, i) => (
            <div
              key={st.n}
              className={`reveal-scale delay-${((i % 4) + 1) * 100}`}
              style={{
                padding: '32px 28px',
                borderRight: i < steps.length - 1 ? '1px solid rgba(245,243,238,0.06)' : 'none',
                position: 'relative',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,243,238,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Number */}
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '3rem',
                fontWeight: 700,
                color: 'rgba(217,93,57,0.15)',
                lineHeight: 1,
                marginBottom: 20,
                letterSpacing: '-0.04em',
              }}>
                {st.n}
              </div>

              {/* Accent line */}
              <div style={{ width: 28, height: 2, background: '#D95D39', marginBottom: 16, borderRadius: 1 }} />

              <h3 style={{
                color: '#F5F3EE',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '1.05rem', marginBottom: 10,
                letterSpacing: '-0.01em',
              }}>
                {st.title}
              </h3>
              <p style={{ color: '#6B6E7A', fontSize: '0.875rem', lineHeight: 1.7 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Border bottom */}
        <div style={{ height: 1, background: 'rgba(245,243,238,0.06)', marginBottom: 64 }} />

        {/* CTA */}
        <div className="reveal delay-200" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#F5F3EE', marginBottom: 6, letterSpacing: '-0.02em' }}>
              Siap menemukan konser impianmu?
            </h3>
            <p style={{ color: '#6B6E7A', fontSize: '0.88rem' }}>Proses pemesanan instan, tiket dikirim langsung ke email kamu.</p>
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
