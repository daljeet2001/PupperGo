import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import dogwalkerModel from '../models/dogwalker.model.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Dogwalker Routes', () => {

  describe('POST /dogwalker/filter', () => {
    it('should return filtered dogwalkers', async () => {
      const mockDogwalkers = [
        { clerkId: '1', username: 'Walker1' },
        { clerkId: '2', username: 'Walker2' },
      ];

      vi.spyOn(dogwalkerModel, 'find').mockResolvedValue(mockDogwalkers);

      const res = await request(app)
        .post('/dogwalker/filter')
        .send({
          NearbyWalkers: [{ clerkId: '1' }, { clerkId: '2' }],
          dates: ['2025-08-16'],
          hourlyRatelow: 100,
          hourlyRatehigh: 500
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockDogwalkers);
    });

    it('should return 400 if NearbyWalkers is not an array', async () => {
      const res = await request(app)
        .post('/dogwalker/filter')
        .send({ NearbyWalkers: 'not-array', dates: ['2025-08-16'] });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /dogwalker/availability', () => {
    it('should update availability successfully', async () => {
      const mockDogwalker = { clerkId: '1', availability: [], save: vi.fn() };

      vi.spyOn(dogwalkerModel, 'findOneAndUpdate').mockResolvedValue(mockDogwalker);

      const res = await request(app)
        .post('/dogwalker/availability')
        .send({ clerkId: '1', dates: ['2025-08-16'] });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Availability updated successfully');
    });

    it('should return 400 if dates or clerkId invalid', async () => {
      const res = await request(app)
        .post('/dogwalker/availability')
        .send({ clerkId: '1', dates: 'not-array' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /dogwalker/upcoming-bookings', () => {
    it('should return upcoming bookings', async () => {
      const mockDogwalker = { clerkId: '1', upcomingBookings: ['booking1'] };
      vi.spyOn(dogwalkerModel, 'findOne').mockResolvedValue(mockDogwalker);

      const res = await request(app)
        .get('/dogwalker/upcoming-bookings')
        .query({ clerkId: '1' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(['booking1']);
    });

    it('should return 404 if dogwalker not found', async () => {
      vi.spyOn(dogwalkerModel, 'findOne').mockResolvedValue(null);

      const res = await request(app)
        .get('/dogwalker/upcoming-bookings')
        .query({ clerkId: 'unknown' });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /dogwalker/sync', () => {
    it('should sync dogwalker if not exists', async () => {
      vi.spyOn(dogwalkerModel, 'findOne').mockResolvedValue(null);
      vi.spyOn(dogwalkerModel, 'create').mockResolvedValue({ clerkId: '1' });

      const res = await request(app)
        .post('/dogwalker/sync')
        .send({ clerkId: '1', username: 'Walker1', email: 'test@test.com', profileImage: 'img.png' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User synced');
    });

    it('should return 400 if missing fields', async () => {
      const res = await request(app)
        .post('/dogwalker/sync')
        .send({ clerkId: '1' });

      expect(res.status).toBe(400);
    });
  });

});
