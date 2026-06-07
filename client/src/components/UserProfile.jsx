import React from 'react';
import { formatDate, formatNumber } from '../utils/helpers';

export default function UserProfile({ user, loading }) {
  if (loading) {
    return (
      <div className="profile-card skeleton-profile">
        <div className="skeleton skeleton-avatar" />
        <div className="skeleton-profile-info">
          <div className="skeleton skeleton-line skeleton-line--lg" />
          <div className="skeleton skeleton-line skeleton-line--md" />
          <div className="skeleton skeleton-line skeleton-line--sm" />
          <div className="skeleton-stats">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton skeleton-stat" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-card">
      <div className="profile-left">
        <a href={user.html_url} target="_blank" rel="noreferrer">
          <img className="profile-avatar" src={user.avatar_url} alt={user.login} />
        </a>
      </div>
      <div className="profile-right">
        <div className="profile-names">
          <h2 className="profile-name">{user.name || user.login}</h2>
          <a className="profile-login" href={user.html_url} target="_blank" rel="noreferrer">
            @{user.login}
          </a>
        </div>

        {user.bio && <p className="profile-bio">{user.bio}</p>}

        <div className="profile-meta">
          {user.location && (
            <span className="meta-item">
              <span className="meta-icon">📍</span> {user.location}
            </span>
          )}
          {user.company && (
            <span className="meta-item">
              <span className="meta-icon">🏢</span> {user.company}
            </span>
          )}
          {user.blog && (
            <span className="meta-item">
              <span className="meta-icon">🔗</span>
              <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">
                {user.blog}
              </a>
            </span>
          )}
          {user.twitter_username && (
            <span className="meta-item">
              <span className="meta-icon">𝕏</span>
              <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noreferrer">
                @{user.twitter_username}
              </a>
            </span>
          )}
          <span className="meta-item">
            <span className="meta-icon">📅</span> Joined {formatDate(user.created_at)}
          </span>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-value">{formatNumber(user.followers)}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-divider" />
          <div className="profile-stat">
            <span className="stat-value">{formatNumber(user.following)}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-divider" />
          <div className="profile-stat">
            <span className="stat-value">{formatNumber(user.public_repos)}</span>
            <span className="stat-label">Repos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
