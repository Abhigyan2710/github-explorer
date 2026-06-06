const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/github/user/:username', () => {
  it('returns 404 for a non-existent user', async () => {
    const res = await request(app).get('/api/github/user/thisuserdoesnotexist99999xyz');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('returns user data for a valid username', async () => {
    const res = await request(app).get('/api/github/user/torvalds');
    expect(res.status).toBe(200);
    expect(res.body.login).toBe('torvalds');
    expect(res.body.avatar_url).toBeDefined();
    expect(res.body.followers).toBeDefined();
  }, 10000);

  it('returns fromCache true on second request', async () => {
    await request(app).get('/api/github/user/torvalds');
    const res = await request(app).get('/api/github/user/torvalds');
    expect(res.status).toBe(200);
    expect(res.body.fromCache).toBe(true);
  }, 10000);
});

describe('GET /api/github/user/:username/repos', () => {
  it('returns repos for a valid username', async () => {
    const res = await request(app).get('/api/github/user/torvalds/repos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.repos)).toBe(true);
    expect(res.body.repos.length).toBeGreaterThan(0);
  }, 10000);
});

describe('GET /api/github/cache/stats', () => {
  it('returns cache entry count', async () => {
    const res = await request(app).get('/api/github/cache/stats');
    expect(res.status).toBe(200);
    expect(res.body.entries).toBeDefined();
  });
});
