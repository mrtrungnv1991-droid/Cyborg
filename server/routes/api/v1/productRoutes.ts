import { Router } from 'express';
import { db } from '../../../db/store';
import { requireAuth, requireRole, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { InventoryService } from '../../../services/inventoryService';

export const productRouter = Router();

// GET /api/v1/products - Search & Filtering
productRouter.get('/', (req, res) => {
  const { category, platform, search, sort, limit = 50, offset = 0 } = req.query;

  let results = [...db.products];

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }

  if (platform && platform !== 'all') {
    results = results.filter(p => p.platform.toLowerCase() === String(platform).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.subtitle?.toLowerCase().includes(q) ||
      p.platform.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_low') {
    results.sort((a, b) => a.retailPrice - b.retailPrice);
  } else if (sort === 'price_high') {
    results.sort((a, b) => b.retailPrice - a.retailPrice);
  } else if (sort === 'rating') {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'discount') {
    results.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  }

  const paginated = results.slice(Number(offset), Number(offset) + Number(limit));

  res.json({
    success: true,
    total: results.length,
    products: paginated,
    categories: db.categories
  });
});

// GET /api/v1/products/:id
productRouter.get('/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const reviews = db.reviews.filter(r => r.productId === product.id);
  res.json({
    success: true,
    product: {
      ...product,
      reviews
    }
  });
});

// POST /api/v1/products - Create Product (Admin/Seller)
productRouter.post('/', requireAuth, requireRole('SELLER'), (req: AuthenticatedRequest, res) => {
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    stockAvailable: req.body.stockAvailable || 10,
    rating: 5.0,
    reviewCount: 1,
    activePools: req.body.activePools || []
  };

  db.products.unshift(newProduct);

  res.status(201).json({
    success: true,
    product: newProduct
  });
});

// PUT /api/v1/products/:id/bulk-stock - Bulk Add Keys to Vault
productRouter.put('/:id/bulk-stock', requireAuth, requireRole('ADMIN'), (req: AuthenticatedRequest, res) => {
  const { keys, costPrice } = req.body;
  if (!Array.isArray(keys) || keys.length === 0) {
    return res.status(400).json({ success: false, error: 'Keys array is required' });
  }

  const added = InventoryService.bulkAddKeys(req.params.id, keys, costPrice || 0);

  res.json({
    success: true,
    message: `Đã nhập kho an toàn ${added} key vào Vault`,
    addedCount: added
  });
});
