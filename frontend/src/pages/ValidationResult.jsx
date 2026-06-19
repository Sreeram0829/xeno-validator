import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import { useValidation } from '../hooks/useValidation.js';
import { useFileDownload } from '../hooks/useFileDownload.js';
import ValidationSummary from '../components/validation/ValidationSummary.jsx';
import ErrorTable from '../components/validation/ErrorTable.jsx';
import DownloadButton from '../components/download/DownloadButton.jsx';
import Loader from '../components/common/Loader.jsx';

/**
 * Validation Result Page
 * Displays detailed validation results for a specific file
 */
const ValidationResult = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useAppContext();
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    summary,
    errors,
    stats,
    totalRows,
    validCount,
    errorCount,
    isProcessed,
    fetchSummary,
    fetchErrors,
    clearValidation
  } = useValidation();

  const {
    isDownloading,
    downloadCleaned,
    downloadErrors,
    downloadSummary,
    downloadReport,
    downloadAllChunks
  } = useFileDownload();

  useEffect(() => {
    if (fileId) {
      loadData();
    }
    // Cleanup on unmount
    return () => {
      clearValidation();
    };
  }, [fileId]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('📊 Loading validation results for fileId:', fileId);
      await fetchSummary(fileId);
      await fetchErrors(fileId);
      console.log('✅ Results loaded successfully');
    } catch (err) {
      console.error('❌ Error loading results:', err);
      setError(err.message || 'Failed to load validation results');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleErrors = () => {
    setShowErrors(!showErrors);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleDownloadCleaned = async () => {
    if (fileId) {
      await downloadCleaned(fileId);
    }
  };

  const handleDownloadErrors = async () => {
    if (fileId) {
      await downloadErrors(fileId);
    }
  };

  const handleDownloadSummary = async () => {
    if (fileId) {
      await downloadSummary(fileId);
    }
  };

  const handleDownloadReport = async () => {
    if (fileId) {
      await downloadReport(fileId);
    }
  };

  const handleDownloadChunks = async () => {
    if (fileId) {
      await downloadAllChunks(fileId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader text="Loading validation results..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg">❌ {error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700 text-lg">No validation results found for this file.</p>
          <p className="text-yellow-600 text-sm mt-2">File ID: {fileId}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="validation-result-page">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Validation Results
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Detailed validation report for your uploaded file
            </p>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border rounded hover:bg-gray-50 flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>

        {/* File ID Info */}
        {fileId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-700">
              <span className="font-medium">File ID:</span> 
              <span className="font-mono ml-2">{fileId}</span>
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <ValidationSummary
            summary={summary}
            stats={stats}
            onViewErrors={toggleErrors}
            showErrors={showErrors}
          />
        </div>

        {/* Error Table */}
        {showErrors && errors && errors.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <ErrorTable
              errors={errors}
              totalRows={totalRows}
            />
          </div>
        )}

        {/* No Errors Message */}
        {showErrors && (!errors || errors.length === 0) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
            <p className="text-green-600 text-lg">🎉 No validation errors found!</p>
            <p className="text-green-500 text-sm mt-1">All {totalRows} rows are valid</p>
          </div>
        )}

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{totalRows}</div>
            <div className="text-sm text-gray-500">Total Rows</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{validCount}</div>
            <div className="text-sm text-gray-500">Valid Rows</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-gray-500">Invalid Rows</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.successRate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Download Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DownloadButton
              label="Download Cleaned CSV"
              onClick={handleDownloadCleaned}
              isDownloading={isDownloading}
              icon="cleaned"
              variant="success"
            />
            {errorCount > 0 && (
              <DownloadButton
                label="Download Error Report"
                onClick={handleDownloadErrors}
                isDownloading={isDownloading}
                icon="errors"
                variant="danger"
              />
            )}
            <DownloadButton
              label="Download Summary (JSON)"
              onClick={handleDownloadSummary}
              isDownloading={isDownloading}
              icon="summary"
              variant="primary"
            />
            <DownloadButton
              label="Download Text Report"
              onClick={handleDownloadReport}
              isDownloading={isDownloading}
              icon="report"
              variant="secondary"
            />
            <DownloadButton
              label="Download All Chunks (ZIP)"
              onClick={handleDownloadChunks}
              isDownloading={isDownloading}
              icon="chunks"
              variant="primary"
            />
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationResult;