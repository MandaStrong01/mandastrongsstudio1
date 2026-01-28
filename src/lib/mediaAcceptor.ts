import { supabase } from './supabase';
import { uploadFile } from './storage';
import { isVideoFile, extractVideoMetadata } from './videoDetection';

export interface MediaSource {
  type: 'upload' | 'download' | 'generated' | 'toolboard' | 'url';
  file?: File;
  url?: string;
  name: string;
  metadata?: any;
}

export interface AcceptedMedia {
  id: string;
  file_url: string;
  file_name: string;
  asset_type: string;
  metadata?: any;
}

export async function acceptMedia(source: MediaSource, userId: string): Promise<AcceptedMedia | null> {
  try {
    let file: File | null = null;
    let fileName = source.name;
    let metadata: any = {};

    if (source.file) {
      file = source.file;
    } else if (source.url) {
      file = await downloadFromUrl(source.url, fileName);
    }

    if (!file) {
      throw new Error('No file to process');
    }

    if (isVideoFile(file)) {
      metadata = await extractVideoMetadata(file);
    }

    const result = await uploadFile(file, userId);

    if (!result.success || !result.assetId) {
      throw new Error(result.error || 'Upload failed');
    }

    if (Object.keys(metadata).length > 0) {
      await supabase
        .from('assets')
        .update({ metadata })
        .eq('id', result.assetId);
    }

    const { data: asset } = await supabase
      .from('assets')
      .select('*')
      .eq('id', result.assetId)
      .single();

    if (asset) {
      return {
        id: asset.id,
        file_url: asset.file_url,
        file_name: asset.file_name,
        asset_type: asset.asset_type,
        metadata: asset.metadata,
      };
    }

    return null;
  } catch (error) {
    console.error('Error accepting media:', error);
    return null;
  }
}

export async function acceptMultipleMedia(
  sources: MediaSource[],
  userId: string,
  onProgress?: (current: number, total: number) => void
): Promise<AcceptedMedia[]> {
  const results: AcceptedMedia[] = [];

  for (let i = 0; i < sources.length; i++) {
    if (onProgress) {
      onProgress(i + 1, sources.length);
    }

    const result = await acceptMedia(sources[i], userId);
    if (result) {
      results.push(result);
    }
  }

  return results;
}

async function downloadFromUrl(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  const mimeType = response.headers.get('content-type') || 'application/octet-stream';

  return new File([blob], fileName, { type: mimeType });
}

export async function acceptGeneratedVideo(
  videoUrl: string,
  projectId: string,
  userId: string
): Promise<AcceptedMedia | null> {
  try {
    const fileName = `generated_${projectId}_${Date.now()}.mp4`;

    const { data: asset, error } = await supabase
      .from('assets')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_type: 'video/mp4',
        asset_type: 'video',
        file_url: videoUrl,
        file_size: 0,
        metadata: {
          source: 'ai_generated',
          project_id: projectId,
        },
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: asset.id,
      file_url: asset.file_url,
      file_name: asset.file_name,
      asset_type: asset.asset_type,
      metadata: asset.metadata,
    };
  } catch (error) {
    console.error('Error accepting generated video:', error);
    return null;
  }
}

export async function acceptDownloadedVideo(
  file: File,
  userId: string
): Promise<AcceptedMedia | null> {
  return acceptMedia(
    {
      type: 'download',
      file,
      name: file.name,
    },
    userId
  );
}

export async function acceptToolboardMedia(
  toolId: string,
  outputUrl: string,
  userId: string
): Promise<AcceptedMedia | null> {
  const fileName = `tool_${toolId}_${Date.now()}.mp4`;

  try {
    const { data: asset, error } = await supabase
      .from('assets')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_type: 'video/mp4',
        asset_type: 'video',
        file_url: outputUrl,
        file_size: 0,
        metadata: {
          source: 'toolboard',
          tool_id: toolId,
        },
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: asset.id,
      file_url: asset.file_url,
      file_name: asset.file_name,
      asset_type: asset.asset_type,
      metadata: asset.metadata,
    };
  } catch (error) {
    console.error('Error accepting toolboard media:', error);
    return null;
  }
}

export async function makeMediaAvailableInEditor(
  mediaIds: string[],
  projectId: string
): Promise<boolean> {
  try {
    const { data: project } = await supabase
      .from('movie_projects')
      .select('asset_ids')
      .eq('id', projectId)
      .single();

    const existingAssetIds = project?.asset_ids || [];
    const updatedAssetIds = [...new Set([...existingAssetIds, ...mediaIds])];

    const { error } = await supabase
      .from('movie_projects')
      .update({ asset_ids: updatedAssetIds })
      .eq('id', projectId);

    return !error;
  } catch (error) {
    console.error('Error making media available in editor:', error);
    return false;
  }
}

export async function getAllAvailableMedia(userId: string): Promise<AcceptedMedia[]> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('id, file_url, file_name, asset_type, metadata')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting available media:', error);
    return [];
  }
}
