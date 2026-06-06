const express = require('express');
const axios = require('axios');
const cache = require('../utils/cache');

const router = express.Router();

const GITHUB_API = 'https://api.github.com';

// Build GitHub API headers - attach token if available to increase rate limit
const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

// Handle GitHub API errors gracefully
const handleGitHubError = (err, res) => {
  if (err.response) {
    const status = err.response.status;
    if (status === 404) {
      return res.status(404).json({ error: 'GitHub user not found.' });
    }
    if (status === 403) {
      return res.status(429).json({
        error: 'GitHub API rate limit exceeded. Please wait a minute and try again.',
      });
    }
    if (status === 401) {
      return res.status(401).json({ error: 'GitHub API authentication failed.' });
    }
    return res.status(status).json({ error: err.response.data.message || 'GitHub API error.' });
  }
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({ error: 'Unable to reach GitHub API. Check your connection.' });
  }
  return res.status(500).json({ error: 'An unexpected error occurred.' });
};

// GET /api/github/user/:username
// Returns user profile. Cached for 60 seconds.
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  const cacheKey = `user:${username.toLowerCase()}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, fromCache: true });
  }

  try {
    const { data } = await axios.get(`${GITHUB_API}/users/${username}`, {
      headers: getHeaders(),
    });

    const user = {
      login: data.login,
      name: data.name,
      bio: data.bio,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      followers: data.followers,
      following: data.following,
      public_repos: data.public_repos,
      location: data.location,
      company: data.company,
      blog: data.blog,
      twitter_username: data.twitter_username,
      created_at: data.created_at,
    };

    cache.set(cacheKey, user);
    res.json({ ...user, fromCache: false });
  } catch (err) {
    handleGitHubError(err, res);
  }
});

// GET /api/github/user/:username/repos
// Returns paginated repos. Cached per page.
// Query params: page (default 1), per_page (default 30), sort (stars|name|updated)
router.get('/user/:username/repos', async (req, res) => {
  const { username } = req.params;
  const { page = 1, per_page = 30, sort = 'updated' } = req.query;

  // Map our sort param to GitHub API sort param
  const githubSort = sort === 'stars' ? 'pushed' : sort === 'name' ? 'full_name' : 'updated';
  const cacheKey = `repos:${username.toLowerCase()}:${page}:${per_page}:${sort}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, fromCache: true });
  }

  try {
    const { data, headers } = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
      headers: getHeaders(),
      params: {
        page,
        per_page,
        sort: githubSort,
        direction: sort === 'name' ? 'asc' : 'desc',
        type: 'public',
      },
    });

    // Parse GitHub link header to determine if more pages exist
    const linkHeader = headers.link || '';
    const hasNextPage = linkHeader.includes('rel="next"');

    const repos = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      default_branch: repo.default_branch,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      topics: repo.topics || [],
      fork: repo.fork,
      archived: repo.archived,
    }));

    const result = { repos, hasNextPage, page: Number(page) };
    cache.set(cacheKey, result);
    res.json({ ...result, fromCache: false });
  } catch (err) {
    handleGitHubError(err, res);
  }
});

// GET /api/github/cache/stats
// Returns cache stats (useful for debugging)
router.get('/cache/stats', (_req, res) => {
  res.json({ entries: cache.size(), message: 'In-memory cache stats' });
});

module.exports = router;
