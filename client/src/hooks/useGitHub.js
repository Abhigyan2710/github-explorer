import { useState, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { addRecentSearch } from '../utils/helpers';

export const useGitHub = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sort, setSort] = useState('updated');
  const [currentUsername, setCurrentUsername] = useState('');
  const debounceTimer = useRef(null);

  const searchUser = useCallback(async (username, sortBy = sort) => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setRepos([]);
    setCurrentPage(1);
    setHasNextPage(false);
    setCurrentUsername(username.trim());

    try {
      const [userData, reposData] = await Promise.all([
        api.getUser(username.trim()),
        api.getRepos(username.trim(), { page: 1, per_page: 30, sort: sortBy }),
      ]);

      setUser(userData);
      setRepos(reposData.repos);
      setHasNextPage(reposData.hasNextPage);
      addRecentSearch(userData.login);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  // Debounced search - fires 600ms after user stops typing
  const debouncedSearch = useCallback((username) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (username.trim().length >= 2) searchUser(username);
    }, 600);
  }, [searchUser]);

  const loadMore = useCallback(async () => {
    if (!currentUsername || loadingMore || !hasNextPage) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await api.getRepos(currentUsername, {
        page: nextPage,
        per_page: 30,
        sort,
      });
      setRepos((prev) => [...prev, ...data.repos]);
      setCurrentPage(nextPage);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [currentUsername, currentPage, hasNextPage, loadingMore, sort]);

  const changeSort = useCallback((newSort) => {
    setSort(newSort);
    if (currentUsername) searchUser(currentUsername, newSort);
  }, [currentUsername, searchUser]);

  const reset = useCallback(() => {
    setUser(null);
    setRepos([]);
    setError(null);
    setCurrentUsername('');
    setCurrentPage(1);
    setHasNextPage(false);
  }, []);

  return {
    user,
    repos,
    loading,
    loadingMore,
    error,
    hasNextPage,
    sort,
    currentUsername,
    searchUser,
    debouncedSearch,
    loadMore,
    changeSort,
    reset,
  };
};
