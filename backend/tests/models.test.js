const mongoose = require('mongoose');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

require('./setup');

describe('📊 Database Models', () => {
  describe('User Model', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.createdAt).toBeDefined();
    });

    it('should not save user without required fields', async () => {
      const user = new User({
        name: 'Test',
        // Missing email and password
      });
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should not allow duplicate emails', async () => {
      const user1 = new User({
        name: 'User 1',
        email: 'test@example.com',
        password: 'password123'
      });
      
      await user1.save();
      
      const user2 = new User({
        name: 'User 2',
        email: 'test@example.com', // Same email
        password: 'password456'
      });
      
      let error;
      try {
        await user2.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error
    });

    it('should compare passwords correctly', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'correctpassword'
      });
      
      await user.save();
      
      // Test correct password
      const isMatchCorrect = await user.comparePassword('correctpassword');
      expect(isMatchCorrect).toBe(true);
      
      // Test wrong password
      const isMatchWrong = await user.comparePassword('wrongpassword');
      expect(isMatchWrong).toBe(false);
    });
  });

  describe('Sweet Model', () => {
    it('should create a sweet successfully', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        description: 'Delicious chocolate',
        category: 'chocolate',
        price: 2.99,
        quantity: 50
      };
      
      const sweet = new Sweet(sweetData);
      const savedSweet = await sweet.save();
      
      expect(savedSweet._id).toBeDefined();
      expect(savedSweet.name).toBe(sweetData.name);
      expect(savedSweet.description).toBe(sweetData.description);
      expect(savedSweet.category).toBe(sweetData.category);
      expect(savedSweet.price).toBe(sweetData.price);
      expect(savedSweet.quantity).toBe(sweetData.quantity);
      expect(savedSweet.image).toBeDefined(); // Should have default
      expect(savedSweet.createdAt).toBeDefined();
      expect(savedSweet.updatedAt).toBeDefined();
    });

    it('should validate category enum', async () => {
      const sweet = new Sweet({
        name: 'Test Sweet',
        description: 'Test',
        category: 'invalid-category', // Invalid category
        price: 1.99,
        quantity: 10
      });
      
      let error;
      try {
        await sweet.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.category).toBeDefined();
    });

    it('should not allow negative price', async () => {
      const sweet = new Sweet({
        name: 'Test Sweet',
        description: 'Test',
        category: 'chocolate',
        price: -1.99, // Negative price
        quantity: 10
      });
      
      let error;
      try {
        await sweet.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.price).toBeDefined();
    });

    it('should not allow negative quantity', async () => {
      const sweet = new Sweet({
        name: 'Test Sweet',
        description: 'Test',
        category: 'chocolate',
        price: 1.99,
        quantity: -10 // Negative quantity
      });
      
      let error;
      try {
        await sweet.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeDefined();
      expect(error.errors.quantity).toBeDefined();
    });

    it('should update updatedAt on save', async () => {
      const sweet = new Sweet({
        name: 'Test Sweet',
        description: 'Test',
        category: 'chocolate',
        price: 1.99,
        quantity: 10
      });
      
      const savedSweet = await sweet.save();
      const originalUpdatedAt = savedSweet.updatedAt;
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Update the sweet
      savedSweet.name = 'Updated Name';
      const updatedSweet = await savedSweet.save();
      
      expect(updatedSweet.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});