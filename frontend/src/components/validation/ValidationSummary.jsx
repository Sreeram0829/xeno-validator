import React from 'react';
import { formatPercentage } from '../../utils/formatters.js';

/**
 * Validation Summary Component
 * Displays validation statistics in card format
 */
const ValidationSummary = ({ 
  summary, 
  stats, 
  onViewErrors, 
  showErrors = false 
}) => {
  if (!summary) {
    return (
      <div className="text-center py-8 text-gray-500">
        No validation data available
      </div>
    );
  }

  const total = summary.total || 0;
  const valid = summary.valid || 0;
  const invalid = summary.invalid || 0;
  const errorRate = summary.errorRate || 0;

  const statusColor = invalid === 0 ? 'green' : (valid === 0 ? 'red' : 'yellow');
  const statusLabel = invalid === 0 ? 'All Valid' : (valid === 0 ? 'All Invalid' : 'Partial');

  return (
    <div className="validation-summary">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Validation Summary
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${statusColor === 'green' ? 'bg-green-100 text-green-700' : 
            statusColor === 'red' ? 'bg-red-100 text-red-700' : 
            'bg-yellow-100 text-yellow-700'}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{total}</div>
          <div className="text-sm text-gray-500">Total Rows</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{valid}</div>
          <div className="text-sm text-gray-500">Valid Rows</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{invalid}</div>
          <div className="text-sm text-gray-500">Invalid Rows</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatPercentage(errorRate)}
          </div>
          <div className="text-sm text-gray-500">Error Rate</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Valid: {valid} rows</span>
          <span>Invalid: {invalid} rows</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? (valid / total * 100) : 0}%` }}
          ></div>
        </div>
      </div>

      {/* View Errors Button */}
      {invalid > 0 && (
        <div className="flex justify-end">
          <button
            onClick={onViewErrors}
            className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
          >
            {showErrors ? 'Hide Errors' : `View ${invalid} Errors`}
            <svg className={`w-4 h-4 transition-transform ${showErrors ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
      )}

      {/* Success Message */}
      {invalid === 0 && total > 0 && (
        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm flex items-center gap-2">
            <span>✅</span>
            All {total} rows passed validation! Perfect data quality.
          </p>
        </div>
      )}
    </div>
  );
};

export default ValidationSummary;