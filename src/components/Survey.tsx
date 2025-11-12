import React from 'react';
import { questions } from '../data/questions';
import type { Question } from '../data/questions';
import type { UserAnswers } from '../lib/score';

interface SurveyProps {
  answers: UserAnswers;
  onAnswerChange: (questionId: number, answer: number, importance: number) => void;
  onComplete: () => void;
}

const likertLabels = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree'
];

const likertValues = [-2, -1, 0, 1, 2];

const importanceLabels = ['Not Important', 'Somewhat Important', 'Very Important'];

export const Survey: React.FC<SurveyProps> = ({ answers, onAnswerChange, onComplete }) => {
  // Group questions by topic
  const groupedQuestions = questions.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  const topicOrder = ['economy', 'rights', 'foreign', 'climate', 'housing', 'education', 'health', 'justice'];

  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  const handleLikertChange = (questionId: number, value: number) => {
    const currentImportance = answers[questionId]?.importance ?? 1;
    onAnswerChange(questionId, value, currentImportance);
  };

  const handleImportanceChange = (questionId: number, value: number) => {
    const currentAnswer = answers[questionId]?.answer ?? 0;
    onAnswerChange(questionId, currentAnswer, value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto grain">
      <div className="sheet mb-8">
        <h2 className="text-2xl font-display font-bold text-tavern-ink uppercase tracking-wide mb-3 u-dotted pb-3">
          Policy Survey
        </h2>
        <p className="font-sans text-gray-600">
          Rate your agreement with each statement and how important it is to you.
        </p>
        <div className="mt-4 text-sm font-mono text-tavern-blue-500">
          {Object.keys(answers).length} / {questions.length} ANSWERED
        </div>
      </div>

      {topicOrder.map(topic => {
        const topicQuestions = groupedQuestions[topic];
        if (!topicQuestions) return null;

        return (
          <div key={topic} className="mb-8">
            <h3 className="text-lg font-display font-bold text-tavern-ink uppercase tracking-wide mb-4 u-dotted pb-2">
              {topic}
            </h3>

            <div className="space-y-6">
              {topicQuestions.map(q => (
                <div key={q.id} className="sheet border border-gray-200">
                  <p className="font-sans text-tavern-ink font-medium mb-4">{q.text}</p>

                  {/* Likert Scale */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center gap-2">
                      {likertValues.map((value, idx) => (
                        <button
                          key={value}
                          onClick={() => handleLikertChange(q.id, value)}
                          className={`flex-1 py-3 px-2 rounded text-sm font-sans font-medium transition-all border ${
                            answers[q.id]?.answer === value
                              ? 'bg-tavern-blue-500 text-white shadow-md scale-105 border-tavern-blue-700'
                              : 'bg-white text-tavern-ink border-gray-300 hover:border-tavern-blue-300'
                          }`}
                          title={likertLabels[idx]}
                        >
                          <div className="hidden sm:block">{likertLabels[idx]}</div>
                          <div className="sm:hidden">{['--', '-', '0', '+', '++'][idx]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Importance Slider */}
                  <div className="mt-4">
                    <label className="block text-xs font-mono text-gray-600 uppercase tracking-wider mb-2">
                      Importance
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={answers[q.id]?.importance ?? 1}
                        onChange={(e) => handleImportanceChange(q.id, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: '#3A7CFF' }}
                      />
                      <span className="text-sm font-mono text-tavern-ink w-40">
                        {importanceLabels[answers[q.id]?.importance ?? 1]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="sticky bottom-0 bg-tavern-paper border-t border-dashed border-tavern-blue-300 p-6 shadow-lg">
        <button
          onClick={onComplete}
          disabled={!allAnswered}
          className={`w-full py-4 px-6 rounded font-display font-bold text-lg uppercase tracking-wide transition-all ${
            allAnswered
              ? 'bg-tavern-blue-500 text-white hover:bg-tavern-blue-700 shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allAnswered ? 'See Results →' : `Answer ${questions.length - Object.keys(answers).length} more`}
        </button>
      </div>
    </div>
  );
};
