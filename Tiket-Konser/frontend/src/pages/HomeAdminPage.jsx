import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Constants ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',   label: 'Overview',  icon: '📊' },
  { id: 'events',     label: 'Events',    icon: '🎪' },
  { id: 'promos',     label: 'Promos',    icon: '🏷️' },
  { id: 'categories', label: 'Kategori',  icon: '🎫' },
  { id: 'artists',    label: 'Artis',     icon: '🎤' },
  { id: 'orders',     label: 'Pesanan',   icon: '📦' },
  { id: 'sales',      label: 'Penjualan', icon: '💰' },
]

const INIT_EVENT    = { title: '', description: '', date: '', location: '', price: '', category: '', organizer: '', status: 'available' }
const INIT_PROMO    = { code: '', title: '', description: '', discountPercent: '', expires: '' }
const INIT_CATEGORY = { name: '', description: '', quota: '', priceAdjustment: '' }
const INIT_ARTIST   = { name: '', genre: '', status: 'active' }

const DEMO_ORDERS   = [
  { id: 'd1', eventTitle: 'Weekend Festival', paymentMethod: 'e-wallet', total: 500000, status: 'pending', quantity: 2 },
  { id: 'd2', eventTitle: 'Indie Night',       paymentMethod: 'transfer', total: 360000, status: 'paid',    quantity: 1 },
]
const DEMO_EVENTS   = [
  { id: 1, title: 'Weekend Festival', description: 'Konser akbar', date: '2026-09-12', location: 'Jakarta',  price: 250000, category: 'Pop',    organizer: 'PT Events', status: 'available' },
  { id: 2, title: 'Indie Night',       description: 'Malam indie',  date: '2026-09-25', location: 'Bandung', price: 180000, category: 'Indie',   organizer: 'Indie Co', status: 'available' },
]
const DEMO_PROMOS   = [
  { id: 1, code: 'EARLYBIRD30', title: 'Early Bird',    description: 'Diskon awal',   discountPercent: 30, expires: '2026-08-01' },
  { id: 2, code: 'NEWUSER2026', title: 'Pengguna Baru', description: 'Untuk member baru', discountPercent: 10, expires: '2026-12-31' },
]
const DEMO_CATS     = [
  { id: 1, name: 'VIP',     description: 'Area depan panggung', quota: 120, priceAdjustment: 500000 },
  { id: 2, name: 'Regular', description: 'Area tribun utama',   quota: 300, priceAdjustment: 0 },
]
const DEMO_ARTISTS  = [
  { id: 1, name: 'Ari Lasso', genre: 'Pop',  status: 'active' },
  { id: 2, name: 'RAN',       genre: 'Rock', status: 'active' },
]
const DEMO_ANALYTICS = { totalOrders: 2, paidOrders: 1, pendingOrders: 1, totalRevenue: 860000, soldTickets: 3, salesOpen: true }
const DEMO_SALES     = { isSalesOpen: true }

// ─── Styles ────────────────────────────────────────────────────────────────────

const S = {
  input: {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px',
    borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)', color: '#f9fafb',
    fontSize: '0.875rem', outline: 'none',
  },
  select: {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px',
    borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
    background: '#111827', color: '#f9fafb',
    fontSize: '0.875rem', outline: 'none', cursor: 'pointer',
  },
  textarea: {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px',
    borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)', color: '#f9fafb',
    fontSize: '0.875rem', outline: 'none', resize: 'vertical', minHeight: 72,
  },
  card: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, padding: '20px',
  },
  section: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '24px',
  },
  btnPrimary: (color) => ({
    border: 'none', borderRadius: 10, padding: '10px 18px',
    background: `linear-gradient(135deg, ${color || '#7c3aed'}, ${color ? color + 'cc' : '#5b21b6'})`,
    color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }),
  btnGhost: {
    border: 'none', borderRadius: 8, padding: '7px 12px',
    background: 'rgba(255,255,255,0.07)', color: '#d1d5db',
    cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
  },
  btnDanger: {
    border: 'none', borderRadius: 8, padding: '7px 12px',
    background: 'rgba(239,68,68,0.15)', color: '#fca5a5',
    cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
  },
  label: {
    display: 'block', color: '#9ca3af', fontSize: '0.72rem',
    fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  statCard: (color) => ({
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33`,
    borderRadius: 16, padding: '20px', position: 'relative', overflow: 'hidden',
  }),
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    gap: 12, padding: '13px 15px', borderRadius: 12,
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
  },
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Modal({ title, onClose, onSubmit, children, submitLabel, submitColor }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, zIndex: 100, backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 520, background: '#0f172a',
        borderRadius: 20, padding: '28px 24px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f9fafb' }}>{title}</h3>
          <button onClick={onClose} style={{
            border: 'none', background: 'rgba(255,255,255,0.08)', color: '#9ca3af',
            cursor: 'pointer', borderRadius: 8, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
          {children}
          <button type="submit" style={{
            ...S.btnPrimary(submitColor || '#7c3aed'),
            justifyContent: 'center', padding: '12px', marginTop: 4,
          }}>
            {submitLabel || 'Simpan'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      {label && <label style={S.label}>{label}</label>}
      {children}
    </div>
  )
}

function Badge({ status }) {
  const map = {
    pending:   { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', text: 'Pending'   },
    paid:      { bg: 'rgba(16,185,129,0.15)',   color: '#10b981', text: 'Paid'      },
    verified:  { bg: 'rgba(59,130,246,0.15)',   color: '#60a5fa', text: 'Verified'  },
    cancelled: { bg: 'rgba(239,68,68,0.15)',    color: '#f87171', text: 'Cancelled' },
    active:    { bg: 'rgba(16,185,129,0.15)',   color: '#10b981', text: 'Active'    },
    inactive:  { bg: 'rgba(107,114,128,0.18)', color: '#9ca3af', text: 'Inactive'  },
    available: { bg: 'rgba(59,130,246,0.15)',   color: '#60a5fa', text: 'Available' },
    soldout:   { bg: 'rgba(239,68,68,0.15)',    color: '#f87171', text: 'Sold Out'  },
  }
  const s = map[status] || map.pending
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, background: s.bg,
      color: s.color, fontSize: '0.73rem', fontWeight: 700, letterSpacing: '0.03em',
    }}>{s.text}</span>
  )
}

function Toast({ message, type }) {
  if (!message) return null
  const colors = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#6ee7b7', icon: '✅' },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  color: '#fca5a5', icon: '❌' },
    warn:    { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', color: '#fcd34d', icon: '💡' },
  }
  const c = colors[type] || colors.success
  return (
    <div style={{
      margin: '16px 28px 0', padding: '12px 16px', borderRadius: 12,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
      fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span>{c.icon}</span> {message}
    </div>
  )
}

// ─── Fetch helper ──────────────────────────────────────────────────────────────

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token') || ''
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }
  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`)
  return data
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function HomeAdminPage() {
  const navigate = useNavigate()

  // Data
  const [events,     setEvents]     = useState(DEMO_EVENTS)
  const [promos,     setPromos]     = useState(DEMO_PROMOS)
  const [categories, setCategories] = useState(DEMO_CATS)
  const [artists,    setArtists]    = useState(DEMO_ARTISTS)
  const [orders,     setOrders]     = useState(DEMO_ORDERS)
  const [analytics,  setAnalytics]  = useState(DEMO_ANALYTICS)
  const [sales,      setSales]      = useState(DEMO_SALES)

  // UI
  const [activeTab,    setActiveTab]    = useState('overview')
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [toast,        setToast]        = useState({ message: '', type: 'success' })
  const [profileOpen,  setProfileOpen]  = useState(false)

  // Modals
  const [eventModal,    setEventModal]    = useState(false)
  const [promoModal,    setPromoModal]    = useState(false)
  const [catModal,      setCatModal]      = useState(false)
  const [artistModal,   setArtistModal]   = useState(false)

  // Forms
  const [eventForm,    setEventForm]    = useState(INIT_EVENT)
  const [promoForm,    setPromoForm]    = useState(INIT_PROMO)
  const [catForm,      setCatForm]      = useState(INIT_CATEGORY)
  const [artistForm,   setArtistForm]   = useState(INIT_ARTIST)

  // Editing IDs
  const [editEventId,  setEditEventId]  = useState(null)
  const [editPromoId,  setEditPromoId]  = useState(null)
  const [editCatId,    setEditCatId]    = useState(null)
  const [editArtistId, setEditArtistId] = useState(null)

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
  }, [])

  const notify = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000)
  }

  // ── Fetch all data ─────────────────────────────────────────────────────────

  const fetchAll = async () => {
    const token = localStorage.getItem('token') || ''
    if (!token) { navigate('/login'); return }
    setLoading(true)
    try {
      const [ev, pr, ca, ar, or_, an, sa] = await Promise.all([
        apiFetch('/api/admin/events'),
        apiFetch('/api/admin/promos'),
        apiFetch('/api/admin/categories'),
        apiFetch('/api/admin/artists'),
        apiFetch('/api/admin/orders'),
        apiFetch('/api/admin/analytics'),
        apiFetch('/api/admin/sales'),
      ])
      setEvents(ev.events           || DEMO_EVENTS)
      setPromos(pr.promos           || DEMO_PROMOS)
      setCategories(ca.categories   || DEMO_CATS)
      setArtists(ar.artists         || DEMO_ARTISTS)
      setOrders(or_.orders          || DEMO_ORDERS)
      setAnalytics(an.analytics     || DEMO_ANALYTICS)
      setSales(sa.sales             || DEMO_SALES)
    } catch {
      notify('Menggunakan data demo — backend tidak tersedia', 'warn')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // ── CRUD Events ────────────────────────────────────────────────────────────

  const openAddEvent = () => {
    setEditEventId(null)
    setEventForm(INIT_EVENT)
    setEventModal(true)
  }
  const openEditEvent = (ev) => {
    setEditEventId(ev.id)
    setEventForm({
      title:       ev.title       || '',
      description: ev.description || '',
      date:        ev.date        || '',
      location:    ev.location    || '',
      price:       ev.price       || 0,
      category:    ev.category    || '',
      organizer:   ev.organizer   || '',
      status:      ev.status      || 'available',
    })
    setEventModal(true)
  }
  const submitEvent = async (e) => {
    e.preventDefault()
    const payload = {
      title:       eventForm.title       || '',
      description: eventForm.description || '',
      date:        eventForm.date        || '',
      location:    eventForm.location    || '',
      price:       Number(eventForm.price) || 0,
      category:    eventForm.category    || 'Umum',
      organizer:   eventForm.organizer   || '',
      status:      eventForm.status      || 'available',
    }
    try {
      if (editEventId) {
        await apiFetch(`/api/admin/events/${editEventId}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await apiFetch('/api/admin/events', { method: 'POST', body: JSON.stringify(payload) })
      }
      setEventModal(false)
      notify(editEventId ? 'Event diperbarui' : 'Event ditambahkan')
      fetchAll()
    } catch (err) {
      notify(err.message || 'Gagal menyimpan event', 'error')
    }
  }
  const deleteEvent = async (id) => {
    if (!confirm('Hapus event ini?')) return
    try {
      await apiFetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      notify('Event dihapus')
      fetchAll()
    } catch (err) {
      notify(err.message || 'Gagal menghapus event', 'error')
    }
  }

  // ── CRUD Promos ────────────────────────────────────────────────────────────

  const openAddPromo = () => { setEditPromoId(null); setPromoForm(INIT_PROMO); setPromoModal(true) }
  const openEditPromo = (p) => {
    setEditPromoId(p.id)
    setPromoForm({
      code:            p.code            || '',
      title:           p.title           || '',
      description:     p.description     || '',
      discountPercent: p.discountPercent || 0,
      expires:         p.expires         || '',
    })
    setPromoModal(true)
  }
  const submitPromo = async (e) => {
    e.preventDefault()
    const payload = {
      code:            promoForm.code            || '',
      title:           promoForm.title           || '',
      description:     promoForm.description     || '',
      discountPercent: Number(promoForm.discountPercent) || 0,
      expires:         promoForm.expires         || '',
    }
    try {
      if (editPromoId) {
        await apiFetch(`/api/admin/promos/${editPromoId}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await apiFetch('/api/admin/promos', { method: 'POST', body: JSON.stringify(payload) })
      }
      setPromoModal(false)
      notify(editPromoId ? 'Promo diperbarui' : 'Promo ditambahkan')
      fetchAll()
    } catch (err) {
      notify(err.message || 'Gagal menyimpan promo', 'error')
    }
  }
  const deletePromo = async (id) => {
    if (!confirm('Hapus promo ini?')) return
    try {
      await apiFetch(`/api/admin/promos/${id}`, { method: 'DELETE' })
      notify('Promo dihapus')
      fetchAll()
    } catch (err) {
      notify(err.message || 'Gagal menghapus promo', 'error')
    }
  }

  // ── CRUD Categories ────────────────────────────────────────────────────────

  const openAddCat = () => { setEditCatId(null); setCatForm(INIT_CATEGORY); setCatModal(true) }
  const openEditCat = (c) => {
    setEditCatId(c.id)
    setCatForm({
      name:            c.name            || '',
      description:     c.description     || '',
      quota:           c.quota           || 0,
      priceAdjustment: c.priceAdjustment || 0,
    })
    setCatModal(true)
  }
  const submitCat = async (e) => {
    e.preventDefault()
    const payload = {
      name:            catForm.name            || '',
      description:     catForm.description     || '',
      quota:           Number(catForm.quota)           || 0,
      priceAdjustment: Number(catForm.priceAdjustment) || 0,
    }
    try {
      if (editCatId) {
        await apiFetch(`/api/admin/categories/${editCatId}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await apiFetch('/api/admin/categories', { method: 'POST', body: JSON.stringify(payload) })
      }
      setCatModal(false)
      notify(editCatId ? 'Kategori diperbarui' : 'Kategori ditambahkan')
      fetchAll()
    } catch (err) {
      notify(err.message || 'Gagal menyimpan kategori', 'error')
    }
  }
  const deleteCat = async (id) => {
    if (!confirm('Hapus kategori ini?')) return
    try {
      await apiFetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      notify('Kategori dihapus')
      fetchAll()
    } catch (err) {
      notify(err.message || 'Gagal menghapus kategori', 'error')
    }
  }

  // ── CRUD Artists ───────────────────────────────────────────────────────────

  const openAddArtist = () => { setEditArtistId(null); setArtistForm(INIT_ARTIST); setArtistModal(true) }
  const openEditArtist = (a) => {
    setEditArtistId(a.id)
    setArtistForm({
      name:   a.name   || '',
      genre:  a.genre  || '',
      status: a.status || 'active',
    })
    setArtistModal(true)
  }
  const submitArtist = async (e) => {
    e.preventDefault()
    const payload = {
      name:   artistForm.name   || '',
      genre:  artistForm.genre  || '',
      status: artistForm.status || 'active',
    }
    try {
      if (editArtistId) {
        await apiFetch(`/api/admin/artists/${editArtistId}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await apiFetch('/api/admin/artists', { method: 'POST', body: JSON.stringify(payload) })
      }
      setArtistModal(false)
      notify(editArtistId ? 'Artis diperbarui' : 'Artis ditambahkan')
      fetchAll()
    } catch (err) {
      notify(err.message || 'Gagal menyimpan artis', 'error')
    }
  }
  const deleteArtist = async (id) => {
    if (!confirm('Hapus artis ini?')) return
    try {
      await apiFetch(`/api/admin/artists/${id}`, { method: 'DELETE' })
      notify('Artis dihapus')
      fetchAll()
    } catch (err) {
      notify(err.message || 'Gagal menghapus artis', 'error')
    }
  }

  // ── Orders ─────────────────────────────────────────────────────────────────

  const updateOrderStatus = async (id, status) => {
    try {
      const prev = orders.find(o => String(o.id) === String(id))
      const res = await apiFetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH', body: JSON.stringify({ status }),
      })
      setOrders(cur => cur.map(o =>
        String(o.id) === String(res.order?.id || id) ? { ...o, status } : o
      ))
      // update total revenue lokal: kurangi jika cancelled, tambah jika dari cancelled ke paid/verified
      setAnalytics(cur => {
        const total = Number(prev?.total || 0)
        let rev = Number(cur.totalRevenue || 0)
        const wasPaid = ['paid', 'verified'].includes(prev?.status)
        const nowPaid = ['paid', 'verified'].includes(status)
        const nowCancelled = status === 'cancelled'
        if (wasPaid && nowCancelled) rev = Math.max(0, rev - total)
        if (!wasPaid && nowPaid) rev = rev + total
        return { ...cur, totalRevenue: rev }
      })
      notify('Status pesanan diperbarui')
    } catch (err) {
      notify(err.message || 'Gagal mengubah status', 'error')
    }
  }

  const deleteOrder = async (id) => {
    if (!confirm('Hapus pesanan ini? Tindakan tidak bisa dibatalkan.')) return
    try {
      await apiFetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
      setOrders(cur => cur.filter(o => String(o.id) !== String(id)))
      setAnalytics(cur => ({
        ...cur,
        totalOrders: Math.max(0, (cur.totalOrders || 0) - 1),
      }))
      notify('Pesanan dihapus')
    } catch (err) {
      notify(err.message || 'Gagal menghapus pesanan', 'error')
    }
  }

  // ── Sales ──────────────────────────────────────────────────────────────────

  const toggleSales = async () => {
    const newVal = !sales.isSalesOpen
    try {
      const res = await apiFetch('/api/admin/sales', {
        method: 'POST', body: JSON.stringify({ isSalesOpen: newVal }),
      })
      setSales(res.sales || { isSalesOpen: newVal })
      notify(`Penjualan ${newVal ? 'dibuka' : 'ditutup'}`)
    } catch (err) {
      notify(err.message || 'Gagal mengubah status penjualan', 'error')
    }
  }

  // ── Filtered lists ─────────────────────────────────────────────────────────

  const q = search.toLowerCase()
  const fEvents  = events.filter(e => [e.title, e.location, e.category].join(' ').toLowerCase().includes(q))
  const fPromos  = promos.filter(p => [p.code, p.title, p.description].join(' ').toLowerCase().includes(q))
  const fCats    = categories.filter(c => [c.name, c.description].join(' ').toLowerCase().includes(q))
  const fArtists = artists.filter(a => [a.name, a.genre, a.status].join(' ').toLowerCase().includes(q))
  const fOrders  = orders.filter(o => [o.eventTitle, o.paymentMethod, o.status].join(' ').toLowerCase().includes(q))

  const SW = sidebarOpen ? 240 : 64

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#0a0a0f', color: '#f9fafb',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ──────────── SIDEBAR ──────────── */}
      <aside style={{
        width: SW, minHeight: '100vh', flexShrink: 0,
        background: 'rgba(11,17,32,0.97)', borderRight: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)', position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.22s ease', overflow: 'hidden',
      }}>

        {/* Logo row */}
        <div style={{
          padding: '18px 14px', display: 'flex', alignItems: 'center',
          gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🎵</div>
          {sidebarOpen && (
            <span style={{ fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap' }}>
              <span style={{
                background: 'linear-gradient(135deg,#a78bfa,#ec4899)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Konser</span>
              <span style={{ color: '#fff' }}>Ojol</span>
            </span>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            marginLeft: 'auto', border: 'none', background: 'rgba(255,255,255,0.06)',
            color: '#9ca3af', cursor: 'pointer', borderRadius: 7, width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, flexShrink: 0,
          }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav tabs */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: 'flex', alignItems: 'center',
                gap: 10, padding: sidebarOpen ? '10px 12px' : '10px',
                borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: active ? 'rgba(124,58,237,0.18)' : 'transparent',
                color: active ? '#a78bfa' : '#9ca3af',
                borderLeft: active ? '3px solid #7c3aed' : '3px solid transparent',
                transition: 'all 0.15s', width: '100%',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{tab.icon}</span>
                {sidebarOpen && (
                  <span style={{ fontWeight: active ? 600 : 400, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {tab.label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User & logout */}
      </aside>

      {/* ──────────── MAIN CONTENT ──────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Sticky header */}
        <header style={{
          padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 10, flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ margin: 0, color: '#7c3aed', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Admin Panel
            </p>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3 }}>
              {TABS.find(t => t.id === activeTab)?.icon}{' '}
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Cari..."
              style={{ ...S.input, width: 200, padding: '8px 14px' }}
            />
            {/* Avatar + dropdown profil */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setProfileOpen(o => !o)}
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, cursor: 'pointer',
                  boxShadow: profileOpen ? '0 0 0 2px #7c3aed' : 'none',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {(user.name || user.email || 'A')[0].toUpperCase()}
              </div>

              {profileOpen && (
                <>
                  {/* overlay tutup dropdown */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                    onClick={() => setProfileOpen(false)}
                  />
                  <div style={{
                    position: 'absolute', top: 44, right: 0, zIndex: 50,
                    width: 240, borderRadius: 14,
                    background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                  }}>
                    {/* Info user */}
                    <div style={{
                      padding: '16px 16px 12px',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                          background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 700, color: '#fff',
                        }}>
                          {(user.name || user.email || 'A')[0].toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#f9fafb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.name || 'Admin'}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.email || '—'}
                          </p>
                        </div>
                      </div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '3px 10px', borderRadius: 99,
                        background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
                        <span style={{ color: '#a78bfa', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Admin
                        </span>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: '8px' }}>
                      <button
                        onClick={() => { setActiveTab('overview'); setProfileOpen(false) }}
                        style={{
                          width: '100%', textAlign: 'left', border: 'none', borderRadius: 8,
                          padding: '9px 12px', background: 'transparent', color: '#d1d5db',
                          cursor: 'pointer', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        📊 Overview
                      </button>
                      <button
                        onClick={() => { setActiveTab('sales'); setProfileOpen(false) }}
                        style={{
                          width: '100%', textAlign: 'left', border: 'none', borderRadius: 8,
                          padding: '9px 12px', background: 'transparent', color: '#d1d5db',
                          cursor: 'pointer', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        💰 Penjualan
                      </button>
                    </div>

                    <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <button
                        onClick={() => { handleLogout(); setProfileOpen(false) }}
                        style={{
                          width: '100%', textAlign: 'left', border: 'none', borderRadius: 8,
                          padding: '9px 12px', background: 'transparent', color: '#f87171',
                          cursor: 'pointer', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: 8,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Toast notification */}
        <Toast message={toast.message} type={toast.type} />

        {/* Page body */}
        <div style={{ padding: '24px 28px', flex: 1 }}>

          {/* ──────── OVERVIEW ──────── */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: 22 }}>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14 }}>
                {[
                  { label: 'Total Pesanan',    value: analytics.totalOrders   || 0,  icon: '📦', color: '#7c3aed' },
                  { label: 'Sudah Dibayar',    value: analytics.paidOrders    || 0,  icon: '✅', color: '#10b981' },
                  { label: 'Menunggu',         value: analytics.pendingOrders || 0,  icon: '⏳', color: '#f59e0b' },
                  { label: 'Total Pendapatan', value: `Rp ${Number(analytics.totalRevenue || 0).toLocaleString('id-ID')}`, icon: '💰', color: '#ec4899' },
                  { label: 'Tiket Terjual',   value: analytics.soldTickets   || 0,  icon: '🎫', color: '#06b6d4' },
                  { label: 'Status Penjualan', value: sales.isSalesOpen !== false ? 'Buka' : 'Tutup', icon: '🔔', color: sales.isSalesOpen !== false ? '#10b981' : '#ef4444' },
                ].map(item => (
                  <div key={item.label} style={S.statCard(item.color)}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.78rem', fontWeight: 500 }}>{item.label}</p>
                      <span style={{ fontSize: 20, opacity: 0.6 }}>{item.icon}</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: item.color, wordBreak: 'break-word' }}>{item.value}</h2>
                  </div>
                ))}
              </div>

              {/* Summary tables */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
                <div style={S.section}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 700, color: '#e5e7eb' }}>🎪 Event Terbaru</h3>
                  {events.slice(0, 4).map(ev => (
                    <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{ev.title || '—'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#6b7280' }}>{ev.date || '—'} · {ev.location || '—'}</p>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                        Rp {Number(ev.price || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                  {events.length === 0 && <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Belum ada event.</p>}
                </div>

                <div style={S.section}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 700, color: '#e5e7eb' }}>📦 Pesanan Terbaru</h3>
                  {orders.slice(0, 4).map(o => (
                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{o.eventTitle || o.eventId || '—'}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#6b7280' }}>{o.paymentMethod || '—'}</p>
                      </div>
                      <Badge status={o.status || 'pending'} />
                    </div>
                  ))}
                  {orders.length === 0 && <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Belum ada pesanan.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ──────── EVENTS ──────── */}
          {activeTab === 'events' && (
            <div style={S.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                  Kelola Event <span style={{ color: '#6b7280', fontWeight: 400 }}>({fEvents.length})</span>
                </h3>
                <button onClick={openAddEvent} style={S.btnPrimary('#7c3aed')}>+ Tambah Event</button>
              </div>
              {loading ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>Memuat...</p>
              ) : fEvents.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>Tidak ada event.</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {fEvents.map(ev => (
                    <div key={ev.id} style={S.row}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{ev.title || '—'}</p>
                        <p style={{ margin: '3px 0 0', fontSize: '0.77rem', color: '#6b7280' }}>
                          📅 {ev.date || '—'} &nbsp;·&nbsp; 📍 {ev.location || '—'} &nbsp;·&nbsp;
                          <span style={{ color: '#a78bfa' }}>Rp {Number(ev.price || 0).toLocaleString('id-ID')}</span>
                          &nbsp;·&nbsp; <Badge status={ev.status || 'available'} />
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => openEditEvent(ev)} style={S.btnGhost}>✏️ Edit</button>
                        <button onClick={() => deleteEvent(ev.id)} style={S.btnDanger}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──────── PROMOS ──────── */}
          {activeTab === 'promos' && (
            <div style={S.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                  Kelola Promo <span style={{ color: '#6b7280', fontWeight: 400 }}>({fPromos.length})</span>
                </h3>
                <button onClick={openAddPromo} style={S.btnPrimary('#ec4899')}>+ Tambah Promo</button>
              </div>
              {fPromos.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>Tidak ada promo.</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {fPromos.map(p => (
                    <div key={p.id} style={S.row}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(236,72,153,0.35)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#ec4899' }}>{p.code || '—'}</p>
                          <span style={{ fontSize: '0.8rem', color: '#f9fafb' }}>{p.title || '—'}</span>
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '0.77rem', color: '#6b7280' }}>
                          Diskon {p.discountPercent || 0}% &nbsp;·&nbsp; Berlaku s/d {p.expires || '—'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => openEditPromo(p)} style={S.btnGhost}>✏️ Edit</button>
                        <button onClick={() => deletePromo(p.id)} style={S.btnDanger}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──────── CATEGORIES ──────── */}
          {activeTab === 'categories' && (
            <div style={S.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                  Kelola Kategori Tiket <span style={{ color: '#6b7280', fontWeight: 400 }}>({fCats.length})</span>
                </h3>
                <button onClick={openAddCat} style={S.btnPrimary('#06b6d4')}>+ Tambah Kategori</button>
              </div>
              {fCats.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>Tidak ada kategori.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
                  {fCats.map(c => (
                    <div key={c.id} style={{ ...S.card, border: '1px solid rgba(6,182,212,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#06b6d4' }}>{c.name || '—'}</h4>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEditCat(c)} style={S.btnGhost}>✏️</button>
                          <button onClick={() => deleteCat(c.id)} style={S.btnDanger}>🗑️</button>
                        </div>
                      </div>
                      <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: '#9ca3af' }}>{c.description || '—'}</p>
                      <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: '#6b7280' }}>
                        <span>Kuota: <b style={{ color: '#f9fafb' }}>{c.quota || 0}</b></span>
                        <span>Adj: <b style={{ color: '#a78bfa' }}>+Rp {Number(c.priceAdjustment || 0).toLocaleString('id-ID')}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──────── ARTISTS ──────── */}
          {activeTab === 'artists' && (
            <div style={S.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                  Kelola Artis <span style={{ color: '#6b7280', fontWeight: 400 }}>({fArtists.length})</span>
                </h3>
                <button onClick={openAddArtist} style={S.btnPrimary('#f59e0b')}>+ Tambah Artis</button>
              </div>
              {fArtists.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>Tidak ada artis.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
                  {fArtists.map(a => (
                    <div key={a.id} style={{ ...S.card, border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
                        background: 'linear-gradient(135deg,#f59e0b,#ec4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                      }}>🎤</div>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '0.95rem' }}>{a.name || '—'}</p>
                      <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#9ca3af' }}>{a.genre || '—'}</p>
                      <Badge status={a.status || 'active'} />
                      <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
                        <button onClick={() => openEditArtist(a)} style={S.btnGhost}>✏️ Edit</button>
                        <button onClick={() => deleteArtist(a.id)} style={S.btnDanger}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──────── ORDERS ──────── */}
          {activeTab === 'orders' && (
            <div style={S.section}>
              <h3 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700 }}>
                Daftar Pesanan <span style={{ color: '#6b7280', fontWeight: 400 }}>({fOrders.length})</span>
              </h3>
              {fOrders.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>Tidak ada pesanan.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {['ID', 'Event', 'Metode', 'Qty', 'Total', 'Status', 'Aksi'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#6b7280', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fOrders.map(o => (
                        <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 12px', color: '#6b7280', fontFamily: 'monospace', fontSize: '0.78rem' }}>#{String(o.id).slice(-6)}</td>
                          <td style={{ padding: '12px 12px', fontWeight: 500 }}>{o.eventTitle || o.eventId || '—'}</td>
                          <td style={{ padding: '12px 12px', color: '#9ca3af' }}>{o.paymentMethod || '—'}</td>
                          <td style={{ padding: '12px 12px', color: '#9ca3af' }}>{o.quantity || 1}</td>
                          <td style={{ padding: '12px 12px', color: '#a78bfa', fontWeight: 600 }}>Rp {Number(o.total || 0).toLocaleString('id-ID')}</td>
                          <td style={{ padding: '12px 12px' }}><Badge status={o.status || 'pending'} /></td>
                          <td style={{ padding: '12px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <select
                                value={o.status || 'pending'}
                                onChange={e => updateOrderStatus(o.id, e.target.value)}
                                style={{ ...S.select, width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="verified">Verified</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => deleteOrder(o.id)}
                                title="Hapus pesanan"
                                style={{
                                  border: 'none', borderRadius: 8,
                                  padding: '6px 10px', cursor: 'pointer',
                                  background: 'rgba(239,68,68,0.15)',
                                  color: '#f87171', fontSize: '0.82rem',
                                  fontWeight: 600, flexShrink: 0,
                                  transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                              >🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ──────── SALES ──────── */}
          {activeTab === 'sales' && (
            <div style={{ display: 'grid', gap: 20 }}>
              {/* Toggle card */}
              <div style={{ ...S.section, maxWidth: 480 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700 }}>Status Penjualan Tiket</h3>
                <p style={{ margin: '0 0 20px', fontSize: '0.85rem', color: '#9ca3af' }}>
                  Kontrol apakah pembelian tiket sedang dibuka atau ditutup untuk publik.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{
                    width: 64, height: 32, borderRadius: 999, cursor: 'pointer',
                    background: sales.isSalesOpen !== false ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.3s', position: 'relative', flexShrink: 0,
                  }} onClick={toggleSales}>
                    <div style={{
                      position: 'absolute', top: 4, width: 24, height: 24, borderRadius: '50%',
                      background: '#fff', transition: 'left 0.3s',
                      left: sales.isSalesOpen !== false ? 36 : 4,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: sales.isSalesOpen !== false ? '#10b981' : '#f87171' }}>
                      {sales.isSalesOpen !== false ? '🟢 Penjualan TERBUKA' : '🔴 Penjualan TUTUP'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                      {sales.isSalesOpen !== false ? 'Pelanggan dapat membeli tiket saat ini.' : 'Pembelian tiket sedang tidak tersedia.'}
                    </p>
                  </div>
                </div>
                <button onClick={toggleSales} style={{
                  ...S.btnPrimary(sales.isSalesOpen !== false ? '#ef4444' : '#10b981'),
                  marginTop: 16, width: '100%', justifyContent: 'center', padding: '12px',
                }}>
                  {sales.isSalesOpen !== false ? '🔴 Tutup Penjualan' : '🟢 Buka Penjualan'}
                </button>
              </div>

              {/* Analytics summary */}
              <div style={S.section}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>📊 Ringkasan Analytics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
                  {[
                    { label: 'Total Pesanan',    value: analytics.totalOrders   || 0,  color: '#7c3aed' },
                    { label: 'Pesanan Dibayar',  value: analytics.paidOrders    || 0,  color: '#10b981' },
                    { label: 'Menunggu Bayar',   value: analytics.pendingOrders || 0,  color: '#f59e0b' },
                    { label: 'Total Pendapatan', value: `Rp ${Number(analytics.totalRevenue || 0).toLocaleString('id-ID')}`, color: '#ec4899' },
                    { label: 'Tiket Terjual',   value: analytics.soldTickets   || 0,  color: '#06b6d4' },
                  ].map(item => (
                    <div key={item.label} style={{ ...S.card, border: `1px solid ${item.color}22` }}>
                      <p style={{ margin: '0 0 6px', color: '#9ca3af', fontSize: '0.78rem' }}>{item.label}</p>
                      <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: item.color }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ──────── MODALS ──────── */}

      {/* Event Modal */}
      {eventModal && (
        <Modal
          title={editEventId ? 'Edit Event' : 'Tambah Event'}
          onClose={() => setEventModal(false)}
          onSubmit={submitEvent}
          submitLabel={editEventId ? 'Simpan Perubahan' : 'Tambah Event'}
          submitColor="#7c3aed"
        >
          <Field label="Judul Event">
            <input required style={S.input} value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} placeholder="Nama event" />
          </Field>
          <Field label="Deskripsi">
            <textarea style={S.textarea} value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi event" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Tanggal (yyyy-MM-dd)">
              <input required style={S.input} type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} />
            </Field>
            <Field label="Harga (Rp)">
              <input required style={S.input} type="number" min="0" value={eventForm.price} onChange={e => setEventForm(f => ({ ...f, price: e.target.value }))} placeholder="250000" />
            </Field>
          </div>
          <Field label="Lokasi">
            <input required style={S.input} value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} placeholder="Jakarta, Bandung, ..." />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Kategori">
              <input style={S.input} value={eventForm.category} onChange={e => setEventForm(f => ({ ...f, category: e.target.value }))} placeholder="Pop, Rock, ..." />
            </Field>
            <Field label="Penyelenggara">
              <input style={S.input} value={eventForm.organizer} onChange={e => setEventForm(f => ({ ...f, organizer: e.target.value }))} placeholder="PT Events" />
            </Field>
          </div>
          <Field label="Status">
            <select style={S.select} value={eventForm.status} onChange={e => setEventForm(f => ({ ...f, status: e.target.value }))}>
              <option value="available">Available</option>
              <option value="soldout">Sold Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
        </Modal>
      )}

      {/* Promo Modal */}
      {promoModal && (
        <Modal
          title={editPromoId ? 'Edit Promo' : 'Tambah Promo'}
          onClose={() => setPromoModal(false)}
          onSubmit={submitPromo}
          submitLabel={editPromoId ? 'Simpan Perubahan' : 'Tambah Promo'}
          submitColor="#ec4899"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Kode Promo">
              <input required style={S.input} value={promoForm.code} onChange={e => setPromoForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="EARLYBIRD30" />
            </Field>
            <Field label="Diskon (%)">
              <input required style={S.input} type="number" min="0" max="100" value={promoForm.discountPercent} onChange={e => setPromoForm(f => ({ ...f, discountPercent: e.target.value }))} placeholder="30" />
            </Field>
          </div>
          <Field label="Judul">
            <input required style={S.input} value={promoForm.title} onChange={e => setPromoForm(f => ({ ...f, title: e.target.value }))} placeholder="Nama promo" />
          </Field>
          <Field label="Deskripsi">
            <textarea style={S.textarea} value={promoForm.description} onChange={e => setPromoForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi promo" />
          </Field>
          <Field label="Berlaku Sampai">
            <input required style={S.input} type="date" value={promoForm.expires} onChange={e => setPromoForm(f => ({ ...f, expires: e.target.value }))} />
          </Field>
        </Modal>
      )}

      {/* Category Modal */}
      {catModal && (
        <Modal
          title={editCatId ? 'Edit Kategori' : 'Tambah Kategori'}
          onClose={() => setCatModal(false)}
          onSubmit={submitCat}
          submitLabel={editCatId ? 'Simpan Perubahan' : 'Tambah Kategori'}
          submitColor="#06b6d4"
        >
          <Field label="Nama Kategori">
            <input required style={S.input} value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} placeholder="VIP, Regular, ..." />
          </Field>
          <Field label="Deskripsi">
            <textarea style={S.textarea} value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi kategori" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Kuota">
              <input required style={S.input} type="number" min="0" value={catForm.quota} onChange={e => setCatForm(f => ({ ...f, quota: e.target.value }))} placeholder="100" />
            </Field>
            <Field label="Penyesuaian Harga (Rp)">
              <input style={S.input} type="number" value={catForm.priceAdjustment} onChange={e => setCatForm(f => ({ ...f, priceAdjustment: e.target.value }))} placeholder="0" />
            </Field>
          </div>
        </Modal>
      )}

      {/* Artist Modal */}
      {artistModal && (
        <Modal
          title={editArtistId ? 'Edit Artis' : 'Tambah Artis'}
          onClose={() => setArtistModal(false)}
          onSubmit={submitArtist}
          submitLabel={editArtistId ? 'Simpan Perubahan' : 'Tambah Artis'}
          submitColor="#f59e0b"
        >
          <Field label="Nama Artis">
            <input required style={S.input} value={artistForm.name} onChange={e => setArtistForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama artis" />
          </Field>
          <Field label="Genre">
            <input required style={S.input} value={artistForm.genre} onChange={e => setArtistForm(f => ({ ...f, genre: e.target.value }))} placeholder="Pop, Rock, Jazz, ..." />
          </Field>
          <Field label="Status">
            <select style={S.select} value={artistForm.status} onChange={e => setArtistForm(f => ({ ...f, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </Modal>
      )}

    </div>
  )
}
