import React, { useState, useMemo } from 'react';
import { formatDate, truncate } from '../../utils/formatters.js';

/**
 * Error Table Component
 * Displays detailed error information in a table
 */
const ErrorTable = ({ errors, totalRows = 0 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  if (!errors || errors.length === 0) {
    return (
      <div className="text-center py-8 text-green-600">
        ✅ No errors found in this dataset
      </div>
    );
  }

  // Get unique error types for filter
  const errorTypes = useMemo(() => {
    const types = new Set();
    errors.forEach(err => {
      const type = err.type || err.errorType || 'Validation Error';
      types.add(type);
    });
    return ['all', ...Array.from(types)];
  }, [errors]);

  // Filter and search errors
  const filteredErrors = useMemo(() => {
    let filtered = errors;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(err => {
        const type = err.type || err.errorType || 'Validation Error';
        return type === filterType;
      });
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(err => {
        const message = err.message || err.errorMessage || '';
        const field = err.field || '';
        const data = JSON.stringify(err.data || {}).toLowerCase();
        return message.toLowerCase().includes(term) || 
               field.toLowerCase().includes(term) ||
               data.includes(term);
      });
    }

    return filtered;
  }, [errors, filterType, searchTerm]);

  // Paginate
  const totalPages = Math.ceil(filteredErrors.length / itemsPerPage);
  const paginatedErrors = filteredErrors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get error type badge color
  const getErrorTypeColor = (type) => {
    const colors = {
      'Validation Error': 'bg-red-100 text-red-700',
      'Phone Validation': 'bg-yellow-100 text-yellow-700',
      'Date Validation': 'bg-orange-100 text-orange-700',
      'Amount Validation': 'bg-pink-100 text-pink-700',
      'Email Validation': 'bg-purple-100 text-purple-700',
      'Required Field': 'bg-blue-100 text-blue-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="error-table">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-800">
            Error Details
          </h4>
          <span className="text-sm text-gray-500">
            ({filteredErrors.length} of {errors.length} errors)
          </span>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search errors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48"
          />

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {errorTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error count summary */}
      <div className="text-sm text-gray-500 mb-2">
        Showing {paginatedErrors.length} errors
        {totalRows > 0 && ` out of ${totalRows} total rows`}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Row</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Field</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Error Type</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Message</th>
              <th className="px-4 py-2 text-left text-gray-600 font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedErrors.map((error, index) => {
              const rowNumber = error.rowNumber || error.row || index + 1;
              const field = error.field || 'unknown';
              const type = error.type || error.errorType || 'Validation Error';
              const message = error.message || error.errorMessage || 'Validation failed';
              const value = error.value || '';

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700 font-mono text-xs">
                    {rowNumber}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {field}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-1 rounded ${getErrorTypeColor(type)}`}>
                      {type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-700 max-w-xs">
                    {truncate(message, 100)}
                  </td>
                  <td className="px-4 py-2 text-gray-600 font-mono text-xs">
                    {value ? truncate(String(value), 50) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredErrors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No matching errors found
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorTable;