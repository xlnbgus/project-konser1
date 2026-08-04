const fs = require('fs');
const path = require('path');

const storageDir = path.join(__dirname, '..', 'data');
const storageFile = path.join(storageDir, 'store.json');

function getStorageFilePath() {
  if (process.env.NODE_ENV === 'test') {
    return path.join(storageDir, 'store.test.json');
  }

  return storageFile;
}

function buildSeed() {
  return {
    users: [
      {
        id: 'admin-1',
        name: 'Admin KonserOjol',
        email: 'admin@konserojol.com',
        phone: '081000000000',
        password: '$2b$10$C1AtUepxGJYBdbF2OGVX5uJkXDwYeype2dXMjtwaFzhfvdJzM6Ela',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z'
      }
    ],
    events: [
      {
        id: 1,
        title: 'Weekend Festival',
        description: 'Festival musik malam minggu yang penuh hiburan.',
        date: '2026-09-12',
        location: 'Jakarta',
        price: 250000,
        category: 'Festival',
        organizer: 'KonserKu',
        status: 'available'
      },
      {
        id: 2,
        title: 'Indie Night',
        description: 'Konser indie akustik dan live performance.',
        date: '2026-09-25',
        location: 'Bandung',
        price: 180000,
        category: 'Konser',
        organizer: 'SoundWave',
        status: 'available'
      },
      {
        id: 3,
        title: 'SNOOPY RUN 2026',
        description: 'Lomba lari santai dengan suasana keluarga.',
        date: '2026-09-06',
        location: 'Tangerang',
        price: 499000,
        category: 'Sports',
        organizer: 'Provaliant',
        status: 'available'
      }
    ],
    promos: [
      {
        id: 1,
        code: 'EARLYBIRD30',
        title: 'Early Bird',
        description: 'Diskon 30% untuk pemesanan awal',
        discountPercent: 30,
        expires: '31 Agustus 2026'
      },
      {
        id: 2,
        code: 'NEWUSER2026',
        title: 'Pengguna Baru',
        description: 'Bebas biaya admin untuk pengguna baru',
        discountPercent: 0,
        expires: 'Tidak terbatas'
      }
    ],
    orders: [],
    ticketCategories: [
      {
        id: 1,
        name: 'VIP',
        description: 'Area depan panggung dengan fasilitas premium',
        quota: 100,
        priceAdjustment: 0
      },
      {
        id: 2,
        name: 'Regular',
        description: 'Area tribun utama',
        quota: 300,
        priceAdjustment: 0
      }
    ],
    artists: [
      {
        id: 1,
        name: 'Ari Lasso',
        genre: 'Pop',
        status: 'active'
      },
      {
        id: 2,
        name: 'RAN',
        genre: 'Rock',
        status: 'active'
      }
    ],
    salesSettings: {
      isSalesOpen: true,
      updatedAt: '2026-01-01T00:00:00.000Z'
    }
  };
}

function ensureStorageFile() {
  const targetFile = getStorageFilePath();

  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  if (!fs.existsSync(targetFile)) {
    fs.writeFileSync(targetFile, JSON.stringify(buildSeed(), null, 2));
  }
}

function readStore() {
  ensureStorageFile();

  const content = fs.readFileSync(getStorageFilePath(), 'utf8');
  try {
    const parsed = JSON.parse(content);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      promos: Array.isArray(parsed.promos) ? parsed.promos : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      ticketCategories: Array.isArray(parsed.ticketCategories) ? parsed.ticketCategories : [],
      artists: Array.isArray(parsed.artists) ? parsed.artists : [],
      salesSettings: parsed.salesSettings && typeof parsed.salesSettings === 'object' ? parsed.salesSettings : { isSalesOpen: true }
    };
  } catch (error) {
    return buildSeed();
  }
}

function writeStore(store) {
  ensureStorageFile();
  fs.writeFileSync(getStorageFilePath(), JSON.stringify(store, null, 2));
}

function getEvents() {
  return readStore().events;
}

function getEventById(eventId) {
  return getEvents().find((event) => event.id === Number(eventId));
}

function getPromos() {
  return readStore().promos;
}

function getTicketCategories() {
  return readStore().ticketCategories;
}

function createTicketCategory(category) {
  const store = readStore();
  const newCategory = {
    id: Date.now(),
    ...category
  };

  store.ticketCategories.push(newCategory);
  writeStore(store);
  return newCategory;
}

function updateTicketCategory(categoryId, updates) {
  const store = readStore();
  const categoryIndex = store.ticketCategories.findIndex((category) => category.id === Number(categoryId));

  if (categoryIndex === -1) {
    return null;
  }

  store.ticketCategories[categoryIndex] = {
    ...store.ticketCategories[categoryIndex],
    ...updates,
    id: Number(categoryId)
  };

  writeStore(store);
  return store.ticketCategories[categoryIndex];
}

function deleteTicketCategory(categoryId) {
  const store = readStore();
  const filtered = store.ticketCategories.filter((category) => category.id !== Number(categoryId));
  store.ticketCategories = filtered;
  writeStore(store);
  return filtered;
}

function getArtists() {
  return readStore().artists;
}

function createArtist(artist) {
  const store = readStore();
  const newArtist = {
    id: Date.now(),
    ...artist
  };

  store.artists.push(newArtist);
  writeStore(store);
  return newArtist;
}

function updateArtist(artistId, updates) {
  const store = readStore();
  const artistIndex = store.artists.findIndex((artist) => artist.id === Number(artistId));

  if (artistIndex === -1) {
    return null;
  }

  store.artists[artistIndex] = {
    ...store.artists[artistIndex],
    ...updates,
    id: Number(artistId)
  };

  writeStore(store);
  return store.artists[artistIndex];
}

function deleteArtist(artistId) {
  const store = readStore();
  const filtered = store.artists.filter((artist) => artist.id !== Number(artistId));
  store.artists = filtered;
  writeStore(store);
  return filtered;
}

function getSalesSettings() {
  return readStore().salesSettings || { isSalesOpen: true };
}

function updateSalesSettings(updates) {
  const store = readStore();
  const nextSettings = {
    ...getSalesSettings(),
    ...updates,
    updatedAt: new Date().toISOString()
  };

  store.salesSettings = nextSettings;
  writeStore(store);
  return nextSettings;
}

function getUserByEmail(email) {
  return readStore().users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

function getUserById(userId) {
  return readStore().users.find((user) => user.id === String(userId));
}

function createUser(user) {
  const store = readStore();
  store.users.push(user);
  writeStore(store);
  return user;
}

function createOrder(order) {
  const store = readStore();
  store.orders.push(order);
  writeStore(store);
  return order;
}

function updateOrderStatus(orderId, status) {
  const store = readStore();
  const orderIndex = store.orders.findIndex((order) => String(order.id) === String(orderId));

  if (orderIndex === -1) {
    return null;
  }

  store.orders[orderIndex].status = status;
  store.orders[orderIndex].updatedAt = new Date().toISOString();
  writeStore(store);
  return store.orders[orderIndex];
}

module.exports = {
  buildSeed,
  ensureStorageFile,
  readStore,
  writeStore,
  getEvents,
  getEventById,
  getPromos,
  getTicketCategories,
  createTicketCategory,
  updateTicketCategory,
  deleteTicketCategory,
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  getSalesSettings,
  updateSalesSettings,
  getUserByEmail,
  getUserById,
  createUser,
  createOrder,
  updateOrderStatus,
};
