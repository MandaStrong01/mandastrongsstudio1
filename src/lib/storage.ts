import { supabase } from './supabase';
import { optimizeFile, getCachedTeam, setCachedTeam } from './compression';

function getAssetType(mimeType: string, fileName: string): string {
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';

  if (
    mimeType.includes('document') ||
    mimeType.includes('pdf') ||
    mimeType.includes('text') ||
    mimeType.includes('msword') ||
    mimeType.includes('wordprocessingml') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation')
  ) {
    return 'document';
  }

  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext) {
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v', 'mpg', 'mpeg'];
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'];
    const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'opus'];
    const documentExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv'];

    if (videoExts.includes(ext)) return 'video';
    if (imageExts.includes(ext)) return 'image';
    if (audioExts.includes(ext)) return 'audio';
    if (documentExts.includes(ext)) return 'document';
  }

  return 'other';
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  assetId?: string;
}

export interface UploadProgress {
  progress: number;
  fileName: string;
}

export async function getUserTeam(userId: string): Promise<string | null> {
  const cached = getCachedTeam(userId);
  if (cached !== undefined) {
    return cached;
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.email) return null;

  const { data, error } = await supabase
    .from('team_members')
    .select('team_id')
    .or(`user_id.eq.${userId},email.eq.${userData.user.email}`)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    setCachedTeam(userId, null);
    return null;
  }

  const teamId = data.team_id;
  setCachedTeam(userId, teamId);
  return teamId;
}

async function uploadWithRetry(
  fileName: string,
  file: File,
  maxRetries: number = 2
): Promise<{ data: any; error: any }> {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await supabase.storage
        .from('media-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream',
        });

      if (!result.error) {
        return result;
      }

      lastError = result.error;
    } catch (err) {
      lastError = err;
    }
  }

  return { data: null, error: lastError };
}

export async function uploadFile(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void,
  skipCompression: boolean = false
): Promise<UploadResult> {
  try {
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    if (onProgress) onProgress(10);

    const teamId = await getUserTeam(userId);
    const isVideo = file.type.startsWith('video/');
    const processedFile = (skipCompression || isVideo) ? file : await optimizeFile(file);

    if (onProgress) onProgress(20);

    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${userId}/${timestamp}_${sanitizedFileName}`;

    if (!fileName || fileName.trim() === '') {
      return {
        success: false,
        error: 'Invalid file path'
      };
    }

    const { data: uploadData, error: uploadError } = await uploadWithRetry(
      fileName,
      processedFile,
      2
    );

    if (onProgress) onProgress(70);

    if (uploadError) {
      console.error('Storage upload error:', {
        message: uploadError.message,
        fileName: file.name,
        fileSize: processedFile.size,
        fileType: file.type,
        error: uploadError
      });
      return {
        success: false,
        error: `Upload failed: ${uploadError.message || 'Unknown error'}`
      };
    }

    if (!uploadData?.path) {
      return {
        success: false,
        error: 'Upload succeeded but path is missing'
      };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media-assets')
      .getPublicUrl(fileName);

    const assetType = getAssetType(file.type, file.name);

    if (onProgress) onProgress(90);

    const { data: assetData, error: assetError } = await supabase
      .from('assets')
      .insert({
        user_id: userId,
        team_id: teamId,
        file_name: file.name,
        file_type: file.type,
        file_url: publicUrl,
        file_size: processedFile.size,
        asset_type: assetType,
        title: file.name,
      })
      .select()
      .single();

    if (onProgress) onProgress(100);

    if (assetError) {
      return { success: false, error: assetError.message };
    }

    return {
      success: true,
      fileUrl: publicUrl,
      assetId: assetData.id,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function uploadFiles(
  files: File[],
  userId: string,
  onProgress?: (fileName: string, progress: number) => void
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file =>
    uploadFile(file, userId, onProgress ? (p) => onProgress(file.name, p) : undefined)
  );

  return Promise.all(uploadPromises);
}

export async function deleteFile(assetId: string, filePath: string): Promise<boolean> {
  try {
    const { error: storageError } = await supabase.storage
      .from('media-assets')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      return false;
    }

    const { error: dbError } = await supabase
      .from('assets')
      .delete()
      .eq('id', assetId);

    if (dbError) {
      console.error('DB delete error:', dbError);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete exception:', err);
    return false;
  }
}

export async function getAssets(userId: string) {
  const teamId = await getUserTeam(userId);

  let query = supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (teamId) {
    query = query.or(`user_id.eq.${userId},team_id.eq.${teamId}`);
  } else {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Get assets error:', error);
    return [];
  }

  return data || [];
}
