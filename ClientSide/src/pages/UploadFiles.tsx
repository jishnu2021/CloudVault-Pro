import { useState, useRef, useEffect, useMemo } from 'react';

type UserType = {
  id: number;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  credits?: number;
};

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  type: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  cloudinaryUrl?: string;
}

interface ExistingFile {
  id: number;
  user_id: number;
  name: string;
  original_name: string;
  cloudinary_url: string;
  size: number;
  mime_type: string;
  created_at: number;
}

function UploadFiles({ userval }: { userval: string | null }) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentCredits, setCurrentCredits] = useState<number>(0);

  const parsedUser = useMemo<UserType | null>(() => {
    if (!userval) return null;
    try {
      return JSON.parse(userval);
    } catch {
      return null;
    }
  }, [userval]);
  useEffect(() => {
    if (parsedUser?.id) {
      fetchExistingFiles();
      fetchUserCredits();
      const interval = setInterval(fetchUserCredits, 5000);
      return () => clearInterval(interval);
    }
  }, [parsedUser]);

  const fetchExistingFiles = async () => {
    try {
      if (!parsedUser?.id) {
        setError('User not authenticated');
        return;
      }

      setLoading(true);
      const response = await fetch(`https://cloudvault-pro.onrender.com/user/${parsedUser.id}/files?page=1&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setExistingFiles(data.files || []);
      } else {
        setError('Failed to fetch existing files');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Error fetching files: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCredits = async () => {
    if (!parsedUser?.id) return;
      
    try {
      console.log('Fetching user credits for ID:', parsedUser.id);
      const response = await fetch(`https://cloudvault-pro.onrender.com/user/${parsedUser.id}/credits`);
      if (response.ok) {
        const data = await response.json();
        const newCredits = data.credits || 0;
        setCurrentCredits(newCredits);
      }
    } catch (error) {
      console.error('Failed to fetch user credits:', error);
    }
  };

  const uploadFileToServer = async (file: File, fileId: number) => {
    if (!parsedUser?.id) {
      throw new Error('User not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadedFiles(prev => 
              prev.map(f => f.id === fileId ? { ...f, progress, status: 'uploading' } : f)
            );
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200 || xhr.status === 201) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.success) {
                setUploadedFiles(prev => 
                  prev.map(f => f.id === fileId ? { 
                    ...f, 
                    progress: 100, 
                    status: 'completed',
                    cloudinaryUrl: response.file.cloudinary_url
                  } : f)
                );
                // Refresh existing files list
                fetchExistingFiles();
                resolve(response);
              } else {
                throw new Error(response.message || 'Upload failed');
              }
            } catch (e) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`HTTP Error: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
        });

        xhr.open('POST', `https://cloudvault-pro.onrender.com/user/${parsedUser.id}/upload`);
        xhr.send(formData);
      });
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, status: 'error' } : f)
      );
      throw error;
    }
  };

  const handleFileSelect = async (files: FileList | File[] | null) => {
    if (!files) return;

    const fileArray: File[] = Array.from(files);
    const newFiles: File[] = fileArray.slice(0, remainingFiles);
    
    const processedFiles: UploadedFile[] = newFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      file: file,
      progress: 0,
      status: 'pending'
    }));

    setUploadedFiles((prev: UploadedFile[]) => [...prev, ...processedFiles]);
    
    // Upload files to server
    for (const fileObj of processedFiles) {
      try {
        await uploadFileToServer(fileObj.file, fileObj.id);
      } catch (error) {
        console.error(`Failed to upload ${fileObj.name}:`, error);
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f)
        );
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles((prev: UploadedFile[]) => prev.filter((file: UploadedFile) => file.id !== fileId));
  };

  const deleteExistingFile = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      if (!parsedUser?.id) {
        setError('User not authenticated');
        return;
      }

      const response = await fetch(`https://cloudvault-pro.onrender.com/user/${parsedUser.id}/files/${fileId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setExistingFiles(prev => prev.filter(file => file.id !== fileId));
      } else {
        setError('Failed to delete file');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError('Error deleting file: ' + errorMessage);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files: FileList = e.dataTransfer.files;
    if (files.length > 0 && remainingFiles > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    return '📁';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Add early return for unauthenticated user
  if (!parsedUser?.id) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to upload files.</p>
          </div>
        </div>
      </div>
    );
  }

  const maxFiles = currentCredits;
  const remainingFiles = Math.max(0, maxFiles - uploadedFiles.length);

  console.log('====================================');
  console.log(parsedUser.id);
  console.log('====================================');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Upload Files
        </h1>
        <p className="text-gray-600 text-lg">
          Share your files easily and securely. Maximum {maxFiles} files allowed per session.
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError('')} className="btn btn-sm">×</button>
        </div>
      )}

      {/* Upload Limit Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-blue-600 shrink-0 w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-blue-800">
            <strong>{remainingFiles}</strong> file{remainingFiles !== 1 ? 's' : ''} remaining out of {maxFiles} maximum for this session
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : remainingFiles > 0 
                  ? 'border-gray-300 hover:border-blue-500 hover:bg-gray-50' 
                  : 'border-red-300 bg-red-50 cursor-not-allowed'
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={remainingFiles > 0 ? openFileDialog : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={remainingFiles === 0}
            />
            
            <div className="space-y-4">
              {remainingFiles > 0 ? (
                <>
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Drop files here</h3>
                    <p className="text-gray-500 mb-4">or click to browse from your device</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Choose Files
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-red-600">Upload limit reached</h3>
                    <p className="text-gray-500">You have reached the maximum of {maxFiles} files per session. Remove some files to upload more.</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 text-sm text-gray-400">
              Supported formats: Images, Documents, Videos, Audio files (Max: 10MB each)
            </div>
          </div>
        </div>

        {/* Current Upload Session */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Current Upload Session</h3>
            {uploadedFiles.length > 0 && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {uploadedFiles.length}/{maxFiles}
              </div>
            )}
          </div>

          {uploadedFiles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border">
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-600">No files in current session</h4>
                <p className="text-sm text-gray-400 mt-2">Upload files to see them listed here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="bg-white rounded-xl shadow-md border hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{getFileIcon(file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate">{file.name}</h4>
                          <div className="flex items-center gap-2">
                            {file.status === 'completed' && file.cloudinaryUrl && (
                              <a
                                href={file.cloudinaryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                View
                              </a>
                            )}
                            <button
                              onClick={() => removeFile(file.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <span>{file.size}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            file.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            file.status === 'uploading' ? 'bg-yellow-100 text-yellow-800' : 
                            file.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {file.status === 'completed' ? '✓ Complete' : 
                             file.status === 'uploading' ? 'Uploading...' : 
                             file.status === 'error' ? '✗ Error' :
                             'Pending'}
                          </span>
                        </div>
                        {file.status !== 'pending' && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                file.status === 'completed' ? 'bg-green-500' : 
                                file.status === 'error' ? 'bg-red-500' : 
                                'bg-yellow-500'
                              }`}
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Existing Files */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Your Uploaded Files</h3>
          <button
            onClick={fetchExistingFiles}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {existingFiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border">
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-600">No files uploaded yet</h4>
              <p className="text-sm text-gray-400 mt-2">Your uploaded files will appear here</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingFiles.map((file) => (
              <div key={file.id} className="bg-white rounded-xl shadow-md border hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getFileIcon(file.mime_type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate mb-1">{file.original_name}</h4>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>{formatFileSize(file.size)}</p>
                        <p>Uploaded: {formatDate(file.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <a
                          href={file.cloudinary_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200"
                        >
                          View
                        </a>
                        <button
                          onClick={() => deleteExistingFile(file.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadFiles;