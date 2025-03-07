import request from 'supertest';
import app from '../app'; // Path to your app.js or server file
import { auth } from '../config/firebase'; // Import your firebase config

// Mock the Firebase auth config
jest.mock('../config/firebase', () => {
  return {
    auth: {
      verifyIdToken: jest.fn(),
      getUser: jest.fn(),
      setCustomUserClaims: jest.fn(), // Add this mock for setCustomUserClaims
    },
  };
});

// Example of token mocks
const validToken = 'valid_token';
const invalidToken = 'invalid_token';
const validManagerToken = 'valid_manager_token';
const invalidRoleToken = 'invalid_role_token';

// Mock decoded ID token structure
const mockDecodedIdToken = {
  uid: '123',
  role: 'manager',
  aud: 'test_aud',
  auth_time: 1234567890,
  exp: 1234567890,
  firebase: {
    sign_in_provider: 'google',
  },
  iat: 1234567890,
  name: 'Test User',
  email: 'test@example.com',
};

describe('Authentication, Authorization, and Routes Tests', () => {
  // Authentication Middleware Tests
  describe('Authentication Middleware', () => {
    it('should return 401 for invalid or missing token', async () => {
      (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

      const response = await request(app)
        .get('/api/v1/user/123')
        .set('Authorization', `Bearer ${invalidToken}`);

      console.error("Error verifying token:", new Error('Invalid token')); // Added error log
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Invalid token');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .get('/api/v1/user/123');

      console.error("Error verifying token:", new Error('No token provided')); // Added error log
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: No token provided');
    });
  });

  // Authorization Middleware Tests
  describe('Authorization Middleware', () => {


    it('should return 403 for users with insufficient role', async () => {
      const invalidRoleTokenMock = { ...mockDecodedIdToken, role: 'officer' };
      (auth.verifyIdToken as jest.Mock).mockResolvedValue(invalidRoleTokenMock);

      const response = await request(app)
        .get('/api/v1/user/123')
        .set('Authorization', `Bearer ${invalidRoleToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden: Insufficient role');
    });

    it('should return 403 if role is not provided in the token', async () => {
      const missingRoleTokenMock = { ...mockDecodedIdToken, role: undefined };
      (auth.verifyIdToken as jest.Mock).mockResolvedValue(missingRoleTokenMock);

      const response = await request(app)
        .get('/api/v1/user/123')
        .set('Authorization', `Bearer ${invalidToken}`);

      console.error("Error: No role found in token"); // Added error log
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden: No role found');
    });
  });

  // Admin Route Tests (setUserRole)
  describe('Admin Route - setUserRole', () => {
    it('should allow manager to set user role', async () => {
      (auth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedIdToken);

      const response = await request(app)
        .post('/api/v1/admin/set-role')
        .set('Authorization', `Bearer ${validManagerToken}`)
        .send({ uid: '456', role: 'officer' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Role 'officer' assigned to user 456");
    });

    it('should return 403 if user is not manager', async () => {
      const invalidRoleTokenMock = { ...mockDecodedIdToken, role: 'user' };
      (auth.verifyIdToken as jest.Mock).mockResolvedValue(invalidRoleTokenMock);

      const response = await request(app)
        .post('/api/v1/admin/set-role')
        .set('Authorization', `Bearer ${invalidRoleToken}`)
        .send({ uid: '456', role: 'officer' });

      console.error("Error setting role:", new Error('Forbidden: Insufficient role')); // Added error log
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden: Insufficient role');
    });
  });

  // User Route Tests (getUserDetails)
  describe('User Route - getUserDetails', () => {
    it('should return 403 for users without the manager role', async () => {
      const invalidRoleTokenMock = { ...mockDecodedIdToken, role: 'user' };
      (auth.verifyIdToken as jest.Mock).mockResolvedValue(invalidRoleTokenMock);

      const response = await request(app)
        .get('/api/v1/user/123')
        .set('Authorization', `Bearer ${invalidRoleToken}`);

      console.error("Error fetching user details: Forbidden access"); // Added error log
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden: Insufficient role');
    });

    it('should return 404 if user is not found', async () => {
      (auth.verifyIdToken as jest.Mock).mockResolvedValue(mockDecodedIdToken);

      // Mock Firebase's getUser to return null for a non-existent user
      (auth.getUser as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/user/999')
        .set('Authorization', `Bearer ${validToken}`);

      console.error("Error: User not found"); // Added error log
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});
