import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api.js';
import { formatFileSize, formatDate } from '../../utils/formatters.js';

/**
 * Chunk Report Component
 * Displays information about file chunks and allows individual downloads
 */
const ChunkReport = ({ fileId, onDownloadChunk }) => {
  const [chunks, setChunks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingChunk, setDownloadingChunk] = useState(null);

  useEffect(() => {
    if (fileId) {
      loadChunks();
    }
  }, [fileId]);

  const loadChunks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.get(`/download/chunks/info/${fileId}`);
      console.log('📦 Chunk response:', response);
      
      if (response.data && response.data.success) {
        const chunkData = response.data.data;
        if (chunkData.chunks && chunkData.chunks.length > 0) {
          setChunks(chunkData.chunks);
        } else {
          setChunks([]);
          setError('No chunks available for this file');
        }
      } else if (response.data && response.data.chunks) {
        setChunks(response.data.chunks);
      } else {
        setChunks([]);
        setError('No chunks available');
      }
    } catch (error) {
      console.error('Error loading chunks:', error);
      setError('Failed to load chunk information');
      setChunks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadChunk = async (chunkIndex) => {
    setDownloadingChunk(chunkIndex);
    try {
      if (onDownloadChunk) {
        await onDownloadChunk(chunkIndex);
      }
    } catch (error) {
      console.error('Error downloading chunk:', error);
      setError('Failed to download chunk');
    } finally {
      setDownloadingChunk(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4 text-gray-500">
        <div className="inline-block animate-spin mr-2">⏳</div>
        Loading chunk information...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-gray-500">
        {error}
      </div>
    );
  }

  if (!chunks || chunks.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No chunks available for this file. The file might be small or chunking is not enabled.
      </div>
    );
  }

  return (
    <div className="chunk-report">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">
          File Chunks
        </h4>
        <span className="text-sm text-gray-500">
          {chunks.length} chunks total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {chunks.map((chunk, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {chunk.name || `Chunk ${chunk.index || index + 1}`}
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  {chunk.size && (
                    <span>Size: {formatFileSize(chunk.size)}</span>
                  )}
                  {chunk.rows && (
                    <span>Rows: {chunk.rows}</span>
                  )}
                  {chunk.created && (
                    <span>Created: {formatDate(chunk.created)}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownloadChunk(chunk.index || index)}
              disabled={downloadingChunk === (chunk.index || index)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {downloadingChunk === (chunk.index || index) ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Downloading...
                </>
              ) : (
                <>
                  ⬇️ Download
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Download All Button */}
      {chunks.length > 1 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              if (window.confirm('Download all chunks as ZIP?')) {
                window.open(`http://localhost:5000/api/download/chunks/${fileId}`, '_blank');
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
          >
            📦 Download All Chunks (ZIP)
          </button>
        </div>
      )}
    </div>
  );
};

export default ChunkReport;