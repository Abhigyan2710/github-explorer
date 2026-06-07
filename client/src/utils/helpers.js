export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  default: '#8b949e',
};

export const getLanguageColor = (lang) =>
  LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.default;

// Recently searched - localStorage helpers
const STORAGE_KEY = 'gh_explorer_recent';
const MAX_RECENT = 8;

export const getRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addRecentSearch = (username) => {
  try {
    const existing = getRecentSearches().filter(
      (u) => u.toLowerCase() !== username.toLowerCase()
    );
    const updated = [username, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const removeRecentSearch = (username) => {
  try {
    const updated = getRecentSearches().filter(
      (u) => u.toLowerCase() !== username.toLowerCase()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};
