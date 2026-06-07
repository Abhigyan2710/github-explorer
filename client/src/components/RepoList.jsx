import React from 'react';
import RepoCard from './RepoCard';

const SORT_OPTIONS = [
  { value: 'updated', label: 'Recently Updated' },
  { value: 'stars', label: 'Most Stars' },
  { value: 'name', label: 'Name (A-Z)' },
];

export default function RepoList({ repos, loading, loadingMore, hasNextPage, sort, onSortChange, onLoadMore }) {
  if (loading) {
    return (
      <div className="repo-list-section">
        <div className="sort-bar">
          <div className="skeleton skeleton-line skeleton-line--sm" style={{ width: 200 }} />
        </div>
        <div className="repo-list">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton skeleton-repo-card" />
          ))}
        </div>
      </div>
    );
  }

  if (!repos || repos.length === 0) return null;

  return (
    <div className="repo-list-section">
      <div className="sort-bar">
        <span className="sort-label">Sort by</span>
        <div className="sort-pills">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`sort-pill ${sort === opt.value ? 'sort-pill--active' : ''}`}
              onClick={() => onSortChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="repo-count">{repos.length} repos shown</span>
      </div>

      <div className="repo-list">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {hasNextPage && (
        <div className="load-more-row">
          <button
            className="btn btn-primary load-more-btn"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <span className="btn-spinner" /> Loading...
              </>
            ) : (
              'Load More Repos'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
