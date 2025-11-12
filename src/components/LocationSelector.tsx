import React from 'react';

interface LocationSelectorProps {
  selectedState: string | null;
  selectedCity: string | null;
  onStateChange: (state: string | null) => void;
  onCityChange: (city: string | null) => void;
}

const states = [
  { code: 'IL', name: 'Illinois', cities: ['Chicago'] },
  { code: 'NY', name: 'New York', cities: ['New York City'] },
  { code: 'CA', name: 'California', cities: ['Los Angeles'] },
  { code: 'TX', name: 'Texas', cities: [] },
  { code: 'FL', name: 'Florida', cities: [] },
  { code: 'PA', name: 'Pennsylvania', cities: [] },
  { code: 'GA', name: 'Georgia', cities: [] },
  { code: 'MA', name: 'Massachusetts', cities: [] },
  { code: 'MO', name: 'Missouri', cities: [] },
  { code: 'IN', name: 'Indiana', cities: [] },
  { code: 'VT', name: 'Vermont', cities: [] }
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange
}) => {
  const selectedStateData = states.find(s => s.code === selectedState);
  const hasCity = selectedStateData && selectedStateData.cities.length > 0;

  return (
    <div className="sheet grain max-w-2xl mx-auto">
      <h3 className="text-lg font-display font-bold text-tavern-ink uppercase tracking-wide mb-4 u-dotted pb-3">
        Select Your Location
      </h3>

      <div className="space-y-4">
        {/* State Selector */}
        <div>
          <label className="block text-sm font-mono text-gray-600 uppercase tracking-wider mb-2">
            State / National
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <button
              onClick={() => {
                onStateChange(null);
                onCityChange(null);
              }}
              className={`py-2 px-3 rounded text-sm font-sans font-medium transition-all ${
                selectedState === null
                  ? 'bg-tavern-blue-500 text-white shadow-md'
                  : 'bg-white text-tavern-ink border border-gray-300 hover:border-tavern-blue-300'
              }`}
            >
              National
            </button>
            {states.map(state => (
              <button
                key={state.code}
                onClick={() => {
                  onStateChange(state.code);
                  onCityChange(null);
                }}
                className={`py-2 px-3 rounded text-sm font-sans font-medium transition-all ${
                  selectedState === state.code
                    ? 'bg-tavern-blue-500 text-white shadow-md'
                    : 'bg-white text-tavern-ink border border-gray-300 hover:border-tavern-blue-300'
                }`}
              >
                {state.code}
              </button>
            ))}
          </div>
        </div>

        {/* City Selector (if applicable) */}
        {hasCity && selectedState && (
          <div>
            <label className="block text-sm font-mono text-gray-600 uppercase tracking-wider mb-2">
              City (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCityChange(null)}
                className={`py-2 px-4 rounded text-sm font-sans font-medium transition-all ${
                  selectedCity === null
                    ? 'bg-tavern-blue-300 text-tavern-ink shadow-sm'
                    : 'bg-white text-tavern-ink border border-gray-300 hover:border-tavern-blue-300'
                }`}
              >
                All {selectedStateData?.name}
              </button>
              {selectedStateData?.cities.map(city => (
                <button
                  key={city}
                  onClick={() => onCityChange(city)}
                  className={`py-2 px-4 rounded text-sm font-sans font-medium transition-all ${
                    selectedCity === city
                      ? 'bg-tavern-blue-300 text-tavern-ink shadow-sm'
                      : 'bg-white text-tavern-ink border border-gray-300 hover:border-tavern-blue-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <p className="text-xs font-mono text-gray-500 mt-4">
          {selectedState === null
            ? 'Showing all federal-level candidates'
            : selectedCity
            ? `Showing candidates from ${selectedCity}, ${selectedState} and above`
            : `Showing candidates from ${selectedStateData?.name} and federal level`}
        </p>
      </div>
    </div>
  );
};
