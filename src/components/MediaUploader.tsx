import { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, Cloud, Loader2, CheckCircle2, XCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile, UploadResult } from '../lib/storage';
import { initializeGoogleDrive, openGooglePicker, downloadGoogleDriveFile } from '../lib/googleDrive';

interface UploadItem {
  id: string;
  name: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  url?: string;
}

interface MediaUploaderProps {
  onUploadComplete?: (results: UploadResult[]) => void;
  onClose?: () => void;
}

export default function MediaUploader({ onUploadComplete, onClose }: MediaUploaderProps) {
  const { user } = useAuth();
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [googleDriveReady, setGoogleDriveReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    initializeGoogleDrive().then(setGoogleDriveReady);
  }, []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (!user) {
      alert('Please sign in to upload files');
      return;
    }

    const newItems: UploadItem[] = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      status: 'pending',
      progress: 0,
    }));

    setUploadItems(prev => [...prev, ...newItems]);

    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const itemId = newItems[i].id;

      setUploadItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, status: 'uploading' } : item
        )
      );

      const result = await uploadFile(
        file,
        user.id,
        (progress) => {
          setUploadItems(prev =>
            prev.map(item =>
              item.id === itemId ? { ...item, progress } : item
            )
          );
        }
      );

      results.push(result);

      setUploadItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? {
                ...item,
                status: result.success ? 'success' : 'error',
                progress: 100,
                error: result.error,
                url: result.fileUrl,
              }
            : item
        )
      );
    }

    if (onUploadComplete) {
      onUploadComplete(results);
    }
  };

  const handleUrlUpload = async () => {
    if (!urlInput.trim() || !user) return;

    const itemId = `${Date.now()}-${Math.random()}`;
    const newItem: UploadItem = {
      id: itemId,
      name: urlInput,
      status: 'uploading',
      progress: 0,
    };

    setUploadItems(prev => [...prev, newItem]);
    setUrlInput('');

    try {
      const response = await fetch(urlInput);
      if (!response.ok) throw new Error('Failed to fetch URL');

      const blob = await response.blob();
      const fileName = urlInput.split('/').pop() || 'downloaded-file';
      const file = new File([blob], fileName, { type: blob.type });

      setUploadItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, progress: 50 } : item
        )
      );

      const result = await uploadFile(file, user.id, (progress) => {
        setUploadItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, progress: 50 + progress / 2 } : item
          )
        );
      });

      setUploadItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? {
                ...item,
                status: result.success ? 'success' : 'error',
                progress: 100,
                error: result.error,
                url: result.fileUrl,
              }
            : item
        )
      );

      if (onUploadComplete && result.success) {
        onUploadComplete([result]);
      }
    } catch (error: any) {
      setUploadItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? {
                ...item,
                status: 'error',
                progress: 0,
                error: error.message,
              }
            : item
        )
      );
    }
  };

  const handleGoogleDrive = () => {
    if (!user) {
      alert('Please sign in to use Google Drive');
      return;
    }

    openGooglePicker(async (files) => {
      for (const file of files) {
        const itemId = `${Date.now()}-${Math.random()}`;
        const newItem: UploadItem = {
          id: itemId,
          name: file.name,
          status: 'uploading',
          progress: 0,
        };

        setUploadItems(prev => [...prev, newItem]);

        try {
          const blob = await downloadGoogleDriveFile(file.id, file.name, file.mimeType);
          const uploadFile_file = new File([blob], file.name, { type: file.mimeType });

          setUploadItems(prev =>
            prev.map(item =>
              item.id === itemId ? { ...item, progress: 50 } : item
            )
          );

          const result = await uploadFile(uploadFile_file, user.id, (progress) => {
            setUploadItems(prev =>
              prev.map(item =>
                item.id === itemId ? { ...item, progress: 50 + progress / 2 } : item
              )
            );
          });

          setUploadItems(prev =>
            prev.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    status: result.success ? 'success' : 'error',
                    progress: 100,
                    error: result.error,
                    url: result.fileUrl,
                  }
                : item
            )
          );

          if (onUploadComplete && result.success) {
            onUploadComplete([result]);
          }
        } catch (error: any) {
          setUploadItems(prev =>
            prev.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    status: 'error',
                    progress: 0,
                    error: error.message,
                  }
                : item
            )
          );
        }
      }
    });
  };

  const removeItem = (id: string) => {
    setUploadItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <h2 className="text-3xl font-bold text-white mb-6">Upload Media</h2>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all mb-6 ${
          isDragging
            ? 'border-blue-400 bg-blue-400/10'
            : 'border-white/20 hover:border-blue-400/50 hover:bg-white/5'
        }`}
      >
        <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">
          {isDragging ? 'Drop files here' : 'Drop files or click to browse'}
        </h3>
        <p className="text-white/60">
          All file types supported: Videos, Images, Audio, Documents, and more
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Import from URL</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlUpload()}
              placeholder="https://example.com/media.mp4"
              className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleUrlUpload}
              disabled={!urlInput.trim()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
            >
              Import
            </button>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Import from Cloud</h3>
          </div>
          <button
            onClick={handleGoogleDrive}
            disabled={!googleDriveReady}
            className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <Cloud className="w-4 h-4" />
            Google Drive & Photos
          </button>
        </div>
      </div>

      {uploadItems.length > 0 && (
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Upload Progress</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploadItems.map((item) => (
              <div
                key={item.id}
                className="bg-black/30 rounded-lg p-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate mb-1">
                    {item.name}
                  </p>
                  {item.status === 'uploading' && (
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.status === 'error' && (
                    <p className="text-red-400 text-xs">{item.error}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {item.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  )}
                  {item.status === 'success' && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                  {item.status === 'error' && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-white/10 rounded transition-all"
                    >
                      <XCircle className="w-5 h-5 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
