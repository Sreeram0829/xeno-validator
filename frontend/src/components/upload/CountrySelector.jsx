import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';

/**
 * Country Selector Component
 * Dropdown for selecting country validation rules
 */
const CountrySelector = ({ onChange, disabled = false }) => {
  const { state, actions } = useAppContext();
  const [selectedCountry, setSelectedCountry] = useState(state.selectedCountry || 'IN');

  // Supported countries with their details
  const countries = [
    { code: 'IN', name: 'India', phoneExample: '9876543210', flag: '🇮🇳' },
    { code: 'SG', name: 'Singapore', phoneExample: '91234567', flag: '🇸🇬' },
    { code: 'US', name: 'United States', phoneExample: '1234567890', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', phoneExample: '7123456789', flag: '🇬🇧' },
    { code: 'AU', name: 'Australia', phoneExample: '412345678', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', phoneExample: '1234567890', flag: '🇨🇦' }
  ];

  // Get current country details
  const currentCountry = countries.find(c => c.code === selectedCountry) || countries[0];

  const handleChange = (e) => {
    const code = e.target.value;
    setSelectedCountry(code);
    actions.setCountry(code);
    if (onChange) {
      onChange(code);
    }
  };

  // Update when context changes
  useEffect(() => {
    if (state.selectedCountry && state.selectedCountry !== selectedCountry) {
      setSelectedCountry(state.selectedCountry);
    }
  }, [state.selectedCountry]);

  return (
    <div className="country-selector">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Select Country:
        </label>
        
        <div className="relative w-full sm:w-64">
          <select
            value={selectedCountry}
            onChange={handleChange}
            disabled={disabled}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name} ({country.code})
              </option>
            ))}
          </select>
          
          {/* Dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        {/* Country info */}
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            📱 {currentCountry.phoneExample}
          </span>
        </div>
      </div>

      {/* Validation rules info */}
      <div className="mt-2 text-xs text-gray-400">
        <span>Phone number validation will use <strong className="text-gray-500">{currentCountry.name}</strong> rules</span>
        <span className="mx-2">•</span>
        <span>Example: {currentCountry.phoneExample}</span>
      </div>
    </div>
  );
};

export default CountrySelector;