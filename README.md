# GitExplorer - GitHub Profile Explorer

Studio Graphene Full Stack Assessment - Exercise 3

---

## What is this?

GitExplorer is a full-stack web app that lets you search any GitHub username and explore their public profile and repositories. I chose Exercise 3 because it demonstrates working with a third-party API, server-side caching, and handling real-world concerns like rate limiting and network errors.

The frontend never talks to GitHub directly. All requests go through the Node.js backend, which acts as a proxy. This matters for two reasons: it keeps any API token server-side and out of the browser, and it lets the server cache responses so repeated searches for the same user do not hammer the GitHub API.

---

## Live Demo

Frontend: https://gitexplorer-one.vercel.app
Backend API: https://gitexplorer-backend-s7gl.onrender.com

---

## Tech Stack and Why

**Backend - Node.js with Express**
Express keeps the server simple and focused. The backend does one job well: proxy requests to the GitHub API, cache them, and return clean shaped data to the frontend.

**HTTP Client - Axios**
Used on the server to call the GitHub API. Axios gives cleaner error handling than the native fetch for server-side use.

**Caching - In-memory Map with TTL**
A simple Map with expiry timestamps. If the same username is requested within 60 seconds the cached result is returned immediately, no GitHub call needed. This is what the brief asked for and it works well for the scale of this project.

**Frontend - React 18 with hooks**
All functional components. State is managed locally and lifted where needed. No Redux or external state library needed for this scope.

**Charts - Recharts**
Used for the language distribution donut chart. Shows which programming languages appear most across a user's public repos.

**Fonts - Space Mono and Outfit**
Space Mono gives a code-editor feel for repo names and stats. Outfit handles body text cleanly. The pairing gives the app a developer-native aesthetic.

**Testing - Jest with Supertest**
Integration tests that hit the actual Express routes and make real GitHub API calls. Tests cover the happy path, 404 for non-existent users, and cache hit verification.

---

## Features

**Must Have**
Search any GitHub username and view their profile including avatar, name, bio, follower count, following count, and public repo count. The repo list shows name, description, primary language, star count, and last updated date. You can sort repos by most recently updated, most stars, or alphabetically by name. If the username does not exist a clear error is shown. Network errors and rate limit responses are handled gracefully with readable messages.

**Should Have**
The backend caches each username request for 60 seconds. Repeated searches return instantly without hitting GitHub again. Loading skeletons show while requests are in flight. The load more button fetches the next page of repos since GitHub returns 30 per page by default. Clicking any repo card expands it to show additional details including open issues count, default branch, fork count, and last pushed date.

**Bonus**
Recently searched usernames are saved in localStorage and shown in a dropdown when you focus the search box, with the ability to remove individual entries. A donut chart built with Recharts shows the language breakdown across all loaded repos. The search input is debounced at 600ms so typing automatically triggers a search without needing to press the button.

---

## How to Run Locally

You need Node.js 18 or higher installed.

Clone the repo and go into the folder:

```
git clone https://github.com/your-username/github-explorer.git
cd github-explorer
```

Install all dependencies:

```
npm run install:all
```

Start both the backend and frontend:

```
npm run dev
```

The React app runs on http://localhost:3000 and the API runs on http://localhost:5000.

To run the backend tests:

```
npm test
```

Optionally, if you have a GitHub personal access token you can add it to increase the API rate limit from 60 to 5000 requests per hour. Create a file at server/.env with:

```
GITHUB_TOKEN=your_token_here
```

---

## API Documentation

All endpoints are prefixed with /api. Base URL locally is http://localhost:5000/api.

---

**GET /api/github/user/:username**

Fetches a GitHub user's profile. Cached for 60 seconds.

Example response:

```json
{
  "login": "torvalds",
  "name": "Linus Torvalds",
  "bio": "...",
  "avatar_url": "https://...",
  "followers": 230000,
  "following": 0,
  "public_repos": 6,
  "location": "Portland, OR",
  "created_at": "2011-09-03T...",
  "fromCache": false
}
```

Returns 404 if the user does not exist. Returns 429 if GitHub rate limit is hit.

---

**GET /api/github/user/:username/repos**

Returns paginated public repos. Cached per page and sort combination.

Query parameters:
- page - page number, defaults to 1
- per_page - results per page, defaults to 30
- sort - one of updated, stars, or name

Example response:

```json
{
  "repos": [
    {
      "id": 123,
      "name": "linux",
      "description": "Linux kernel source tree",
      "language": "C",
      "stargazers_count": 180000,
      "forks_count": 55000,
      "open_issues_count": 400,
      "default_branch": "master",
      "updated_at": "2024-06-01T...",
      "topics": ["kernel", "linux"]
    }
  ],
  "hasNextPage": false,
  "page": 1,
  "fromCache": false
}
```

---

**GET /api/github/cache/stats**

Returns the number of entries currently in the cache. Useful for debugging.

---

**GET /api/health**

Simple health check. Returns status ok and current timestamp.

---

## Project Structure

```
github-explorer/
├── package.json
├── .gitignore
├── README.md
│
├── server/
│   ├── package.json
│   ├── src/
│   │   ├── index.js          entry point, starts the Express server
│   │   ├── app.js            Express setup, routes, error handlers
│   │   ├── routes/
│   │   │   └── github.js     GitHub proxy endpoints with caching
│   │   └── utils/
│   │       └── cache.js      in-memory cache with TTL expiry
│   └── __tests__/
│       └── github.test.js    Jest and Supertest integration tests
│
└── client/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.jsx             root component and layout
        ├── index.css           all styles, dark theme, responsive
        ├── components/
        │   ├── SearchBar.jsx   search input with debounce and recent searches
        │   ├── UserProfile.jsx user avatar, bio, stats, meta info
        │   ├── RepoList.jsx    sortable repo list with load more
        │   ├── RepoCard.jsx    individual repo with expandable details
        │   ├── LanguageChart.jsx recharts donut chart for languages
        │   └── States.jsx      empty state and error state components
        ├── hooks/
        │   └── useGitHub.js    data fetching, debounce, load more logic
        └── utils/
            ├── api.js          all fetch calls centralised
            └── helpers.js      date formatting, language colours, localStorage helpers
```

---

## Deployment

A note on the free tier: the backend is hosted on Render's free plan which spins down after 15 minutes of inactivity. The first request after a period of no use may take 30-50 seconds to respond while the server wakes up. This is expected behaviour on the free tier and not a bug. The frontend on Vercel stays live permanently.

**Backend on Render**

Create a new Web Service, connect the GitHub repo, set root directory to server, build command to npm install, start command to node src/index.js. Optionally add a GITHUB_TOKEN environment variable to increase the rate limit.

**Frontend on Vercel**

Import the repo, set root directory to client, add environment variable REACT_APP_API_URL pointing to your Render backend URL followed by /api.

---

## What I Would Do Next

The in-memory cache resets every time the server restarts. For a production app I would move to Redis for persistent, shared caching that survives restarts and scales across multiple server instances.

The GitHub API returns a maximum of 100 repos per page. If a user has thousands of repos we would need proper virtual scrolling rather than a load more button to keep the DOM lightweight.

I would add a GitHub personal access token as a required environment variable in production to avoid rate limiting completely. Right now it falls back to the unauthenticated limit of 60 requests per hour.

End-to-end tests with Playwright would cover the full search and browse flow that the Jest tests do not reach.

---

## A Note on AI Usage

I used Claude to help with initial scaffolding and structure. Every part of the code has been reviewed, understood, and adjusted. I am comfortable explaining any file or design decision in the follow-up interview.
