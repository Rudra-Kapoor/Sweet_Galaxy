const Sweet = require('../models/Sweet');

// Create a new sweet
const createSweet = async (req, res) => {
  try {
    const { name, description, category, price, quantity, image } = req.body;

    // Validate required fields
    if (!name || !description || !category || !price) {
      return res.status(400).json({ 
        error: 'Name, description, category, and price are required' 
      });
    }

    const sweet = new Sweet({
      name,
      description,
      category,
      price: parseFloat(price),
      quantity: quantity ? parseInt(quantity) : 0,
      image: image || 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop'
    });

    await sweet.save();
    res.status(201).json({
      message: 'Sweet created successfully',
      sweet
    });
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ 
      error: 'Failed to create sweet',
      details: error.message 
    });
  }
};

// Get all sweets
const getAllSweets = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    let query = {};

    // Apply filters
    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    res.json(sweets);
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sweets',
      details: error.message 
    });
  }
};

// Get single sweet
const getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.json(sweet);
  } catch (error) {
    console.error('Get sweet error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sweet',
      details: error.message 
    });
  }
};

// Update sweet
const updateSweet = async (req, res) => {
  try {
    const { name, description, category, price, quantity, image } = req.body;

    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        price: price ? parseFloat(price) : undefined,
        quantity: quantity ? parseInt(quantity) : undefined,
        image,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({
      message: 'Sweet updated successfully',
      sweet
    });
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ 
      error: 'Failed to update sweet',
      details: error.message 
    });
  }
};

// Delete sweet
const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.json({ 
      message: 'Sweet deleted successfully',
      sweetId: sweet._id 
    });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ 
      error: 'Failed to delete sweet',
      details: error.message 
    });
  }
};

// Purchase sweet (decrease quantity)
const purchaseSweet = async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ 
        error: `Insufficient quantity. Only ${sweet.quantity} available` 
      });
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.json({
      message: `Purchased ${quantity} ${sweet.name}(s)`,
      sweet
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ 
      error: 'Failed to purchase sweet',
      details: error.message 
    });
  }
};

// Restock sweet (increase quantity)
const restockSweet = async (req, res) => {
  try {
    const { quantity = 10 } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.json({
      message: `Restocked ${quantity} ${sweet.name}(s)`,
      sweet
    });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ 
      error: 'Failed to restock sweet',
      details: error.message 
    });
  }
};

module.exports = {
  createSweet,
  getAllSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
};