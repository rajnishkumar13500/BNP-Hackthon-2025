import React, { useState, useRef } from 'react';
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div
      className={`fixed top-6 right-6 animate-slide-in ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="ml-3 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const dropRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };
  const allowedExtensions = ['json', 'csv', 'xlsx', 'xml', 'pdf'];
  const allowedMimeTypes = [
    'application/json',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/xml',
    'text/xml',
    'application/pdf',
  ];
  const MAX_SIZE_MB = 120;

  const validateFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      showToast('Unsupported file type selected.', 'error');
      return false;
    }
    if (!allowedMimeTypes.includes(file.type)) {
      showToast('Unsupported file format.', 'error');
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast(`File must be under ${MAX_SIZE_MB} MB.`, 'error');
      return false;
    }
    return true;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      showToast(`Selected file: ${file.name}`, 'info');
    } else {
      setSelectedFile(null);
      event.target.value = '';
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      showToast(`Selected file: ${file.name}`, 'info');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropRef.current.classList.add('border-blue-400');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dropRef.current.classList.remove('border-blue-400');
  };

  const handleUpload = () => {
    if (!selectedFile) {
      showToast('Please select a file first', 'error');
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/upload');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        setSelectedFile(null);
        setUploadProgress(0);
        document.getElementById('file-input').value = '';
        showToast('Upload successful!', 'success');
      } else {
        showToast(`Upload failed: ${xhr.statusText}`, 'error');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      showToast('Upload failed: Network error', 'error');
    };

    xhr.send(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">File Upload</h2>

      <div
        ref={dropRef}
        className="border-2 border-dashed border-gray-300 rounded-md py-10 px-4 mb-4 text-center transition-colors duration-200 cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        aria-label="Drop files here or click to select"
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".json,.csv,.xlsx,.xml,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <p className="text-gray-700 font-medium mb-2">
          Drag &amp; drop file here, or <span className="underline text-blue-500">browse</span>
        </p>
        <p className="text-gray-400 text-xs">
          Only JSON, CSV, XLSX, XML, PDF • Max {MAX_SIZE_MB} MB
        </p>
      </div>

      {selectedFile && (
        <div className="bg-gray-50 rounded-md p-4 mb-4 animate-fade-in">
          <p className="text-sm text-gray-800 font-medium mb-1">{selectedFile.name}</p>
          <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      {uploading && (
        <div
          className="w-full h-3 bg-gray-200 rounded-full mb-4 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={uploadProgress}
        >
          <div
            className="h-3 bg-blue-500 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
          !selectedFile || uploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
        aria-disabled={!selectedFile || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default Upload;
