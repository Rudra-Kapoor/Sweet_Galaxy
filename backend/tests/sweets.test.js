const request = require('supertest');
const app = require('./test-server');
const Sweet = require('../models/Sweet');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

require('./setup');

describe('🍬 Sweets API', () => {
  let userToken;
  let adminToken;
  let sweetId;

beforeEach(async () => {
  // Create test user and admin
  const user = new User({
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  });
  await user.save();
  
  const admin = new User({
    name: 'Test Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  });
  await admin.save();
  
  // Generate tokens with test secret
  userToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
  
  adminToken = jwt.sign(
    { userId: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET
  );
});

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Create test sweets
      await Sweet.create([
        {
          name: 'Chocolate Truffle',
          description: 'Rich chocolate',
          category: 'chocolate',
          price: 2.99,
          quantity: 50
        },
        {
          name: 'Gummy Bears',
          description: 'Fruit gummies',
          category: 'candy',
          price: 1.49,
          quantity: 100
        },
        {
          name: 'Red Velvet Cake',
          description: 'Delicious cake',
          category: 'dessert',
          price: 12.99,
          quantity: 10
        }
      ]);
    });

    it('should return all sweets (public endpoint)', async () => {
      const res = await request(app)
        .get('/api/sweets');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
      
      // Verify sweet structure
      const sweet = res.body[0];
      expect(sweet).toHaveProperty('_id');
      expect(sweet).toHaveProperty('name');
      expect(sweet).toHaveProperty('description');
      expect(sweet).toHaveProperty('category');
      expect(sweet).toHaveProperty('price');
      expect(sweet).toHaveProperty('quantity');
    });

    it('should filter sweets by category', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .query({ category: 'chocolate' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].category).toBe('chocolate');
    });

    it('should search sweets by name', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .query({ search: 'chocolate' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name.toLowerCase()).toContain('chocolate');
    });

    it('should filter by price range', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .query({ minPrice: 2, maxPrice: 5 });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].price).toBeGreaterThanOrEqual(2);
      expect(res.body[0].price).toBeLessThanOrEqual(5);
    });
  });

  describe('POST /api/sweets', () => {
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .send({
          name: 'New Sweet',
          description: 'Test description',
          category: 'chocolate',
          price: 3.99,
          quantity: 50
        });
      
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New Sweet',
          description: 'Test description',
          category: 'chocolate',
          price: 3.99,
          quantity: 50
        });
      
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('Access denied. Admin only.');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
          description: '',
          category: '',
          price: ''
        });
      
      expect(res.statusCode).toBe(400);
    });

    it('should create a new sweet as admin', async () => {
      const sweetData = {
        name: 'Test Chocolate',
        description: 'Delicious test chocolate',
        category: 'chocolate',
        price: 4.99,
        quantity: 25,
        image: 'https://test.com/image.jpg'
      };
      
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Sweet created successfully');
      expect(res.body.sweet).toMatchObject({
        name: sweetData.name,
        description: sweetData.description,
        category: sweetData.category,
        price: sweetData.price,
        quantity: sweetData.quantity
      });
      expect(res.body.sweet).toHaveProperty('_id');
      
      sweetId = res.body.sweet._id; // Save for other tests
    });
  });

  describe('PUT /api/sweets/:id', () => {
    beforeEach(async () => {
      // Create a sweet for testing updates
      const sweet = await Sweet.create({
        name: 'Original Sweet',
        description: 'Original description',
        category: 'candy',
        price: 1.99,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should update sweet as admin', async () => {
      const updates = {
        name: 'Updated Sweet',
        description: 'Updated description',
        price: 2.99,
        quantity: 75
      };
      
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Sweet updated successfully');
      expect(res.body.sweet.name).toBe(updates.name);
      expect(res.body.sweet.price).toBe(updates.price);
      expect(res.body.sweet.quantity).toBe(updates.quantity);
    });

    it('should return 404 if sweet not found', async () => {
      const res = await request(app)
        .put('/api/sweets/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated'
        });
      
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to delete',
        description: 'Will be deleted',
        category: 'chocolate',
        price: 2.99,
        quantity: 50
      });
      sweetId = sweet._id;
    });

    it('should delete sweet as admin', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Sweet deleted successfully');
      
      // Verify sweet is deleted
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it('should return 403 if user is not admin', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to purchase',
        description: 'Purchase test',
        category: 'candy',
        price: 1.99,
        quantity: 10
      });
      sweetId = sweet._id;
    });

    it('should purchase sweet (decrease quantity)', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Purchased 3 Sweet to purchase(s)');
      expect(res.body.sweet.quantity).toBe(7); // 10 - 3 = 7
    });

    it('should return 400 if insufficient quantity', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 15 }); // More than available
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Insufficient quantity');
    });

    it('should use default quantity of 1', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({}); // No quantity specified
      
      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(9); // 10 - 1 = 9
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Sweet to restock',
        description: 'Restock test',
        category: 'chocolate',
        price: 2.99,
        quantity: 5
      });
      sweetId = sweet._id;
    });

    it('should restock sweet as admin (increase quantity)', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Restocked 10 Sweet to restock(s)');
      expect(res.body.sweet.quantity).toBe(15); // 5 + 10 = 15
    });

    it('should return 403 if user is not admin', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });
      
      expect(res.statusCode).toBe(403);
    });

    it('should use default quantity of 10', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({}); // No quantity specified
      
      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(15); // 5 + 10 = 15
    });
  });
});