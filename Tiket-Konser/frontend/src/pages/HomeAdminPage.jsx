import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../api'

const tabs = ['overview', 'events', 'promos', 'categories', 'artists', 'orders', 'sales']

const initialEventForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  price: '',
  category: '',
  organizer: '',
  status: 'available',
}

const initialPromoForm = {
  code: '',
  title: '',
  description: '',
  discountPercent: '',
  expires: '',
}

const initialCategoryForm = {
  name: '',
  description: '',
  quota: '',
  priceAdjustment: '',
}

const initialArtistForm = {
  name: '',
  genre: '',
  status: 'active',
}

const fallbackOrders = [
  { id: 'demo-1', eventTitle: 'Weekend Festival', paymentMethod: 'debit', total: 500000, status: 'pending' },
  { id: 'demo-2', eventTitle: 'Indie Night', paymentMethod: 'e-wallet', total: 360000, status: 'paid' },
]

const fallbackEvents = [
  { id: 1, title: 'Weekend Festival', date: '2026-09-12', location: 'Jakarta', price: 250000 },
  { id: 2, title: 'Indie Night', date: '2026-09-25', location: 'Bandung', price: 180000 },
]

const fallbackPromos = [
  { id: 1, code: 'EARLYBIRD30', title: 'Early Bird', discountPercent: 30 },
  { id: 2, code: 'NEWUSER2026', title: 'Pengguna Baru', discountPercent: 0 },
]

const fallbackCategories = [
  { id: 1, name: 'VIP', description: 'Area depan panggung', quota: 120, priceAdjustment: 0 },
  { id: 2, name: 'Regular', description: 'Area tribun utama', quota: 300, priceAdjustment: 0 },
]

const fallbackArtists = [
  { id: 1, name: 'Ari Lasso', genre: 'Pop', status: 'active' },
  { id: 2, name: 'RAN', genre: 'Rock', status: 'active' },
]

const fallbackAnalytics = {
  totalOrders: 2,
  paidOrders: 1,
  pendingOrders: 1,
  totalRevenue: 860000,
  soldTickets: 4,
  salesOpen: true,
}

const fallbackSales = { isSalesOpen: true }

export default function HomeAdminPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState(fallbackOrders)
  const [events, setEvents] = useState(fallbackEvents)
  const [promos, setPromos] = useState(fallbackPromos)
  const [categories, setCategories] = useState(fallbackCategories)
  const [artists, setArtists] = useState(fallbackArtists)
  const [analytics, setAnalytics] = useState(fallbackAnalytics)
  const [salesSettings, setSalesSettings] = useState(fallbackSales)
  const [eventForm, setEventForm] = useState(initialEventForm)
  const [promoForm, setPromoForm] = useState(initialPromoForm)
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [artistForm, setArtistForm] = useState(initialArtistForm)
  const [editingEventId, setEditingEventId] = useState(null)
  const [editingPromoId, setEditingPromoId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingArtistId, setEditingArtistId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [showEventModal, setShowEventModal] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showArtistModal, setShowArtistModal] = useState(false)

  const token = useMemo(() => localStorage.getItem('token') || '', [])

  const fetchData = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const [ordersRes, eventsRes, promosRes, categoriesRes, artistsRes, analyticsRes, salesRes] = await Promise.all([
        adminApi.getOrders(token),
        adminApi.getEvents(token),
        adminApi.getPromos(token),
        adminApi.getCategories(token),
        adminApi.getArtists(token),
        adminApi.getAnalytics(token),
        adminApi.getSales(token),
      ])

      setOrders(ordersRes.orders || fallbackOrders)
      setEvents(eventsRes.events || fallbackEvents)
      setPromos(promosRes.promos || fallbackPromos)
      setCategories(categoriesRes.categories || fallbackCategories)
      setArtists(artistsRes.artists || fallbackArtists)
      setAnalytics(analyticsRes.analytics || fallbackAnalytics)
      setSalesSettings(salesRes.sales || fallbackSales)
    } catch (error) {
      setOrders(fallbackOrders)
      setEvents(fallbackEvents)
      setPromos(fallbackPromos)
      setCategories(fallbackCategories)
      setArtists(fallbackArtists)
      setAnalytics(fallbackAnalytics)
      setSalesSettings(fallbackSales)
      setMessage('Koneksi admin sedang tidak tersedia, dashboard menggunakan data demo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const submitEvent = async (e) => {
    e.preventDefault()
    try {
      if (editingEventId) {
        await adminApi.updateEvent(token, editingEventId, {
          ...eventForm,
          price: Number(eventForm.price),
        })
      } else {
        await adminApi.createEvent(token, {
          ...eventForm,
          price: Number(eventForm.price),
        })
      }
      setEventForm(initialEventForm)
      setEditingEventId(null)
      setShowEventModal(false)
      setMessage('Event berhasil disimpan')
      fetchData()
    } catch (error) {
      setMessage(error.message || 'Gagal menyimpan event')
    }
  }

  const editEvent = (event) => {
    setEditingEventId(event.id)
    setShowEventModal(true)
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      location: event.location || '',
      price: event.price || '',
      category: event.category || '',
      organizer: event.organizer || '',
      status: event.status || 'available',
    })
  }

  const deleteEvent = async (id) => {
    try {
      await adminApi.deleteEvent(token, id)
      setMessage('Event berhasil dihapus')
      fetchData()
    } catch (error) {
      setMessage(error.message || 'Gagal menghapus event')
    }
  }

  const submitPromo = async (e) => {
    e.preventDefault()
    try {
      if (editingPromoId) {
        await adminApi.updatePromo(token, editingPromoId, {
          ...promoForm,
          discountPercent: Number(promoForm.discountPercent),
        })
      } else {
        await adminApi.createPromo(token, {
          ...promoForm,
          discountPercent: Number(promoForm.discountPercent),
        })
      }
      setPromoForm(initialPromoForm)
      setEditingPromoId(null)
      setShowPromoModal(false)
      setMessage('Promo berhasil disimpan')
      fetchData()
    } catch (error) {
      setMessage(error.message || 'Gagal menyimpan promo')
    }
  }

  const editPromo = (promo) => {
    setEditingPromoId(promo.id)
    setShowPromoModal(true)
    setPromoForm({
      code: promo.code || '',
      title: promo.title || '',
      description: promo.description || '',
      discountPercent: promo.discountPercent || '',
      expires: promo.expires || '',
    })
  }

  const deletePromo = async (id) => {
    try {
      await adminApi.deletePromo(token, id)
      setMessage('Promo berhasil dihapus')
      fetchData()
    } catch (error) {
      setMessage(error.message || 'Gagal menghapus promo')
    }
  }

  const submitCategory = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: categoryForm.name,
        description: categoryForm.description,
        quota: Number(categoryForm.quota || 0),
        priceAdjustment: Number(categoryForm.priceAdjustment || 0),
      }

      if (editingCategoryId) {
        await adminApi.updateCategory(token, editingCategoryId, payload)
      } else {
        await adminApi.createCategory(token, payload)
      }

      setCategoryForm(initialCategoryForm)
      setEditingCategoryId(null)
      setShowCategoryModal(false)
      setMessage('Kategori tiket berhasil disimpan')
      fetchData()
    } catch (error) {
      setMessage(error.message || 'Gagal menyimpan kategori tiket')
    }
  }

  const editCategory = (category) => {
    setEditingCategoryId(category.id)
    setShowCategoryModal(true)
    setCategoryForm({
      name: category.name || '',
      description: category.description || '',
      quota: category.quota || '',
      priceAdjustment: category.priceAdjustment || '',
    })
  }

  const deleteCategory = async (id) => {
    try {
      await adminApi.deleteCategory(token, id)
      setMessage('Kategori tiket berhasil dihapus')
      fetchData()
    } catch (error) {
      setMessage(error.message || 'Gagal menghapus kategori tiket')
    }
  }

  const submitArtist = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: artistForm.name,
        genre: artistForm.genre,
        status: artistForm.status,
      }

      if (editingArtistId) {
        await adminApi.updateArtist(token, editingArtistId, payload)
      } else {
        await adminApi.createArtist(token, payload)
      }

      setArtistForm(initialArtistForm)
      setEditingArtistId(null)
      setShowArtistModal(false)
      setMessage('Artis berhasil disimpan')
      fetchData()
    } catch (error) {
      setMessage(error.message || 'Gagal menyimpan artis')
    }
  }

  const editArtist = (artist) => {
    setEditingArtistId(artist.id)
    setShowArtistModal(true)
    setArtistForm({
      name: artist.name || '',
      genre: artist.genre || '',
      status: artist.status || 'active',
    })
  }

  const deleteArtist = async (id) => {
    try {
      await adminApi.deleteArtist(token, id)
      setMessage('Artis berhasil dihapus')
      fetchData()
    } catch (error) {
      setMessage(error.message || 'Gagal menghapus artis')
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await adminApi.updateOrderStatus(token, id, status)
      setOrders((current) => current.map((order) => (String(order.id) === String(response.order.id) ? { ...order, status: response.order.status } : order)))
      setMessage('Status pesanan berhasil diperbarui')
    } catch (error) {
      setMessage(error.message || 'Gagal mengubah status pesanan')
    }
  }

  const toggleSales = async () => {
    try {
      const response = await adminApi.toggleSales(token, { isSalesOpen: !salesSettings.isSalesOpen })
      setSalesSettings(response.sales || { isSalesOpen: true })
      setMessage('Status penjualan berhasil diperbarui')
    } catch (error) {
      setMessage(error.message || 'Gagal mengubah status penjualan')
    }
  }

  const filteredEvents = events.filter((event) => [event.title, event.location, event.category].join(' ').toLowerCase().includes(search.toLowerCase()))
  const filteredPromos = promos.filter((promo) => [promo.code, promo.title, promo.description].join(' ').toLowerCase().includes(search.toLowerCase()))
  const filteredCategories = categories.filter((category) => [category.name, category.description].join(' ').toLowerCase().includes(search.toLowerCase()))
  const filteredArtists = artists.filter((artist) => [artist.name, artist.genre, artist.status].join(' ').toLowerCase().includes(search.toLowerCase()))
  const filteredOrders = orders.filter((order) => [order.eventTitle, order.paymentMethod, order.status].join(' ').toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)', color: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Admin Panel</p>
            <h1 style={{ margin: '6px 0 0', fontSize: '2rem' }}>Dashboard KonserOjol</h1>
          </div>
          <button onClick={handleLogout} style={{ border: 'none', borderRadius: '999px', padding: '10px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        {message ? <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(16,185,129,0.16)', border: '1px solid rgba(16,185,129,0.3)', color: '#d1fae5' }}>{message}</div> : null}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ border: 'none', borderRadius: '999px', padding: '10px 14px', cursor: 'pointer', background: activeTab === tab ? '#8b5cf6' : 'rgba(255,255,255,0.08)', color: '#fff' }}>
              {tab === 'overview' ? 'Overview' : tab === 'events' ? 'Events' : tab === 'promos' ? 'Promos' : tab === 'categories' ? 'Kategori' : tab === 'artists' ? 'Artis' : tab === 'sales' ? 'Sales' : 'Orders'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { title: 'Pesanan', value: orders.length, color: '#8b5cf6' },
            { title: 'Event Aktif', value: events.length, color: '#ec4899' },
            { title: 'Promo', value: promos.length, color: '#06b6d4' },
            { title: 'Penjualan', value: analytics.salesOpen ? 'Buka' : 'Tutup', color: '#10b981' },
          ].map((item) => (
            <div key={item.title} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '20px' }}>
              <p style={{ margin: '0 0 8px', color: '#9ca3af' }}>{item.title}</p>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: item.color }}>{item.value}</h2>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <section style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }}>
                <h3 style={{ marginTop: 0 }}>Ringkasan penjualan</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  {[
                    { label: 'Total Pesanan', value: analytics.totalOrders },
                    { label: 'Sudah Dibayar', value: analytics.paidOrders },
                    { label: 'Menunggu', value: analytics.pendingOrders },
                    { label: 'Pendapatan', value: `Rp ${Number(analytics.totalRevenue || 0).toLocaleString('id-ID')}` },
                  ].map((item) => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px' }}>
                      <p style={{ margin: '0 0 8px', color: '#9ca3af' }}>{item.label}</p>
                      <h3 style={{ margin: 0 }}>{item.value}</h3>
                    </div>
                  ))}
                </div>
                <div style={{ color: '#d1d5db', lineHeight: 1.7 }}>
                  Tiket terjual: {analytics.soldTickets || 0}. Status penjualan saat ini: <strong>{salesSettings.isSalesOpen !== false ? 'Terbuka' : 'Ditutup'}</strong>.
                </div>
              </section>
            </div>
          )}

          {activeTab === 'events' && (
            <section style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>Kelola Event</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari event..." style={{ ...inputStyle, width: '220px' }} />
                  <button onClick={() => { setShowEventModal(true); setEditingEventId(null); setEventForm(initialEventForm) }} style={{ border: 'none', borderRadius: '12px', padding: '10px 12px', background: '#8b5cf6', color: '#fff', cursor: 'pointer' }}>+ Tambah Event</button>
                </div>
              </div>
              {loading ? <p>Memuat...</p> : (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {filteredEvents.map((event) => (
                    <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
                      <div>
                        <strong>{event.title}</strong>
                        <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{event.date} • {event.location} • Rp {Number(event.price).toLocaleString('id-ID')}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => editEvent(event)} style={{ border: 'none', borderRadius: '8px', padding: '8px 10px', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => deleteEvent(event.id)} style={{ border: 'none', borderRadius: '8px', padding: '8px 10px', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'promos' && (
            <section style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>Kelola Promo</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari promo..." style={{ ...inputStyle, width: '220px' }} />
                  <button onClick={() => { setShowPromoModal(true); setEditingPromoId(null); setPromoForm(initialPromoForm) }} style={{ border: 'none', borderRadius: '12px', padding: '10px 12px', background: '#ec4899', color: '#fff', cursor: 'pointer' }}>+ Tambah Promo</button>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {filteredPromos.map((promo) => (
                  <div key={promo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <strong>{promo.code}</strong>
                      <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{promo.title} • {promo.discountPercent}%</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editPromo(promo)} style={{ border: 'none', borderRadius: '8px', padding: '8px 10px', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deletePromo(promo.id)} style={{ border: 'none', borderRadius: '8px', padding: '8px 10px', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'categories' && (
            <section style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>Kelola Kelas Tiket</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kategori..." style={{ ...inputStyle, width: '220px' }} />
                  <button onClick={() => { setShowCategoryModal(true); setEditingCategoryId(null); setCategoryForm(initialCategoryForm) }} style={{ border: 'none', borderRadius: '12px', padding: '10px 12px', background: '#14b8a6', color: '#fff', cursor: 'pointer' }}>+ Tambah Kategori</button>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {filteredCategories.map((category) => (
                  <div key={category.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <strong>{category.name}</strong>
                      <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{category.description || '-'} • Kuota {category.quota || 0} • Adjust {category.priceAdjustment || 0}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editCategory(category)} style={{ border: 'none', borderRadius: '8px', padding: '8px 10px', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteCategory(category.id)} style={{ border: 'none', borderRadius: '8px', padding: '8px 10px', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'artists' && (
            <section style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>Kelola Artis</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari artis..." style={{ ...inputStyle, width: '220px' }} />
                  <button onClick={() => { setShowArtistModal(true); setEditingArtistId(null); setArtistForm(initialArtistForm) }} style={{ border: 'none', borderRadius: '12px', padding: '10px 12px', background: '#f59e0b', color: '#fff', cursor: 'pointer' }}>+ Tambah Artis</button>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {filteredArtists.map((artist) => (
                  <div key={artist.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <strong>{artist.name}</strong>
                      <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{artist.genre || '-'} • {artist.status || 'active'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editArtist(artist)} style={{ border: 'none', borderRadius: '8px', padding: '8px 10px', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteArtist(artist.id)} style={{ border: 'none', borderRadius: '8px', padding: '8px 10px', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'orders' && (
            <section style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>Daftar Pesanan</h3>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pesanan..." style={{ ...inputStyle, width: '220px' }} />
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {filteredOrders.map((order) => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <strong>Order #{order.id}</strong>
                      <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>{order.eventTitle || order.eventId} • {order.paymentMethod || '-'} • Total Rp {Number(order.total || 0).toLocaleString('id-ID')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ padding: '6px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.85rem' }}>{order.status || 'pending'}</span>
                      <select value={order.status || 'pending'} onChange={(e) => updateOrderStatus(order.id, e.target.value)} style={{ borderRadius: '8px', padding: '8px', background: '#111827', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="verified">Verified</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'sales' && (
            <section style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }}>
              <h3 style={{ marginTop: 0 }}>Kontrol Penjualan</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}>
                <div>
                  <strong>{salesSettings.isSalesOpen !== false ? 'Penjualan sedang dibuka' : 'Penjualan sedang ditutup'}</strong>
                  <div style={{ color: '#9ca3af', marginTop: '4px' }}>Tutup penjualan saat stok habis atau acara sudah ditutup.</div>
                </div>
                <button onClick={toggleSales} style={{ border: 'none', borderRadius: '999px', padding: '10px 14px', background: salesSettings.isSalesOpen !== false ? '#ef4444' : '#10b981', color: '#fff', cursor: 'pointer' }}>
                  {salesSettings.isSalesOpen !== false ? 'Tutup Penjualan' : 'Buka Penjualan'}
                </button>
              </div>
            </section>
          )}
        </div>

        {showEventModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 20 }}>
            <div style={{ width: '100%', maxWidth: '560px', background: '#111827', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>{editingEventId ? 'Edit Event' : 'Tambah Event'}</h3>
                <button onClick={() => setShowEventModal(false)} style={{ border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={submitEvent} style={{ display: 'grid', gap: '10px' }}>
                <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Judul event" style={inputStyle} />
                <input value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Deskripsi" style={inputStyle} />
                <input value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="Tanggal" style={inputStyle} />
                <input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Lokasi" style={inputStyle} />
                <input value={eventForm.price} onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })} placeholder="Harga" type="number" style={inputStyle} />
                <input value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} placeholder="Kategori" style={inputStyle} />
                <input value={eventForm.organizer} onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })} placeholder="Organizer" style={inputStyle} />
                <input value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })} placeholder="Status" style={inputStyle} />
                <button type="submit" style={{ border: 'none', borderRadius: '12px', padding: '10px 12px', background: '#8b5cf6', color: '#fff', cursor: 'pointer' }}>{editingEventId ? 'Simpan Perubahan' : 'Tambah Event'}</button>
              </form>
            </div>
          </div>
        )}

        {showPromoModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 20 }}>
            <div style={{ width: '100%', maxWidth: '560px', background: '#111827', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>{editingPromoId ? 'Edit Promo' : 'Tambah Promo'}</h3>
                <button onClick={() => setShowPromoModal(false)} style={{ border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={submitPromo} style={{ display: 'grid', gap: '10px' }}>
                <input value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })} placeholder="Kode promo" style={inputStyle} />
                <input value={promoForm.title} onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })} placeholder="Judul promo" style={inputStyle} />
                <input value={promoForm.description} onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })} placeholder="Deskripsi" style={inputStyle} />
                <input value={promoForm.discountPercent} onChange={(e) => setPromoForm({ ...promoForm, discountPercent: e.target.value })} placeholder="Diskon %" type="number" style={inputStyle} />
                <input value={promoForm.expires} onChange={(e) => setPromoForm({ ...promoForm, expires: e.target.value })} placeholder="Kadaluarsa" style={inputStyle} />
                <button type="submit" style={{ border: 'none', borderRadius: '12px', padding: '10px 12px', background: '#ec4899', color: '#fff', cursor: 'pointer' }}>{editingPromoId ? 'Simpan Perubahan' : 'Tambah Promo'}</button>
              </form>
            </div>
          </div>
        )}

        {showCategoryModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 20 }}>
            <div style={{ width: '100%', maxWidth: '560px', background: '#111827', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>{editingCategoryId ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                <button onClick={() => setShowCategoryModal(false)} style={{ border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={submitCategory} style={{ display: 'grid', gap: '10px' }}>
                <input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="Nama kelas" style={inputStyle} />
                <input value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} placeholder="Deskripsi" style={inputStyle} />
                <input value={categoryForm.quota} onChange={(e) => setCategoryForm({ ...categoryForm, quota: e.target.value })} placeholder="Kuota" type="number" style={inputStyle} />
                <input value={categoryForm.priceAdjustment} onChange={(e) => setCategoryForm({ ...categoryForm, priceAdjustment: e.target.value })} placeholder="Penyesuaian harga" type="number" style={inputStyle} />
                <button type="submit" style={{ border: 'none', borderRadius: '12px', padding: '10px 12px', background: '#14b8a6', color: '#fff', cursor: 'pointer' }}>{editingCategoryId ? 'Simpan Perubahan' : 'Tambah Kategori'}</button>
              </form>
            </div>
          </div>
        )}

        {showArtistModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 20 }}>
            <div style={{ width: '100%', maxWidth: '560px', background: '#111827', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>{editingArtistId ? 'Edit Artis' : 'Tambah Artis'}</h3>
                <button onClick={() => setShowArtistModal(false)} style={{ border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={submitArtist} style={{ display: 'grid', gap: '10px' }}>
                <input value={artistForm.name} onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })} placeholder="Nama artis" style={inputStyle} />
                <input value={artistForm.genre} onChange={(e) => setArtistForm({ ...artistForm, genre: e.target.value })} placeholder="Genre" style={inputStyle} />
                <input value={artistForm.status} onChange={(e) => setArtistForm({ ...artistForm, status: e.target.value })} placeholder="Status" style={inputStyle} />
                <button type="submit" style={{ border: 'none', borderRadius: '12px', padding: '10px 12px', background: '#f59e0b', color: '#fff', cursor: 'pointer' }}>{editingArtistId ? 'Simpan Perubahan' : 'Tambah Artis'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
}
