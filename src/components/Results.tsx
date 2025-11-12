import React, { useState } from 'react';
import type { MatchResult, Point2D } from '../lib/score';
import { TopicBars } from './TopicBars';

interface ResultsProps {
  matches: MatchResult[];
  userPosition: Point2D | null;
  onExport: () => void;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  matches,
  userPosition,
  onExport,
  onReset
}) => {
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(
    matches[0]?.candidate.id || null
  );

  const top3 = matches.slice(0, 3);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 grain">
      {/* Your Position */}
      {userPosition && (
        <div className="bg-green-50 border-2 border-green-500 border-dashed rounded p-6">
          <h3 className="text-lg font-display font-bold text-green-800 uppercase tracking-wide mb-3">Your Position</h3>
          <div className="grid grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <span className="text-green-700">ECONOMIC:</span>
              <span className="ml-2 text-green-900 font-semibold">
                {userPosition.x.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-green-700">SOCIAL:</span>
              <span className="ml-2 text-green-900 font-semibold">
                {userPosition.y.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Matches */}
      <div className="sheet border border-gray-200">
        <h2 className="text-2xl font-display font-bold text-tavern-ink uppercase tracking-wide mb-6 u-dotted pb-4">Your Top Matches</h2>

        <div className="space-y-4">
          {top3.map((match, idx) => (
            <div
              key={match.candidate.id}
              className="border-2 border-gray-200 border-dashed rounded overflow-hidden hover:border-tavern-blue-500 transition-colors bg-white"
            >
              {/* Candidate Header */}
              <button
                onClick={() =>
                  setExpandedCandidate(
                    expandedCandidate === match.candidate.id
                      ? null
                      : match.candidate.id
                  )
                }
                className="w-full p-4 flex items-center justify-between bg-tavern-blue-50 hover:bg-tavern-blue-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-display font-bold ${
                    idx === 0 ? 'text-yellow-500' :
                    idx === 1 ? 'text-gray-400' :
                    'text-orange-600'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-display font-bold text-tavern-ink">
                      {match.candidate.name}
                    </h3>
                    <p className="text-sm font-mono text-gray-600">
                      {match.candidate.state} • {match.candidate.level.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-tavern-blue-500">
                    {match.normalizedScore.toFixed(1)}/10
                  </div>
                  <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    Match
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedCandidate === match.candidate.id && (
                <div className="p-6 bg-white border-t-2 border-gray-200">
                  {/* Bio */}
                  <p className="text-gray-700 mb-4">{match.candidate.bio}</p>

                  {match.candidate.url && (
                    <a
                      href={match.candidate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sky-600 hover:text-sky-700 text-sm font-medium mb-4"
                    >
                      Learn more →
                    </a>
                  )}

                  {/* Axes */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-gray-600 text-sm">Economic:</span>
                      <span className="ml-2 font-semibold text-gray-800">
                        {match.candidate.axes.economic.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Social:</span>
                      <span className="ml-2 font-semibold text-gray-800">
                        {match.candidate.axes.social.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Topic Bars */}
                  <TopicBars
                    topicScores={match.topicScores}
                    candidateName={match.candidate.name}
                  />

                  {/* Agreements & Disagreements */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Top Agreements
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {match.agreements.slice(0, 3).map((q, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">
                        Top Disagreements
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {match.disagreements.slice(0, 3).map((q, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onExport}
          className="flex-1 py-3 px-6 bg-tavern-blue-500 text-white rounded font-display font-bold uppercase tracking-wide hover:bg-tavern-blue-700 transition-colors shadow-md"
        >
          Export Results →
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 px-6 bg-tavern-ink text-white rounded font-display font-bold uppercase tracking-wide hover:bg-gray-700 transition-colors shadow-md"
        >
          ← Retake Survey
        </button>
      </div>
    </div>
  );
};
