import { ArrowLeft, Upload, Sparkles, File, Image, Video, Music, FileText, Check, Cloud, Link } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile } from '../lib/storage';
import { initializeGoogleDrive, openGooglePicker, downloadGoogleDriveFile } from '../lib/googleDrive';
import Footer from '../components/Footer';
import QuickAccess from '../components/QuickAccess';
import GrokChat from '../components/GrokChat';

interface Page22Props {
  onNavigate: (page: number) => void;
  toolName?: string;
  mode?: 'upload' | 'create';
}

export default function Page22({ onNavigate, toolName = "AI Tool", mode = "upload" }: Page22Props) {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [googleDriveReady, setGoogleDriveReady] = useState(false);
  const [showUrlImport, setShowUrlImport] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  useEffect(() => {
    initializeGoogleDrive().then(ready => {
      setGoogleDriveReady(ready);
    });
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleFiles = async (files: File[]) => {
    if (!user) {
      alert('Please sign in to upload files');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadFile(file, user.id));
      const results = await Promise.all(uploadPromises);

      const successfulFiles = results
        .filter(r => r.success)
        .map((_, i) => files[i].name);

      setUploadedFiles(prev => [...prev, ...successfulFiles]);

      const failedCount = results.filter(r => !r.success).length;
      if (failedCount > 0) {
        alert(`${successfulFiles.length} of ${files.length} files uploaded successfully`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleGooglePhotos = () => {
    if (!user) {
      alert('Please sign in to upload files');
      return;
    }

    openGooglePicker(async (selectedFiles) => {
      setUploading(true);
      try {
        const uploadPromises = selectedFiles.map(async (file) => {
          const blob = await downloadGoogleDriveFile(file.id, file.name, file.mimeType);
          const fileObj = new File([blob], file.name, { type: file.mimeType });
          return uploadFile(fileObj, user.id);
        });

        const results = await Promise.all(uploadPromises);
        const successfulFiles = results
          .filter(r => r.success)
          .map((_, i) => selectedFiles[i].name);

        setUploadedFiles(prev => [...prev, ...successfulFiles]);

        const failedCount = results.filter(r => !r.success).length;
        if (failedCount > 0) {
          alert(`${successfulFiles.length} of ${selectedFiles.length} files uploaded successfully`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload files from Google Photos');
      } finally {
        setUploading(false);
      }
    });
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlImport = async () => {
    if (!user) {
      alert('Please sign in to upload files');
      return;
    }

    if (!importUrl.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    if (!isValidUrl(importUrl)) {
      alert('Please enter a valid URL (e.g., https://example.com/image.jpg)');
      return;
    }

    setUploading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(importUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.status === 404) {
        alert('File not found (404). Please check the URL and try again.');
        setUploading(false);
        return;
      }

      if (response.status === 403) {
        alert('Access denied (403). The file may not be publicly accessible or CORS restrictions apply.');
        setUploading(false);
        return;
      }

      if (!response.ok) {
        alert(`Server error (${response.status}). Please try again later.`);
        setUploading(false);
        return;
      }

      const blob = await response.blob();
      const urlObj = new URL(importUrl);
      const filename = urlObj.pathname.split('/').pop() || 'imported-file';
      const fileObj = new File([blob], filename, { type: blob.type });

      const result = await uploadFile(fileObj, user.id);

      if (result.success) {
        setUploadedFiles(prev => [...prev, filename]);
        setImportUrl('');
        setShowUrlImport(false);
      } else {
        alert('Failed to upload file. Please try again.');
      }
    } catch (error) {
      if (error instanceof TypeError) {
        alert('Network error or CORS issue. Make sure the URL is publicly accessible and allows cross-origin requests.');
      } else if ((error as Error).name === 'AbortError') {
        alert('Request timed out. The file may be too large or the server is not responding.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to import file: ${errorMessage}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4c1d95]/20 via-black to-[#4c1d95]/20 text-white flex flex-col">
      <div className="flex-1 flex flex-col px-4 py-6">
        <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <button
              onClick={() => onNavigate(4)}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-black border border-[#6d28d9]/50 hover:bg-[#4c1d95]/50 rounded-lg transition-all w-full md:w-auto justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Tools
            </button>
            <h1 className="text-2xl md:text-4xl font-black text-[#a78bfa] text-center flex-1">{toolName}</h1>
            <div className="hidden md:block md:w-32"></div>
          </div>

          <div className="flex-1 bg-black/30 backdrop-blur-sm border-2 border-[#6d28d9]/30 rounded-2xl p-8">
            {mode === 'upload' ? (
              <div className="h-full flex flex-col">
                <div className="text-center mb-6">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-[#a78bfa]" />
                  <h2 className="text-3xl font-bold mb-2">Upload Your Asset</h2>
                  <p className="text-white/70">Drag and drop your file here or click to browse</p>
                </div>

                <div className="mb-6">
                  <p className="text-center text-sm text-white/60 mb-3">Import from cloud storage:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={handleGooglePhotos}
                      disabled={!googleDriveReady || uploading}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5b21b6] to-[#5b21b6] hover:from-[#5b21b6] hover:to-[#5b21b6] disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-all text-sm"
                    >
                      <Cloud className="w-4 h-4" />
                      Google Photos
                    </button>
                    <button
                      onClick={handleGooglePhotos}
                      disabled={!googleDriveReady || uploading}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5b21b6] to-[#5b21b6] hover:from-[#5b21b6] hover:to-[#5b21b6] disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-all text-sm"
                    >
                      <Cloud className="w-4 h-4" />
                      Google Drive
                    </button>
                    <button
                      onClick={() => setShowUrlImport(!showUrlImport)}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5b21b6] to-[#5b21b6] hover:from-[#5b21b6] hover:to-[#5b21b6] disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-all text-sm"
                    >
                      <Link className="w-4 h-4" />
                      Import from URL
                    </button>
                  </div>

                  {showUrlImport && (
                    <div className="mt-4 p-4 bg-black/30 border border-[#a78bfa]/30 rounded-lg">
                      <input
                        type="url"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-black/50 border border-[#a78bfa]/50 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#a78bfa] mb-3"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUrlImport();
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUrlImport}
                          disabled={uploading || !importUrl.trim()}
                          className="flex-1 px-4 py-2 bg-[#5b21b6] hover:bg-[#5b21b6] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all text-sm"
                        >
                          Import
                        </button>
                        <button
                          onClick={() => {
                            setShowUrlImport(false);
                            setImportUrl('');
                          }}
                          className="px-4 py-2 bg-black/50 border border-white/20 hover:bg-white/10 rounded-lg font-semibold transition-all text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-center text-xs text-white/50 mt-2">Or use the upload area below for local files</p>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`flex-1 border-2 border-dashed rounded-xl flex items-center justify-center transition-all ${
                    dragActive
                      ? 'border-[#a78bfa] bg-[#4c1d95]/20'
                      : 'border-[#6d28d9]/50 hover:border-[#a78bfa]'
                  } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  {uploading ? (
                    <div className="text-center">
                      <div className="animate-spin w-16 h-16 border-4 border-[#5b21b6] border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-lg text-white/90">Uploading files...</p>
                      <p className="text-sm text-white/60 mt-2">Please wait</p>
                    </div>
                  ) : uploadedFiles.length > 0 ? (
                    <div className="text-center w-full p-8">
                      <Check className="w-16 h-16 mx-auto mb-4 text-[#a78bfa]" />
                      <p className="text-lg text-white/90 mb-4">{uploadedFiles.length} file(s) uploaded successfully!</p>
                      <div className="max-h-48 overflow-y-auto mb-4">
                        {uploadedFiles.map((filename, i) => (
                          <div key={i} className="flex items-center gap-2 justify-center py-1">
                            <Check className="w-4 h-4 text-[#a78bfa]" />
                            <span className="text-sm text-white/70">{filename}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setUploadedFiles([])}
                        className="px-6 py-2 bg-[#5b21b6] hover:bg-[#6d28d9] rounded-lg font-semibold transition-all"
                      >
                        Upload More Files
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center">
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
                        <div className="p-4 bg-[#4c1d95]/20 rounded-lg">
                          <Video className="w-8 h-8 mx-auto text-[#a78bfa] mb-2" />
                          <p className="text-xs text-white/70">Video</p>
                        </div>
                        <div className="p-4 bg-[#4c1d95]/20 rounded-lg">
                          <Image className="w-8 h-8 mx-auto text-[#a78bfa] mb-2" />
                          <p className="text-xs text-white/70">Image</p>
                        </div>
                        <div className="p-4 bg-[#4c1d95]/20 rounded-lg">
                          <Music className="w-8 h-8 mx-auto text-[#a78bfa] mb-2" />
                          <p className="text-xs text-white/70">Audio</p>
                        </div>
                        <div className="p-4 bg-[#4c1d95]/20 rounded-lg">
                          <FileText className="w-8 h-8 mx-auto text-[#a78bfa] mb-2" />
                          <p className="text-xs text-white/70">Document</p>
                        </div>
                        <div className="p-4 bg-[#4c1d95]/20 rounded-lg">
                          <File className="w-8 h-8 mx-auto text-[#a78bfa] mb-2" />
                          <p className="text-xs text-white/70">Other</p>
                        </div>
                      </div>
                      <p className="text-lg text-white/90 mb-2">Click to select files</p>
                      <p className="text-sm text-white/60">or drag and drop them here</p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        multiple
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    onClick={() => onNavigate(11)}
                    disabled={uploadedFiles.length === 0 && !uploading}
                    className="px-8 py-3 bg-[#5b21b6] hover:bg-[#6d28d9] disabled:bg-[#4c1d95] disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
                  >
                    Go to Media Box
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="text-center mb-8">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#a78bfa]" />
                  <h2 className="text-3xl font-bold mb-2">Create with AI</h2>
                  <p className="text-white/70">Generate a new asset using AI</p>
                </div>

                <div className="flex-1 bg-[#4c1d95]/10 border border-[#6d28d9]/30 rounded-xl p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Asset Description</label>
                      <textarea
                        placeholder="Describe what you want to create..."
                        className="w-full h-32 bg-black/50 border border-[#6d28d9]/50 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Style</label>
                        <select className="w-full bg-black/50 border border-[#6d28d9]/50 rounded-lg p-3 text-white focus:outline-none focus:border-[#a78bfa]">
                          <option>Cinematic</option>
                          <option>Realistic</option>
                          <option>Artistic</option>
                          <option>Abstract</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Quality</label>
                        <select className="w-full bg-black/50 border border-[#6d28d9]/50 rounded-lg p-3 text-white focus:outline-none focus:border-[#a78bfa]">
                          <option>Standard</option>
                          <option>High</option>
                          <option>Ultra</option>
                        </select>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-[#5b21b6] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#a78bfa] rounded-lg font-bold text-lg transition-all">
                      Generate Asset
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    onClick={() => onNavigate(11)}
                    className="px-8 py-3 bg-[#5b21b6] hover:bg-[#6d28d9] rounded-lg font-semibold transition-all"
                  >
                    Save to Media Box
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickAccess onNavigate={onNavigate} />
      <GrokChat onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
