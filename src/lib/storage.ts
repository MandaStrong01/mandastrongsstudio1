import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  assetId?: string;
}

export async function uploadFile(file: File, userId: string): Promise<UploadResult> {
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media-assets')
      .getPublicUrl(fileName);

    const assetType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('audio/')
      ? 'audio'
      : 'other';

    const { data: assetData, error: assetError } = await supabase
      .from('assets')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_type: file.type,
        file_url: publicUrl,
        file_size: file.size,
        asset_type: assetType,
        title: file.name,
      })
      .select()
      .single();

    if (assetError) {
      console.error('Asset DB error:', assetError);
      return { success: false, error: assetError.message };
    }

    return {
      success: true,
      fileUrl: publicUrl,
      assetId: assetData.id,
    };
  } catch (err) {
    console.error('Upload exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
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
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get assets error:', error);
    return [];
  }

  return data || [];
}
