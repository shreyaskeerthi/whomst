import { useState, useEffect, useMemo } from 'react';
import { Survey } from './components/Survey';
import { IssueMap } from './components/IssueMap';
import { Results } from './components/Results';
import { LocationSelector } from './components/LocationSelector';
import { questions } from './data/questions';
import { candidates } from './data/candidates';
import { calculateMatches, projectTo2D } from './lib/score';
import type { UserAnswers } from './lib/score';

function App() {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tavernAnswers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
      } catch (e) {
        console.error('Failed to load saved answers', e);
      }
    }
  }, []);

  // Save to localStorage whenever answers change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('tavernAnswers', JSON.stringify(answers));
    }
  }, [answers]);

  // Filter candidates by location
  const filteredCandidates = useMemo(() => {
    if (selectedState === null) {
      // Show all federal-level candidates
      return candidates.filter(c => c.level === 'federal');
    }

    // Show only candidates from selected state/city
    return candidates.filter(c => {
      if (c.state !== selectedState) return false;
      if (selectedCity && c.city && c.city !== selectedCity) return false;
      return true;
    });
  }, [selectedState, selectedCity]);

  // Calculate matches and projections
  const matches = useMemo(() => {
    if (Object.keys(answers).length === 0) return [];
    return calculateMatches(answers, filteredCandidates, questions);
  }, [answers, filteredCandidates]);

  const points2D = useMemo(() => {
    if (Object.keys(answers).length === 0) return [];
    return projectTo2D(answers, filteredCandidates, questions);
  }, [answers, filteredCandidates]);

  const userPosition = points2D.find(p => p.type === 'user') || null;

  // Transform data for new IssueMap component
  const mapData = useMemo(() => {
    const user = userPosition ? { x: userPosition.x, y: userPosition.y } : { x: 0, y: 0 };

    const top3Ids = matches.slice(0, 3).map(m => m.candidate.id);

    const points = points2D
      .filter(p => p.type === 'candidate' && p.data)
      .map(p => {
        const match = matches.find(m => m.candidate.id === p.data!.id);
        return {
          id: p.data!.id,
          name: p.data!.name,
          x: p.x,
          y: p.y,
          isTop: top3Ids.includes(p.data!.id),
          match
        };
      });

    return { user, points };
  }, [userPosition, points2D, matches]);

  const handleAnswerChange = (questionId: number, answer: number, importance: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { answer, importance }
    }));
  };

  const handleComplete = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all answers?')) {
      setAnswers({});
      setShowResults(false);
      localStorage.removeItem('tavernAnswers');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      location: {
        state: selectedState,
        city: selectedCity
      },
      answers,
      userPosition: userPosition ? {
        x: userPosition.x,
        y: userPosition.y
      } : null,
      topMatches: matches.slice(0, 3).map(m => ({
        name: m.candidate.name,
        score: m.normalizedScore,
        distance: m.distance,
        similarity: m.similarity,
        state: m.candidate.state,
        level: m.candidate.level
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whomst-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-tavern-paper grain">
      {/* Header */}
      <header className="bg-gradient-to-r from-tavern-blue-700 to-tavern-blue-500 hero-curve">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-display font-extrabold text-white tracking-wider typewriter-flicker mb-3">
            whomst?
          </h1>
          <p className="font-sans text-tavern-blue-50 text-lg">
            discover your political alignment through nuanced policy positions
          </p>
        </div>
      </header>

      {/* Location Selector (before survey) */}
      {!showResults && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LocationSelector
            selectedState={selectedState}
            selectedCity={selectedCity}
            onStateChange={setSelectedState}
            onCityChange={setSelectedCity}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!showResults ? (
          <Survey
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onComplete={handleComplete}
          />
        ) : (
          <div className="space-y-8">
            {/* Location Selector */}
            <LocationSelector
              selectedState={selectedState}
              selectedCity={selectedCity}
              onStateChange={setSelectedState}
              onCityChange={setSelectedCity}
            />

            {/* Visualization */}
            <IssueMap user={mapData.user} points={mapData.points} />

            {/* Results */}
            <div data-results>
              <Results
                matches={matches}
                userPosition={userPosition}
                onExport={handleExport}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-tavern-ink text-gray-400 py-8 mt-16 border-t border-dotted border-gray-600">
        <div className="max-w-7xl mx-auto px-4 text-center font-mono text-xs">
          <p className="text-gray-500">
            © WHOMST 2025 • Experimental civic interface
          </p>
          <p className="mt-2 text-gray-600">
            Not voting advice • All data stored locally • No tracking
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
