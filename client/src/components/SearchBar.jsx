import React, { useState, useRef, useEffect } from 'react';
import { getRecentSearches, removeRecentSearch } from '../utils/helpers';

export default function SearchBar({ onSearch, onDebounce, loading }) {
  const [value, setValue] = useState('');
  const [recents, setRecents] = useState([]);
  const [showRecents, setShowRecents] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Load recents from localStorage on mount and whenever focus happens
  const loadRecents = () => {
    const r = getRecentSearches();
    setRecents(r);
    return r;
  };

  useEffect(() => {
    loadRecents();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowRecents(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
    onDebounce(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      setShowRecents(false);
      onSearch(value.trim());
      // Reload recents after a short delay so the new search is saved
      setTimeout(() => loadRecents(), 300);
    }
  };

  const handleFocus = () => {
    const r = loadRecents();
    if (r.length > 0) setShowRecents(true);
  };

  const handleRecentClick = (username) => {
    setValue(username);
    setShowRecents(false);
    onSearch(username);
  };

  const handleRemoveRecent = (e, username) => {
    e.stopPropagation();
    const updated = removeRecentSearch(username);
    setRecents(updated);
    if (updated.length === 0) setShowRecents(false);
  };

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-row">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search a GitHub username..."
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            autoComplete="off"
            spellCheck="false"
          />
          {value && (
            <button type="button" className="search-clear" onClick={handleClear} aria-label="Clear">
              ✕
            </button>
          )}
          <button
            type="submit"
            className="search-btn"
            disabled={loading || !value.trim()}
          >
            {loading ? <span className="btn-spinner" /> : 'Search'}
          </button>
        </div>
      </form>

      {showRecents && recents.length > 0 && (
        <div className="recents-dropdown">
          <p className="recents-label">Recent searches</p>
          {recents.map((username) => (
            <div
              key={username}
              className="recent-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleRecentClick(username)}
            >
              <span className="recent-icon">⏱</span>
              <span className="recent-name">{username}</span>
              <button
                className="recent-remove"
                onClick={(e) => handleRemoveRecent(e, username)}
                aria-label={`Remove ${username}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
