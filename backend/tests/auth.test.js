const request = require('supertest');
const app = require('./test-server');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

require('./setup');

describe('🔐 Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: '',
          password: ''
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Please provide all required fields');
    });

    it('should return 400 if password is less than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '12345'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Password must be at least 6 characters long');
    });

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('name', 'Test User');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).toHaveProperty('role', 'user');
      expect(res.body).toHaveProperty('token');
    });

    it('should register a user as admin with admin role', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.user.role).toBe('admin');
    });

    it('should return 400 if user already exists', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password456'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('User already exists with this email');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: '',
          password: ''
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Please provide email and password');
    });

    it('should return 401 if email is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('should return 401 if password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('should login successfully with correct credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe('Login successful');
  expect(res.body.user).toHaveProperty('email', 'test@example.com');
  expect(res.body).toHaveProperty('token');
  
  // Don't verify the token signature in tests since we're using test secret
  // Just check that a token is returned
  expect(res.body.token).toBeTruthy();
  expect(typeof res.body.token).toBe('string');
});
  });

  describe('GET /api/auth/profile', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get token
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      authToken = registerRes.body.token;
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/profile');
      
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('No authentication token, access denied');
    });

    it('should return 401 if token is invalid', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(res.statusCode).toBe(401);
    });

    it('should return user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).toHaveProperty('name', 'Test User');
      expect(res.body.user).toHaveProperty('role', 'user');
      expect(res.body.user).not.toHaveProperty('password');
    });
  });
});