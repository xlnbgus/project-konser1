const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { testConnection, isDbConfigured, query } = require("./db");
const storage = require("./storage");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const paymentMethods = [
    { value: "debit", label: "Kartu Debit", description: "Bayar dengan kartu debit" },
    { value: "bank", label: "Transfer Bank", description: "Transfer melalui bank lokal" },
    { value: "e-wallet", label: "E-Wallet", description: "Dana, Ovo, GoPay, dan lainnya" },
    { value: "qris", label: "QRIS", description: "Scan QRIS dengan aplikasi dompet digital" }
];
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));

const sendError = (res, status, message) => {
    res.status(status).json({ success: false, message });
};

const runQuery = async (sql, params = []) => {
    if (!isDbConfigured()) {
        throw new Error("Database belum dikonfigurasi");
    }

    return query(sql, params);
};

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
        return sendError(res, 401, "Token tidak tersedia");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return sendError(res, 401, "Token tidak valid");
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return sendError(res, 403, 'Akses admin diperlukan');
    }

    next();
};

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Concert Ticket API berjalan 🚀"
    });
});

app.get("/health", async (req, res) => {
    try {
        const dbStatus = await testConnection();
        res.json({
            success: true,
            message: "Backend sehat",
            timestamp: new Date().toISOString(),
            database: dbStatus
        });
    } catch (error) {
        res.json({
            success: true,
            message: "Backend sehat",
            timestamp: new Date().toISOString(),
            database: { ok: false, message: error.message }
        });
    }
});

app.post("/api/auth/register", async (req, res) => {
    return sendError(res, 403, "Registrasi ditutup. Hanya admin yang dapat login.");
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return sendError(res, 400, "Email dan password wajib diisi");
        }

        let user = null;

        if (isDbConfigured()) {
            try {
                const [rows] = await runQuery("SELECT id, name, email, phone, password_hash, role FROM users WHERE LOWER(email) = LOWER(?)", [email]);
                user = rows[0];

                if (user) {
                    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
                    if (!isPasswordValid) {
                        return sendError(res, 401, "Email atau password salah");
                    }

                    if (String(user.role).toLowerCase() !== 'admin') {
                        return sendError(res, 403, 'Akses admin diperlukan');
                    }

                    const token = jwt.sign({ id: user.id, email: user.email, role: 'admin' }, JWT_SECRET, { expiresIn: "1h" });

                    return res.json({
                        success: true,
                        message: "Login berhasil",
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            role: 'admin'
                        }
                    });
                }
            } catch (dbError) {
                console.warn("Database auth lookup failed, falling back to local storage:", dbError.message);
            }
        }

        user = storage.getUserByEmail(email);
        if (!user) {
            return sendError(res, 401, "Email atau password salah");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, 401, "Email atau password salah");
        }

        if (String(user.role).toLowerCase() !== 'admin') {
            return sendError(res, 403, 'Akses admin diperlukan');
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: 'admin' }, JWT_SECRET, { expiresIn: "1h" });

        res.json({
            success: true,
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return sendError(res, 500, "Gagal login");
    }
});

app.get("/api/auth/me", authenticate, async (req, res) => {
    try {
        if (isDbConfigured()) {
            const [rows] = await runQuery("SELECT id, name, email, phone FROM users WHERE id = ?", [req.user.id]);
            const user = rows[0];
            if (!user) {
                return sendError(res, 404, "User tidak ditemukan");
            }

            return res.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            });
        }

        const user = storage.getUserById(req.user.id);
        if (!user) {
            return sendError(res, 404, "User tidak ditemukan");
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Auth me error:", error);
        return sendError(res, 500, "Gagal memuat profil");
    }
});

app.get("/api/events", async (req, res) => {
    try {
        if (isDbConfigured()) {
            const [rows] = await runQuery("SELECT id, title, description, event_date AS date, location, price, category, organizer, status FROM events ORDER BY event_date ASC");
            return res.json({ success: true, events: rows });
        }

        res.json({ success: true, events: storage.getEvents() });
    } catch (error) {
        console.error("Events error:", error);
        return sendError(res, 500, "Gagal mengambil event");
    }
});

app.get("/api/promos", async (req, res) => {
    try {
        if (isDbConfigured()) {
            const [rows] = await runQuery("SELECT id, code, title, description, discount_percent AS discountPercent, expires_at AS expires FROM promos WHERE is_active = 1 ORDER BY id ASC");
            return res.json({ success: true, promos: rows });
        }

        res.json({ success: true, promos: storage.getPromos() });
    } catch (error) {
        console.error("Promos error:", error);
        return sendError(res, 500, "Gagal mengambil promo");
    }
});

app.get("/api/payment-methods", (req, res) => {
    res.json({
        success: true,
        paymentMethods
    });
});

app.get('/api/admin/orders', authenticate, requireAdmin, async (req, res) => {
    try {
        if (isDbConfigured()) {
            const [rows] = await runQuery("SELECT id, user_id AS userId, event_id AS eventId, quantity, promo_code AS promoCode, payment_method AS paymentMethod, subtotal, discount_amount AS discountAmount, total, status, created_at AS createdAt FROM orders ORDER BY created_at DESC");
            return res.json({ success: true, orders: rows });
        }

        const store = storage.readStore();
        res.json({ success: true, orders: store.orders });
    } catch (error) {
        console.error('Admin orders error:', error);
        return sendError(res, 500, 'Gagal mengambil data pesanan');
    }
});

app.patch('/api/admin/orders/:id/status', authenticate, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body || {};
        if (!status) {
            return sendError(res, 400, 'Status wajib diisi');
        }

        if (isDbConfigured()) {
            const [result] = await runQuery("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
            if (result.affectedRows === 0) {
                return sendError(res, 404, 'Pesanan tidak ditemukan');
            }

            const [rows] = await runQuery("SELECT id, user_id AS userId, event_id AS eventId, quantity, promo_code AS promoCode, payment_method AS paymentMethod, subtotal, discount_amount AS discountAmount, total, status, created_at AS createdAt FROM orders WHERE id = ?", [req.params.id]);
            return res.json({ success: true, order: rows[0] });
        }

        const updatedOrder = storage.updateOrderStatus(req.params.id, status);
        if (!updatedOrder) {
            return sendError(res, 404, 'Pesanan tidak ditemukan');
        }

        return res.json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('Update order status error:', error);
        return sendError(res, 500, 'Gagal mengubah status pesanan');
    }
});

app.get('/api/admin/categories', authenticate, requireAdmin, async (req, res) => {
    try {
        res.json({ success: true, categories: storage.getTicketCategories() });
    } catch (error) {
        console.error('Admin categories error:', error);
        return sendError(res, 500, 'Gagal mengambil data kategori tiket');
    }
});

app.post('/api/admin/categories', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, description, quota, priceAdjustment } = req.body || {};
        if (!name) {
            return sendError(res, 400, 'Nama kategori wajib diisi');
        }

        const newCategory = storage.createTicketCategory({
            name,
            description: description || '',
            quota: Number(quota || 0),
            priceAdjustment: Number(priceAdjustment || 0)
        });

        res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
        console.error('Create category error:', error);
        return sendError(res, 500, 'Gagal membuat kategori');
    }
});

app.put('/api/admin/categories/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const updatedCategory = storage.updateTicketCategory(req.params.id, {
            ...req.body,
            quota: Number(req.body?.quota || 0),
            priceAdjustment: Number(req.body?.priceAdjustment || 0)
        });

        if (!updatedCategory) {
            return sendError(res, 404, 'Kategori tidak ditemukan');
        }

        res.json({ success: true, category: updatedCategory });
    } catch (error) {
        console.error('Update category error:', error);
        return sendError(res, 500, 'Gagal mengupdate kategori');
    }
});

app.delete('/api/admin/categories/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        storage.deleteTicketCategory(req.params.id);
        res.json({ success: true, message: 'Kategori berhasil dihapus' });
    } catch (error) {
        console.error('Delete category error:', error);
        return sendError(res, 500, 'Gagal menghapus kategori');
    }
});

app.get('/api/admin/artists', authenticate, requireAdmin, async (req, res) => {
    try {
        res.json({ success: true, artists: storage.getArtists() });
    } catch (error) {
        console.error('Admin artists error:', error);
        return sendError(res, 500, 'Gagal mengambil data artis');
    }
});

app.post('/api/admin/artists', authenticate, requireAdmin, async (req, res) => {
    try {
        const { name, genre, status = 'active' } = req.body || {};
        if (!name) {
            return sendError(res, 400, 'Nama artis wajib diisi');
        }

        const newArtist = storage.createArtist({ name, genre: genre || '', status });
        res.status(201).json({ success: true, artist: newArtist });
    } catch (error) {
        console.error('Create artist error:', error);
        return sendError(res, 500, 'Gagal menambah artis');
    }
});

app.put('/api/admin/artists/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const updatedArtist = storage.updateArtist(req.params.id, req.body || {});
        if (!updatedArtist) {
            return sendError(res, 404, 'Artis tidak ditemukan');
        }

        res.json({ success: true, artist: updatedArtist });
    } catch (error) {
        console.error('Update artist error:', error);
        return sendError(res, 500, 'Gagal mengupdate artis');
    }
});

app.delete('/api/admin/artists/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        storage.deleteArtist(req.params.id);
        res.json({ success: true, message: 'Artis berhasil dihapus' });
    } catch (error) {
        console.error('Delete artist error:', error);
        return sendError(res, 500, 'Gagal menghapus artis');
    }
});

app.get('/api/admin/analytics', authenticate, requireAdmin, async (req, res) => {
    try {
        const store = storage.readStore();
        const orders = store.orders || [];
        const totalOrders = orders.length;
        const paidOrders = orders.filter((order) => ['paid', 'confirmed'].includes(String(order.status || '').toLowerCase())).length;
        const pendingOrders = orders.filter((order) => String(order.status || '').toLowerCase() === 'pending').length;
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
        const soldTickets = orders.reduce((sum, order) => sum + Number(order.quantity || 0), 0);
        const salesSettings = storage.getSalesSettings();

        res.json({
            success: true,
            analytics: {
                totalOrders,
                paidOrders,
                pendingOrders,
                totalRevenue,
                soldTickets,
                salesOpen: salesSettings.isSalesOpen !== false
            }
        });
    } catch (error) {
        console.error('Admin analytics error:', error);
        return sendError(res, 500, 'Gagal mengambil ringkasan penjualan');
    }
});

app.get('/api/admin/sales', authenticate, requireAdmin, async (req, res) => {
    try {
        res.json({ success: true, sales: storage.getSalesSettings() });
    } catch (error) {
        console.error('Admin sales settings error:', error);
        return sendError(res, 500, 'Gagal mengambil status penjualan');
    }
});

app.post('/api/admin/sales', authenticate, requireAdmin, async (req, res) => {
    try {
        const { isSalesOpen } = req.body || {};
        const updatedSettings = storage.updateSalesSettings({ isSalesOpen: typeof isSalesOpen === 'boolean' ? isSalesOpen : true });
        res.json({ success: true, sales: updatedSettings });
    } catch (error) {
        console.error('Update sales settings error:', error);
        return sendError(res, 500, 'Gagal mengubah status penjualan');
    }
});

app.get('/api/admin/events', authenticate, requireAdmin, async (req, res) => {
    try {
        res.json({ success: true, events: storage.getEvents() });
    } catch (error) {
        console.error('Admin events error:', error);
        return sendError(res, 500, 'Gagal mengambil data event');
    }
});

app.post('/api/admin/events', authenticate, requireAdmin, async (req, res) => {
    try {
        const { title, description, date, location, price, category, organizer, status = 'available' } = req.body || {};
        if (!title || !date || !location || !price) {
            return sendError(res, 400, 'Judul, tanggal, lokasi, dan harga wajib diisi');
        }

        const store = storage.readStore();
        const newEvent = {
            id: Date.now(),
            title,
            description: description || '',
            date,
            location,
            price: Number(price),
            category: category || 'Umum',
            organizer: organizer || 'Admin',
            status
        };

        store.events.push(newEvent);
        storage.writeStore(store);

        res.status(201).json({ success: true, event: newEvent });
    } catch (error) {
        console.error('Create event error:', error);
        return sendError(res, 500, 'Gagal membuat event');
    }
});

app.put('/api/admin/events/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const store = storage.readStore();
        const eventIndex = store.events.findIndex((event) => event.id === Number(req.params.id));
        if (eventIndex === -1) {
            return sendError(res, 404, 'Event tidak ditemukan');
        }

        const updatedEvent = {
            ...store.events[eventIndex],
            ...req.body,
            id: Number(req.params.id),
            price: Number(req.body.price || store.events[eventIndex].price)
        };

        store.events[eventIndex] = updatedEvent;
        storage.writeStore(store);

        res.json({ success: true, event: updatedEvent });
    } catch (error) {
        console.error('Update event error:', error);
        return sendError(res, 500, 'Gagal mengupdate event');
    }
});

app.delete('/api/admin/events/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const store = storage.readStore();
        store.events = store.events.filter((event) => event.id !== Number(req.params.id));
        storage.writeStore(store);

        res.json({ success: true, message: 'Event berhasil dihapus' });
    } catch (error) {
        console.error('Delete event error:', error);
        return sendError(res, 500, 'Gagal menghapus event');
    }
});

app.get('/api/admin/promos', authenticate, requireAdmin, async (req, res) => {
    try {
        res.json({ success: true, promos: storage.getPromos() });
    } catch (error) {
        console.error('Admin promos error:', error);
        return sendError(res, 500, 'Gagal mengambil data promo');
    }
});

app.post('/api/admin/promos', authenticate, requireAdmin, async (req, res) => {
    try {
        const { code, title, description, discountPercent, expires } = req.body || {};
        if (!code || !title || !discountPercent) {
            return sendError(res, 400, 'Kode, judul, dan diskon wajib diisi');
        }

        const store = storage.readStore();
        const newPromo = {
            id: Date.now(),
            code,
            title,
            description: description || '',
            discountPercent: Number(discountPercent),
            expires: expires || 'Tidak terbatas'
        };

        store.promos.push(newPromo);
        storage.writeStore(store);

        res.status(201).json({ success: true, promo: newPromo });
    } catch (error) {
        console.error('Create promo error:', error);
        return sendError(res, 500, 'Gagal membuat promo');
    }
});

app.put('/api/admin/promos/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const store = storage.readStore();
        const promoIndex = store.promos.findIndex((promo) => promo.id === Number(req.params.id));
        if (promoIndex === -1) {
            return sendError(res, 404, 'Promo tidak ditemukan');
        }

        const updatedPromo = {
            ...store.promos[promoIndex],
            ...req.body,
            id: Number(req.params.id),
            discountPercent: Number(req.body.discountPercent || store.promos[promoIndex].discountPercent)
        };

        store.promos[promoIndex] = updatedPromo;
        storage.writeStore(store);

        res.json({ success: true, promo: updatedPromo });
    } catch (error) {
        console.error('Update promo error:', error);
        return sendError(res, 500, 'Gagal mengupdate promo');
    }
});

app.delete('/api/admin/promos/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const store = storage.readStore();
        store.promos = store.promos.filter((promo) => promo.id !== Number(req.params.id));
        storage.writeStore(store);

        res.json({ success: true, message: 'Promo berhasil dihapus' });
    } catch (error) {
        console.error('Delete promo error:', error);
        return sendError(res, 500, 'Gagal menghapus promo');
    }
});

app.post("/api/checkout", authenticate, async (req, res) => {
    try {
        const { eventId, quantity = 1, promoCode, paymentMethod = "debit" } = req.body || {};

        if (!eventId) {
            return sendError(res, 400, "eventId wajib diisi");
        }

        let event;
        let selectedPromo = null;

        if (isDbConfigured()) {
            const [eventRows] = await runQuery("SELECT id, title, price FROM events WHERE id = ?", [eventId]);
            event = eventRows[0];

            if (promoCode) {
                const [promoRows] = await runQuery("SELECT code, discount_percent FROM promos WHERE code = ? AND is_active = 1", [promoCode]);
                selectedPromo = promoRows[0];
            }
        } else {
            event = storage.getEventById(eventId);
            if (promoCode) {
                selectedPromo = storage.getPromos().find((item) => item.code === promoCode);
            }
        }

        if (!event) {
            return sendError(res, 404, "Event tidak ditemukan");
        }
        const subtotal = Number(event.price) * Number(quantity);
        let discountAmount = 0;

        if (selectedPromo) {
            discountAmount = subtotal * (Number(selectedPromo.discount_percent || selectedPromo.discountPercent || 0) / 100);
        }

        const total = Math.max(0, subtotal - discountAmount);
        const selectedPaymentMethod = paymentMethods.find((item) => item.value === paymentMethod) || paymentMethods[0];

        let orderId = Date.now().toString();

        if (isDbConfigured()) {
            const [orderResult] = await runQuery(
                "INSERT INTO orders (user_id, event_id, quantity, promo_code, payment_method, subtotal, discount_amount, total, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())",
                [req.user.id, event.id, Number(quantity), selectedPromo ? selectedPromo.code : null, selectedPaymentMethod.value, subtotal, discountAmount, total]
            );
            orderId = orderResult.insertId.toString();
        } else {
            storage.createOrder({
                id: orderId,
                userId: req.user.id,
                eventId: event.id,
                eventTitle: event.title,
                quantity: Number(quantity),
                subtotal,
                discountAmount,
                total,
                promoCode: selectedPromo ? selectedPromo.code : null,
                paymentMethod: selectedPaymentMethod.value,
                paymentLabel: selectedPaymentMethod.label,
                buyerEmail: req.user.email,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
        }

        const order = {
            id: orderId,
            eventId: event.id,
            eventTitle: event.title,
            quantity: Number(quantity),
            subtotal,
            discountAmount,
            total,
            promoCode: selectedPromo ? selectedPromo.code : null,
            paymentMethod: selectedPaymentMethod.value,
            paymentLabel: selectedPaymentMethod.label,
            buyerEmail: req.user.email,
            status: 'pending'
        };

        res.status(201).json({
            success: true,
            message: "Checkout berhasil dibuat",
            order: {
                id: order.id,
                eventId: event.id,
                eventTitle: event.title,
                quantity: Number(quantity),
                subtotal,
                discountAmount,
                total,
                promoCode: selectedPromo ? selectedPromo.code : null,
                paymentMethod: selectedPaymentMethod.value,
                paymentLabel: selectedPaymentMethod.label,
                buyerEmail: req.user.email,
                status: order.status
            }
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return sendError(res, 500, "Gagal membuat checkout");
    }
});

app.use((req, res) => {
    sendError(res, 404, "Route tidak ditemukan");
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    sendError(res, 500, "Terjadi kesalahan server");
});

module.exports = app;