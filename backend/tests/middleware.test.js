const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { auth, isAdmin } = require('../middleware/auth');

// Mock the User model
jest.mock('../models/User', () => ({
  findById: jest.fn()
}));

const User = require('../models/User');

require('./setup');

describe('🛡️ Middleware', () => {
  describe('auth middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
      mockReq = {
        header: jest.fn()
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      mockNext = jest.fn();
      
      // Clear all mocks
      jest.clearAllMocks();
    });

    it('should return 401 if no authorization header', async () => {
      mockReq.header.mockReturnValue(null);
      
      await auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'No authentication token, access denied'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token format is invalid', async () => {
      mockReq.header.mockReturnValue('InvalidTokenFormat');
      
      await auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid token format. Use Bearer token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      mockReq.header.mockReturnValue('Bearer invalid.token.here');
      
      await auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should attach user to request if token is valid', async () => {
      // Create a test user ID
      const testUserId = new mongoose.Types.ObjectId();
      const testUser = {
        _id: testUserId,
        email: 'test@example.com',
        role: 'user',
        name: 'Test User'
      };
      
      // Setup the mock
      User.findById.mockResolvedValue(testUser);
      
      // Create a valid token
      const token = jwt.sign(
        { userId: testUserId.toString(), email: 'test@example.com', role: 'user' },
        process.env.JWT_SECRET
      );
      
      mockReq.header.mockReturnValue(`Bearer ${token}`);
      
      await auth(mockReq, mockRes, mockNext);
      
      // Check that findById was called with correct ID
      expect(User.findById).toHaveBeenCalledWith(testUserId);
      
      // Check that user was attached to request
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user._id.toString()).toBe(testUserId.toString());
      expect(mockReq.user.email).toBe('test@example.com');
      expect(mockReq.token).toBe(token);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 if user no longer exists', async () => {
      // Mock User.findById to return null (user deleted)
      User.findById.mockResolvedValue(null);
      
      const testUserId = new mongoose.Types.ObjectId();
      const token = jwt.sign(
        { userId: testUserId.toString(), email: 'deleted@example.com', role: 'user' },
        process.env.JWT_SECRET
      );
      
      mockReq.header.mockReturnValue(`Bearer ${token}`);
      
      await auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('isAdmin middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
      mockReq = {
        user: {
          _id: 'test123',
          email: 'test@example.com',
          role: 'user'
        }
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      mockNext = jest.fn();
    });

    it('should allow access for admin users', () => {
      mockReq.user.role = 'admin';
      
      isAdmin(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for non-admin users', () => {
      mockReq.user.role = 'user';
      
      isAdmin(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Access denied. Admin only.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing user gracefully', () => {
      mockReq.user = null;
      
      isAdmin(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Access denied. Admin only.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});