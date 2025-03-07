import request from 'supertest';
import app from '../app';  // Adjust to the path where your app is defined
import { auth } from '../config/firebase';
jest.mock('../config/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));


describe('Loan API Middleware and Routes Tests', () => {

    // Mock the verifyIdToken method to return a mocked user object with all necessary fields
    const mockVerifyToken = (role: string) => {
        return jest.spyOn(auth, 'verifyIdToken').mockResolvedValue({
          uid: '123',
          role: role,
          aud: 'some-audience',  // Required field
          auth_time: 1616661234,  // Required field
          exp: 1616664834,        // Required field
          iat: 1616661234,        // Add the 'iat' field (Issued At time)
          firebase: { 
            sign_in_provider: 'firebase', 
            identities: { 
              email: ['test@example.com'] 
            } 
          },  // Required field
          iss: 'https://securetoken.google.com/some-app-id',  // Required field
          sub: 'some-subject',  // Required field
        });
      };
      


  // Test for successful token processing (authentication middleware)
  it('should authenticate valid tokens', async () => {
    mockVerifyToken('user');  // Mocking a valid user role

    const res = await request(app)
      .post('/api/v1/loans')
      .set('Authorization', 'Bearer valid-token')
      .send({
        amount: 1000,
        status: 'pending',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Loan application created successfully!');
  });

  // Test for invalid token (authentication middleware)
  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/api/v1/loans')
      .send({
        amount: 1000,
        status: 'pending',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: No token provided');
  });

  it('should return 401 for invalid token', async () => {
    jest.spyOn(auth, 'verifyIdToken').mockRejectedValue(new Error('Invalid token'));

    const res = await request(app)
      .post('/api/v1/loans')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        amount: 1000,
        status: 'pending',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: Invalid token');
  });

  // Test for role-based access (authorization middleware)
  it('should allow officers to review loans', async () => {
    mockVerifyToken('officer');  // Mocking officer role

    const res = await request(app)
      .put('/api/v1/loans/1/review')
      .set('Authorization', 'Bearer valid-token')
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Loan with id 1 has been updated.');
  });

  it('should return 403 if user does not have the required role for review', async () => {
    mockVerifyToken('user');  // Mocking user role

    const res = await request(app)
      .put('/api/v1/loans/1/review')
      .set('Authorization', 'Bearer valid-token')
      .send();

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Insufficient role');
  });

  it('should allow managers to approve loans', async () => {
    mockVerifyToken('manager');  // Mocking manager role

    const res = await request(app)
      .put('/api/v1/loans/1/approve')
      .set('Authorization', 'Bearer valid-token')
      .send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Loan with id 1 has been updated.');
  });

  it('should return 403 if user does not have the required role for approve', async () => {
    mockVerifyToken('officer');  // Mocking officer role (should be manager)

    const res = await request(app)
      .put('/api/v1/loans/1/approve')
      .set('Authorization', 'Bearer valid-token')
      .send();

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Insufficient role');
  });

  // Test route to get loans (only accessible to officer or manager)
  it('should allow officers or managers to get loans', async () => {
    mockVerifyToken('officer');  // Mocking officer role

    const res = await request(app)
      .get('/api/v1/loans')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([{ id: 1, amount: 5000, status: 'pending' }]));
  });

  it('should return 403 for users without the correct role to get loans', async () => {
    mockVerifyToken('user');  // Mocking user role

    const res = await request(app)
      .get('/api/v1/loans')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Insufficient role');
  });

  // Test for creating a loan without token
  it('should return 401 if no token provided for loan creation', async () => {
    const res = await request(app)
      .post('/api/v1/loans')
      .send({
        amount: 2000,
        status: 'pending',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: No token provided');
  });
});
