import React from 'react';

interface TopicBarsProps {
  topicScores: { [topic: string]: number };
  candidateName: string;
}

const topicColors: { [key: string]: string } = {
  economy: '#3A7CFF',
  rights: '#9333ea',
  foreign: '#dc2626',
  climate: '#059669',
  housing: '#eab308',
  education: '#6366f1',
  health: '#ec4899',
  justice: '#f97316'
};

const topicLabels: { [key: string]: string } = {
  economy: 'Economy',
  rights: 'Rights',
  foreign: 'Foreign Policy',
  climate: 'Climate',
  housing: 'Housing',
  education: 'Education',
  health: 'Health',
  justice: 'Justice'
};

export const TopicBars: React.FC<TopicBarsProps> = ({ topicScores, candidateName }) => {
  // Normalize scores from -10 to 0 range to 0-100% for display
  const normalizeScore = (score: number): number => {
    // Scores are negative (closer to 0 = better alignment)
    // Convert -10 to 0 → 0% to 100%
    return Math.max(0, Math.min(100, (score + 10) * 10));
  };

  const topics = Object.keys(topicScores).sort();

  return (
    <div className="sheet grain border border-gray-200">
      <h3 className="text-lg font-display font-bold text-tavern-ink uppercase tracking-wide mb-3 u-dotted pb-3">
        Topic Alignment with {candidateName}
      </h3>
      <p className="text-sm font-sans text-gray-600 mb-4">
        How closely you align on each topic (longer bars = better alignment)
      </p>

      <div className="space-y-3">
        {topics.map(topic => {
          const score = topicScores[topic];
          const percentage = normalizeScore(score);
          const color = topicColors[topic] || '#6b7280';

          return (
            <div key={topic}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-mono text-tavern-ink uppercase tracking-wider">
                  {topicLabels[topic] || topic}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out rounded"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
