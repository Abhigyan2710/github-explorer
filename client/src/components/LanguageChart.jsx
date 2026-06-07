import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getLanguageColor } from '../utils/helpers';

export default function LanguageChart({ repos }) {
  if (!repos || repos.length === 0) return null;

  // Aggregate language counts
  const langCount = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const data = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) return null;

  return (
    <div className="lang-chart-card">
      <h3 className="section-heading">Languages Used</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            minAngle={8}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={getLanguageColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip formatter={(val, name) => [`${val} repos`, name]} />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
