import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { useUpload } from '../hooks/useUpload.js';
import { useValidation } from '../hooks/useValidation.js';
import { useFileDownload } from '../hooks/useFileDownload.js';
import UploadSection from '../components/upload/UploadSection.jsx';
import CountrySelector from '../components/upload/CountrySelector.jsx';
import FilePreview from '../components/upload/FilePreview.jsx';
import ValidationSummary from '../components/validation/ValidationSummary.jsx';
import ErrorTable from '../components/validation/ErrorTable.jsx';
import ProgressBar from '../components/validation/ProgressBar.jsx';
import DownloadButton from '../components/download/DownloadButton.jsx';
import ChunkReport from '../components/download/ChunkReport.jsx';
import Loader from '../components/common/Loader.jsx';

/**
 * Home Page
 * Main page for file upload and validation
 */
const Home = () => {
  const { state, actions } = useAppContext();
  const [activeTab, setActiveTab] = useState('upload');
  const [showErrors, setShowErrors] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    file,
    fileId,
    isUploading,
    isUploaded,
    uploadProgress,
    handleFileSelect,
    uploadFile,
    clearFile,
    getFileInfo,
    hasFile,
    isComplete
  } = useUpload();

  const {
    summary,
    errors,
    stats,
    totalRows,
    validCount,
    errorCount,
    isLoading: isValidating,
    isProcessed,
    fetchSummary,
    fetchErrors
  } = useValidation();

  const {
    isDownloading,
    downloadProgress,
    downloadCleaned,
    downloadErrors,
    downloadAllChunks,
    downloadSummary,
    downloadReport,
    downloadChunk,
    reset: resetDownload
  } = useFileDownload();

  // Fetch results after upload is complete - with debug logging
  useEffect(() => {
    console.log('🔍 useEffect triggered:', { isUploaded, fileId, isProcessed });
    
    if (isUploaded && fileId && !isProcessed) {
      console.log('📊 Fetching results for fileId:', fileId);
      const fetchResults = async () => {
        try {
          setIsRefreshing(true);
          console.log('📊 Calling fetchSummary...');
          await fetchSummary(fileId);
          console.log('📊 Calling fetchErrors...');
          await fetchErrors(fileId);
          console.log('✅ Results fetched, switching to results tab');
          setActiveTab('results');
        } catch (error) {
          console.error('❌ Error fetching results:', error);
        } finally {
          setIsRefreshing(false);
        }
      };
      fetchResults();
    }
  }, [isUploaded, fileId, isProcessed, fetchSummary, fetchErrors]);

  const handleUploadClick = async () => {
    console.log('🚀 Upload clicked');
    const result = await uploadFile();
    console.log('📤 Upload result:', result);
    // The useEffect will handle switching to results tab
  };

  const handleRefreshResults = async () => {
    if (fileId) {
      console.log('🔄 Manually refreshing results for:', fileId);
      setIsRefreshing(true);
      try {
        await fetchSummary(fileId);
        await fetchErrors(fileId);
        setActiveTab('results');
      } catch (error) {
        console.error('❌ Refresh error:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleClear = () => {
    clearFile();
    setActiveTab('upload');
    resetDownload();
    actions.reset();
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

  const handleDownloadChunks = async () => {
    if (fileId) {
      await downloadAllChunks(fileId);
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

  const handleDownloadChunk = async (chunkIndex) => {
    if (fileId) {
      await downloadChunk(chunkIndex, fileId);
    }
  };

  const toggleErrors = () => {
    setShowErrors(!showErrors);
  };

  // Debug log for state
  console.log('📊 Home state:', { 
    fileId, 
    isUploaded, 
    isProcessed, 
    hasSummary: !!summary,
    isValidating,
    isRefreshing
  });

  return (
    <div className="home-page">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Transaction Data Validator
          </h1>
          <p className="text-gray-600">
            Upload your CSV file to validate, clean, and process transaction data
          </p>
        </div>

        {/* File ID Display */}
        {fileId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center">
            <p className="text-sm text-blue-700">
              <span className="font-medium">File ID:</span> 
              <span className="font-mono ml-2">{fileId}</span>
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'results'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('results')}
            disabled={!isUploaded && !fileId}
          >
            Results
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'download'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('download')}
            disabled={!isProcessed && !fileId}
          >
            Download
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Country Selector */}
            <div className="bg-white rounded-lg shadow p-6">
              <CountrySelector />
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <UploadSection
                onFileSelect={handleFileSelect}
                isUploading={isUploading}
                isUploaded={isUploaded}
              />
            </div>

            {/* File Preview */}
            {hasFile && (
              <div className="bg-white rounded-lg shadow p-6">
                <FilePreview
                  fileInfo={getFileInfo()}
                  onClear={handleClear}
                  onUpload={handleUploadClick}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              </div>
            )}

            {/* Progress Bar */}
            {isUploading && (
              <div className="bg-white rounded-lg shadow p-6">
                <ProgressBar
                  progress={uploadProgress}
                  label="Uploading..."
                  status="uploading"
                />
              </div>
            )}

            {/* Error Display */}
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{state.error}</p>
              </div>
            )}

            {/* Success Message */}
            {state.successMessage && !isUploading && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600">{state.successMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* File ID Info */}
            {fileId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">File ID:</span> 
                  <span className="font-mono ml-2">{fileId}</span>
                </p>
              </div>
            )}

            {/* Validation Summary */}
            {summary ? (
              <div className="bg-white rounded-lg shadow p-6">
                <ValidationSummary
                  summary={summary}
                  stats={stats}
                  onViewErrors={toggleErrors}
                  showErrors={showErrors}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                {isValidating || isRefreshing || isUploading ? (
                  <div className="text-center py-8">
                    <Loader text="Processing validation results..." />
                  </div>
                ) : isUploaded ? (
                  <div className="text-center py-8">
                    <p className="text-yellow-600 mb-4">Waiting for validation results...</p>
                    <button
                      onClick={handleRefreshResults}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      🔄 Refresh Results
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No validation results available. Please upload a file first.</p>
                  </div>
                )}
              </div>
            )}

            {/* Error Table */}
            {showErrors && errors && errors.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <ErrorTable
                  errors={errors}
                  totalRows={totalRows}
                />
              </div>
            )}

            {/* Quick Actions - Only show if processed */}
            {isProcessed && summary && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab('download')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    📥 Download Files
                  </button>
                  <button
                    onClick={handleDownloadCleaned}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={isDownloading}
                  >
                    📄 Download Cleaned Data
                  </button>
                  {errorCount > 0 && (
                    <button
                      onClick={handleDownloadErrors}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={isDownloading}
                    >
                      ⚠️ Download Error Report
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Download Tab */}
        {activeTab === 'download' && (
          <div className="space-y-6">
            {/* File ID Info */}
            {fileId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">File ID:</span> 
                  <span className="font-mono ml-2">{fileId}</span>
                </p>
              </div>
            )}

            {/* Download Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Download Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Chunk Report */}
            {fileId && (
              <div className="bg-white rounded-lg shadow p-6">
                <ChunkReport
                  fileId={fileId}
                  onDownloadChunk={handleDownloadChunk}
                />
              </div>
            )}

            {/* Download Progress */}
            {isDownloading && (
              <div className="bg-white rounded-lg shadow p-6">
                <ProgressBar
                  progress={downloadProgress}
                  label="Downloading..."
                  status="downloading"
                />
              </div>
            )}

            {/* File Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">File Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">File ID:</span>
                  <span className="ml-2 font-mono text-gray-800 truncate block">{fileId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total Rows:</span>
                  <span className="ml-2 font-medium text-gray-800">{totalRows || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Valid Rows:</span>
                  <span className="ml-2 font-medium text-green-600">{validCount || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">Invalid Rows:</span>
                  <span className="ml-2 font-medium text-red-600">{errorCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={() => setActiveTab('results')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;