import React, { useState } from 'react';
import { formatDate, formatNumber, getLanguageColor } from '../utils/helpers';

export default function RepoCard({ repo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`repo-card ${expanded ? 'repo-card--expanded' : ''}`}>
      <div className="repo-main" onClick={() => setExpanded(!expanded)}>
        <div className="repo-header">
          <div className="repo-name-row">
            <a
              className="repo-name"
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {repo.name}
            </a>
            <div className="repo-badges">
              {repo.fork && <span className="badge badge--fork">Fork</span>}
              {repo.archived && <span className="badge badge--archived">Archived</span>}
            </div>
          </div>
          <span className="repo-expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>

        {repo.description && (
          <p className="repo-description">{repo.description}</p>
        )}

        <div className="repo-footer">
          {repo.language && (
            <span className="repo-language">
              <span
                className="language-dot"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              {repo.language}
            </span>
          )}
          <span className="repo-stat" title="Stars">
            ⭐ {formatNumber(repo.stargazers_count)}
          </span>
          <span className="repo-stat" title="Forks">
            🍴 {formatNumber(repo.forks_count)}
          </span>
          <span className="repo-updated">
            Updated {formatDate(repo.updated_at)}
          </span>
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="repo-topics">
            {repo.topics.slice(0, 5).map((topic) => (
              <span key={topic} className="topic-tag">{topic}</span>
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <div className="repo-details">
          <div className="repo-details-grid">
            <div className="detail-item">
              <span className="detail-label">Default Branch</span>
              <span className="detail-value">{repo.default_branch}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Open Issues</span>
              <span className="detail-value">{repo.open_issues_count}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Forks</span>
              <span className="detail-value">{formatNumber(repo.forks_count)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Pushed</span>
              <span className="detail-value">{formatDate(repo.pushed_at)}</span>
            </div>
          </div>
          <a
            className="btn btn-outline repo-view-btn"
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub →
          </a>
        </div>
      )}
    </div>
  );
}
