import { useState } from 'react'

const FAQ_ITEMS = [
  {
    q: 'Bagaimana cara membeli dan menerima e-tiket di KonserKu?',
    a: 'Pilih konser atau festival yang kamu inginkan, pilih kategori tempat duduk (VIP, Festival, atau Regular), lengkapi data pemesan, lalu selesaikan pembayaran melalui QRIS, Virtual Account, atau GoPay. E-tiket resmi ber-QR Code akan langsung muncul di menu "Tiket Saya" dan salinannya dikirimkan ke email terdaftar.',
  },
  {
    q: 'Apakah tiket yang sudah dibeli bisa di-refund atau dipindahtangankan?',
    a: 'Sesuai ketentuan umum promotor, tiket yang telah dibeli tidak dapat dibatalkan atau di-refund kecuali event dibatalkan oleh penyelenggara. Untuk pemindahtanganan tiket, pemegang baru wajib membawa surat kuasa bermaterai serta fotokopi KTP pemilik akun asli saat penukaran wristband.',
  },
  {
    q: 'Berapa batas maksimal pembelian tiket untuk satu akun?',
    a: 'Untuk mencegah calo (scalper) dan menjamin keadilan akses, setiap pengguna dibatasi membeli maksimal 4 (empat) tiket per transaksi untuk satu event konser.',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung?',
    a: 'KonserKu mendukung pembayaran instan via QRIS (semua e-wallet dan m-banking), Virtual Account (BCA, Mandiri, BNI, BRI) dengan verifikasi otomatis 24/7, serta GoPay & Kartu Kredit berstandar keamanan enkripsi PCI-DSS.',
  },
  {
    q: 'Bagaimana cara masuk gate venue pada hari H konser?',
    a: 'Cukup buka web KonserKu di HP kamu, klik menu "Tiket Saya", dan perlihatkan QR Code e-tiket kepada staf gate konser untuk discan. Jangan lupa membawa kartu identitas resmi (KTP / SIM / Paspor) yang sesuai dengan nama pemesan.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx)
  }

  return (
    <section id="faq" className="reveal-section" style={{ padding: '90px 0', background: '#FFFFFF', borderTop: '1px solid #E5E7EB', position: 'relative' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }} className="reveal">
          <p className="label-eyebrow" style={{ marginBottom: 10 }}>Pusat Informasi</p>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 12 }}>
            Pertanyaan Umum (FAQ)
          </h2>
          <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Semua hal yang perlu kamu ketahui seputar pembelian tiket, keamanan transaksi, dan gate masuk konser
          </p>
        </div>

        {/* Accordion list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="reveal delay-100">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: isOpen ? '1px solid #0066CC' : '1px solid #E5E7EB',
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'border-color 0.25s ease',
                  boxShadow: isOpen ? '0 4px 12px rgba(0, 102, 204, 0.06)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      color: isOpen ? '#0066CC' : '#111827',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.q}
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: isOpen ? '#EFF6FF' : '#F3F4F6',
                      color: isOpen ? '#0066CC' : '#4B5563',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.25s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 22px 24px',
                      color: '#4B5563',
                      fontSize: '0.86rem',
                      lineHeight: 1.65,
                      fontFamily: "'Manrope', sans-serif",
                      borderTop: '1px solid #F3F4F6',
                      paddingTop: '16px',
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
