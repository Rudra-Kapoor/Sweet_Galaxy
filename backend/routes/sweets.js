const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
  createSweet,
  getAllSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require('../controllers/sweetController');

// Public routes
router.get('/', getAllSweets);
router.get('/search', getAllSweets);
router.get('/:id', getSweetById);

// Protected routes
router.post('/', auth, isAdmin, createSweet);
router.put('/:id', auth, isAdmin, updateSweet);
router.delete('/:id', auth, isAdmin, deleteSweet);
router.post('/:id/purchase', auth, purchaseSweet);
router.post('/:id/restock', auth, isAdmin, restockSweet);

module.exports = router;