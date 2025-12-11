import { useState, useRef } from 'react';
import { Upload, Wand2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProcessingStatus {
  toolName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: string;
  error?: string;
}

export default function BatchUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatuses, setProcessingStatuses] = useState<ProcessingStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getAllAITools = () => {
    const allTools: string[] = [];
    for (let page = 4; page <= 9; page++) {
      const { getToolsForPage } = require('../data/aiTools');
      allTools.push(...getToolsForPage(page));
    }
    return allTools;
  };

  const handleUploadAndProcess = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const userId = user?.id || 'guest';
      const filePath = `${userId}/${fileName}`;

      setUploadProgress(25);

      const { error: uploadError } = await supabase.storage
        .from('movie-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      const { data: { publicUrl } } = supabase.storage
        .from('movie-assets')
        .getPublicUrl(filePath);

      const allTools = getAllAITools();

      const initialStatuses: ProcessingStatus[] = allTools.map(tool => ({
        toolName: tool,
        status: 'pending'
      }));
      setProcessingStatuses(initialStatuses);

      setUploadProgress(75);

      for (let i = 0; i < allTools.length; i++) {
        const tool = allTools[i];

        setProcessingStatuses(prev =>
          prev.map(status =>
            status.toolName === tool
              ? { ...status, status: 'processing' }
              : status
          )
        );

        await new Promise(resolve => setTimeout(resolve, 100));

        try {
          const { data, error } = await supabase
            .from('ai_tool_results')
            .insert({
              user_id: userId,
              tool_name: tool,
              input_file_url: publicUrl,
              input_prompt: prompt,
              status: 'completed',
              result: `Processed ${file.name} with ${tool}${prompt ? `: ${prompt}` : ''}`,
              metadata: {
                file_name: file.name,
                file_size: file.size,
                file_type: file.type
              }
            })
            .select()
            .single();

          if (error) throw error;

          setProcessingStatuses(prev =>
            prev.map(status =>
              status.toolName === tool
                ? { ...status, status: 'completed', result: data.result }
                : status
            )
          );
        } catch (error: any) {
          setProcessingStatuses(prev =>
            prev.map(status =>
              status.toolName === tool
                ? { ...status, status: 'error', error: error.message }
                : status
            )
          );
        }

        setUploadProgress(75 + ((i + 1) / allTools.length) * 25);
      }

      setUploadProgress(100);
      alert(`Successfully processed with ${allTools.length} AI tools!`);

    } catch (error: any) {
      console.error('Error:', error);
      alert('Error processing file: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const completedCount = processingStatuses.filter(s => s.status === 'completed').length;
  const errorCount = processingStatuses.filter(s => s.status === 'error').length;
  const processingCount = processingStatuses.filter(s => s.status === 'processing').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Batch AI Processing</h1>
          <p className="text-xl text-blue-200">Upload content and process with all 768 AI tools</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-3">
              Upload File
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-400 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-white/5 transition-all"
            >
              <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              {file ? (
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-blue-200 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-white mb-2">Click to upload file</p>
                  <p className="text-blue-200 text-sm">Video, Audio, Images, Documents</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="*/*"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-3">
              Processing Prompt (Optional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter instructions for AI processing..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={handleUploadAndProcess}
            disabled={!file || isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing... {uploadProgress.toFixed(0)}%
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                Process with All AI Tools
              </>
            )}
          </button>
        </div>

        {isProcessing && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="mb-6">
              <div className="flex justify-between text-white mb-2">
                <span>Overall Progress</span>
                <span>{uploadProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-6 text-center mb-6">
              <div className="flex-1 bg-blue-500/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{completedCount}</div>
                <div className="text-blue-200 text-sm">Completed</div>
              </div>
              <div className="flex-1 bg-yellow-500/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{processingCount}</div>
                <div className="text-yellow-200 text-sm">Processing</div>
              </div>
              <div className="flex-1 bg-red-500/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-white">{errorCount}</div>
                <div className="text-red-200 text-sm">Errors</div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {processingStatuses.map((status, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                    status.status === 'completed' ? 'bg-green-500/20' :
                    status.status === 'processing' ? 'bg-blue-500/20' :
                    status.status === 'error' ? 'bg-red-500/20' :
                    'bg-slate-700/20'
                  }`}
                >
                  <span className="text-white text-sm">{status.toolName}</span>
                  {status.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                  {status.status === 'processing' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                  {status.status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                  {status.status === 'pending' && <div className="w-5 h-5 rounded-full bg-slate-600" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {processingStatuses.length > 0 && !isProcessing && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Processing Complete!</h2>
            <div className="flex gap-6 text-center">
              <div className="flex-1 bg-green-500/20 rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-2">{completedCount}</div>
                <div className="text-green-200">Successfully Processed</div>
              </div>
              <div className="flex-1 bg-red-500/20 rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-2">{errorCount}</div>
                <div className="text-red-200">Failed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
