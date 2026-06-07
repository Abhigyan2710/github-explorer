const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }
  return data;
};

export const api = {
  getUser: (username) =>
    fetch(`${BASE_URL}/github/user/${username}`).then(handleResponse),

  getRepos: (username, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/github/user/${username}/repos${query ? `?${query}` : ''}`).then(handleResponse);
  },
};
