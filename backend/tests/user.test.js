import request from 'supertest';
import { describe, it, expect, vi, beforeEach,beforeAll } from "vitest";
import { vi } from 'vitest';
import app from '../app.js';
import User from '../models/user.model.js';

describe('User Routes', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });


  describe('GET /user/notifications', () => {
    it('should return 400 if clerkId is missing', async () => {
      const res = await request(app).get('/user/notifications');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('clerkId is required');
    });

    it('should return 404 if user not found', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValue(null);

      const res = await request(app).get('/user/notifications').query({ clerkId: '123' });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('user not found');
    });

    it('should return notifications array if user exists', async () => {
      const mockNotifications = [{ id: 1, message: 'Test' }];
      vi.spyOn(User, 'findOne').mockResolvedValue({ notifications: mockNotifications });

      const res = await request(app).get('/user/notifications').query({ clerkId: '123' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockNotifications);
    });
  });

  describe('POST /user/sync', () => {
    const userData = {
      clerkId: '123',
      username: 'John',
      email: 'john@example.com',
      profileImage: 'image.jpg',
    };

    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/user/sync').send({ clerkId: '123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('All fields are required');
    });

    it('should create a new user if not existing', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValue(null);
      vi.spyOn(User, 'create').mockResolvedValue(userData);

      const res = await request(app).post('/user/sync').send(userData);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User synced');
    });

    it('should return 200 if user already exists', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValue(userData);

      const res = await request(app).post('/user/sync').send(userData);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User synced');
    });
  });

  describe('GET /user/location/:clientId', () => {
    it('should return 404 if user not found', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValue(null);

      const res = await request(app).get('/user/location/123');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });

    it('should return 400 if location is not set', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValue({ location: null });

      const res = await request(app).get('/user/location/123');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Location not set for this user');
    });

    it('should return 200 with location if set', async () => {
      const mockLocation = { lat: 10, lng: 20 };
      vi.spyOn(User, 'findOne').mockResolvedValue({ location: mockLocation });

      const res = await request(app).get('/user/location/123');
      expect(res.status).toBe(200);
      expect(res.body.location).toEqual(mockLocation);
    });
  });

});
