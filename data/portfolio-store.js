const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'portfolios');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');

// Ensure storage directories exist
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(INDEX_FILE)) {
    fs.writeFileSync(INDEX_FILE, JSON.stringify({}, null, 2), 'utf-8');
  }
}

// Generate clean URL slug from name
function slugify(text) {
  if (!text) return 'creator';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .substring(0, 40) || 'creator';
}

// Generate unique short ID
function generateShortId() {
  return crypto.randomBytes(3).toString('hex');
}

// Read index
function readIndex() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

// Save index
function writeIndex(index) {
  ensureStorage();
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

// Publish or update a portfolio
function savePortfolio(portfolioData, existingId = null) {
  ensureStorage();
  const index = readIndex();
  let id = existingId;
  let isUpdate = false;

  if (id && index[id]) {
    // Updating existing portfolio
    isUpdate = true;
  } else {
    // Generate new unique slug ID
    const name = (portfolioData.personal && portfolioData.personal.fullName) || 'creator';
    const baseSlug = slugify(name);
    let candidate = `${baseSlug}-${generateShortId()}`;
    while (index[candidate]) {
      candidate = `${baseSlug}-${generateShortId()}`;
    }
    id = candidate;
  }

  const record = {
    id: id,
    slug: id,
    createdAt: isUpdate && index[id].createdAt ? index[id].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: (portfolioData.personal && portfolioData.personal.fullName) || 'Student',
    title: (portfolioData.personal && portfolioData.personal.title) || portfolioData.category || '',
    data: portfolioData
  };

  // Write individual portfolio file
  const filePath = path.join(DATA_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8');

  // Update index
  index[id] = {
    id: id,
    slug: id,
    name: record.name,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
  writeIndex(index);

  return {
    id: id,
    slug: id,
    isUpdate: isUpdate,
    publicUrl: `/portfolio/${id}`,
    record: record
  };
}

// Get portfolio by ID or slug
function getPortfolio(idOrSlug) {
  ensureStorage();
  if (!idOrSlug) return null;
  const filePath = path.join(DATA_DIR, `${idOrSlug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading portfolio ${idOrSlug}:`, e);
    return null;
  }
}

// Delete / unpublish portfolio
function deletePortfolio(idOrSlug) {
  ensureStorage();
  const index = readIndex();
  const filePath = path.join(DATA_DIR, `${idOrSlug}.json`);
  let deleted = false;

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    deleted = true;
  }

  if (index[idOrSlug]) {
    delete index[idOrSlug];
    writeIndex(index);
    deleted = true;
  }

  return deleted;
}

// Initialize on module load
ensureStorage();

module.exports = {
  savePortfolio,
  getPortfolio,
  deletePortfolio,
  slugify
};
