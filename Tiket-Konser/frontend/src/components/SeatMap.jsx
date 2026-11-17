export const TIER_CONFIG = {
  VIP: {
    id: 'VIP',
    name: 'VIP Front Row',
    badge: 'EXCLUSIVE',
    priceDelta: 400000,
    color: '#0066CC',
    perks: ['Paling dekat dengan panggung', 'Akses Fast Track Gate Masuk', 'Official Lanyard & Merchandise Pack', 'Akses VIP Lounge'],
    quota: 'Sisa 12 tiket',
  },
  FESTIVAL: {
    id: 'FESTIVAL',
    name: 'Festival Standing',
    badge: 'POPULER',
    priceDelta: 0,
    color: '#2563EB',
    perks: ['Area festival standing tengah panggung', 'Suara akustik & tata lampu optimal', 'Akses food & merchandise area'],
    quota: 'Sisa 84 tiket',
  },
  REGULAR: {
    id: 'REGULAR',
    name: 'Regular Tribune',
    badge: 'HEMAT',
    priceDelta: -100000,
    color: '#64748B',
    perks: ['Tempat duduk tribun bernomor (numbered seat)', 'Pemandangan panggung dari atas tanpa terhalang', 'Akses gerbang utama'],
    quota: 'Sisa 45 tiket',
  },
}

export default function SeatMap({ basePrice = 500000, selectedTier = 'FESTIVAL', onSelectTier }) {
  const currentTier = TIER_CONFIG[selectedTier] || TIER_CONFIG.FESTIVAL

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 14,
        border: '1px solid #E5E7EB',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3
            style={{
              margin: '0 0 4px',
              color: '#111827',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Peta Panggung &amp; Denah Kategori
          </h3>
          <p style={{ margin: 0, color: '#4B5563', fontSize: '0.78rem' }}>
            Klik area panggung atau pilih tier tiket di bawah untuk memilih lokasi menonton
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.72rem', color: '#4B5563' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0066CC' }} /> VIP
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#2563EB' }} /> Festival
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#64748B' }} /> Regular
          </span>
        </div>
      </div>

      {/* Interactive Venue Map */}
      <div
        style={{
          background: '#F9FAFB',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          padding: '24px 16px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        {/* Main Stage */}
        <div
          style={{
            width: '75%',
            maxWidth: 380,
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '6px 6px 16px 16px',
            padding: '10px 0',
            textAlign: 'center',
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <span
            style={{
              color: '#111827',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            ★ PANGGUNG UTAMA / MAIN STAGE ★
          </span>
        </div>

        {/* Venue Layout Grid */}
        <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* VIP Section */}
          <div
            onClick={() => onSelectTier('VIP')}
            style={{
              padding: '16px',
              borderRadius: 8,
              background: selectedTier === 'VIP' ? '#EFF6FF' : '#FFFFFF',
              border: selectedTier === 'VIP' ? '2px solid #0066CC' : '1px dashed #BFDBFE',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
              transform: selectedTier === 'VIP' ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#0066CC', fontWeight: 700, fontSize: '0.86rem', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.04em' }}>
                VIP FRONT ROW ZONE
              </span>
              <span style={{ fontSize: '0.62rem', background: '#0066CC', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                BEST VIEW
              </span>
            </div>
            <span style={{ display: 'block', color: '#4B5563', fontSize: '0.72rem', marginTop: 4 }}>
              Barisan terdepan • Akses prioritas fast-track
            </span>
          </div>

          {/* Festival Section (Standing) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div
              onClick={() => onSelectTier('FESTIVAL')}
              style={{
                padding: '24px 10px',
                borderRadius: 8,
                background: selectedTier === 'FESTIVAL' ? '#EFF6FF' : '#FFFFFF',
                border: selectedTier === 'FESTIVAL' ? '2px solid #2563EB' : '1px dashed #CBD5E1',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                transform: selectedTier === 'FESTIVAL' ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <span style={{ color: '#111827', fontWeight: 700, fontSize: '0.82rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                FESTIVAL A
              </span>
              <span style={{ display: 'block', color: '#6B7280', fontSize: '0.68rem', marginTop: 4 }}>
                Standing Center
              </span>
            </div>

            <div
              onClick={() => onSelectTier('FESTIVAL')}
              style={{
                padding: '24px 10px',
                borderRadius: 8,
                background: selectedTier === 'FESTIVAL' ? '#EFF6FF' : '#FFFFFF',
                border: selectedTier === 'FESTIVAL' ? '2px solid #2563EB' : '1px dashed #CBD5E1',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                transform: selectedTier === 'FESTIVAL' ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <span style={{ color: '#111827', fontWeight: 700, fontSize: '0.82rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                FESTIVAL B
              </span>
              <span style={{ display: 'block', color: '#6B7280', fontSize: '0.68rem', marginTop: 4 }}>
                Standing Center
              </span>
            </div>
          </div>

          {/* Regular / Tribune Section */}
          <div
            onClick={() => onSelectTier('REGULAR')}
            style={{
              padding: '16px',
              borderRadius: 8,
              background: selectedTier === 'REGULAR' ? '#F1F5F9' : '#FFFFFF',
              border: selectedTier === 'REGULAR' ? '2px solid #64748B' : '1px dashed #CBD5E1',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              transform: selectedTier === 'REGULAR' ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span style={{ color: '#111827', fontWeight: 700, fontSize: '0.84rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              REGULAR TRIBUNE (SEATING)
            </span>
            <span style={{ display: 'block', color: '#6B7280', fontSize: '0.7rem', marginTop: 4 }}>
              Tribun bertingkat bernomor • Pemandangan luas &amp; nyaman
            </span>
          </div>
        </div>

        {/* FOH & Sound Audio indicator */}
        <div style={{ marginTop: 14, fontSize: '0.65rem', color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          • FOH SOUND &amp; LIGHTING CONTROL CONSOLE •
        </div>
      </div>

      {/* Tier Selector Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        {Object.values(TIER_CONFIG).map((tier) => {
          const isSelected = selectedTier === tier.id
          const finalPrice = Math.max(100000, Number(basePrice) + tier.priceDelta)
          return (
            <div
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              style={{
                padding: '14px',
                borderRadius: 10,
                background: isSelected ? '#EFF6FF' : '#FFFFFF',
                border: isSelected ? '1.5px solid #0066CC' : '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? '#0066CC' : '#111827' }}>
                  {tier.name}
                </span>
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: isSelected ? '#0066CC' : '#F3F4F6',
                    color: isSelected ? '#fff' : '#4B5563',
                  }}
                >
                  {tier.badge}
                </span>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
                Rp {finalPrice.toLocaleString('id-ID')}
              </div>
              <span style={{ fontSize: '0.68rem', color: '#6B6E7A', display: 'block', marginTop: 4 }}>
                {tier.quota}
              </span>
            </div>
          )
        })}
      </div>

      {/* Perks List for Current Selected Tier */}
      <div
        style={{
          background: '#F9FAFB',
          borderRadius: 8,
          padding: '12px 14px',
          border: '1px solid #E5E7EB',
        }}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0066CC', display: 'block', marginBottom: 6 }}>
          KEUNTUNGAN KATEGORI {currentTier.name.toUpperCase()}:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px 12px' }}>
          {currentTier.perks.map((perk, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: '#4B5563' }}>
              <span style={{ color: '#0066CC', fontWeight: 700 }}>✓</span>
              {perk}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
