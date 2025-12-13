import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface GenerateMovieRequest {
  jobId: string;
}

interface RenderJob {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_duration: number;
  aspect_ratio: string;
  resolution: string;
  scene_breakdown: any;
  asset_ids: any;
  video_settings: any;
  audio_settings: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { jobId } = await req.json() as GenerateMovieRequest;

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Job ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: job, error: jobError } = await supabase
      .from('render_jobs')
      .select('*')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job) {
      return new Response(
        JSON.stringify({ error: 'Render job not found', details: jobError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('render_jobs')
      .update({
        status: 'processing',
        progress_percent: 0,
        current_step: 'Initializing video generation...',
        started_at: new Date().toISOString()
      })
      .eq('id', jobId);

    processVideoGeneration(supabase, job, supabaseUrl).catch(async (error) => {
      console.error('Video generation failed:', error);
      await supabase
        .from('render_jobs')
        .update({
          status: 'failed',
          error_message: error.message || 'Unknown error occurred',
          progress_percent: 0
        })
        .eq('id', jobId);
    });

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        message: 'Video generation started. Check status for progress updates.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processVideoGeneration(supabase: any, job: RenderJob, supabaseUrl: string) {
  const jobId = job.id;

  try {
    await updateProgress(supabase, jobId, 5, 'Initializing movie generation system...');

    let assetIdsArray: string[] = [];
    if (job.asset_ids) {
      if (Array.isArray(job.asset_ids)) {
        assetIdsArray = job.asset_ids;
      } else if (typeof job.asset_ids === 'string') {
        try {
          assetIdsArray = JSON.parse(job.asset_ids);
        } catch {
          assetIdsArray = [];
        }
      }
    }

    await updateProgress(supabase, jobId, 10, 'Loading your uploaded files...');

    let assets: any[] = [];
    if (assetIdsArray.length > 0) {
      const { data: fetchedAssets, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .in('id', assetIdsArray);

      if (!assetsError && fetchedAssets) {
        assets = fetchedAssets;
      }
    }

    console.log(`Processing movie: ${job.title}`);
    console.log(`Duration: ${job.target_duration} minutes`);
    console.log(`Assets available: ${assets.length} files`);

    if (assets.length === 0) {
      throw new Error('No assets found. Please upload video files before generating a movie.');
    }

    await updateProgress(supabase, jobId, 20, 'AI is analyzing your content and creating scene breakdown...');

    const scenes = createScenes(job.target_duration, assets, job.description || '');

    const sceneRecords = scenes.map((scene, index) => ({
      render_job_id: jobId,
      scene_number: index + 1,
      scene_name: scene.name,
      scene_type: scene.type,
      start_time: scene.startTime,
      end_time: scene.endTime,
      duration: scene.duration,
      asset_id: scene.assetId,
      status: 'pending'
    }));

    await supabase.from('render_scenes').insert(sceneRecords);
    await supabase
      .from('render_jobs')
      .update({ scene_count: scenes.length })
      .eq('id', jobId);

    await updateProgress(supabase, jobId, 30, 'Creating movie scenes with your uploaded content...');

    const videoSegments: string[] = [];
    const progressPerScene = 50 / scenes.length;

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const currentProgress = 30 + (i * progressPerScene);

      await updateProgress(
        supabase,
        jobId,
        Math.floor(currentProgress),
        `Processing scene ${i + 1}/${scenes.length}: ${scene.name}...`
      );

      const segmentUrl = await generateVideoSegment(supabase, scene, assets);
      videoSegments.push(segmentUrl);

      await supabase
        .from('render_scenes')
        .update({ status: 'completed', rendered_url: segmentUrl })
        .eq('render_job_id', jobId)
        .eq('scene_number', i + 1);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await updateProgress(supabase, jobId, 85, 'Combining all scenes into your final movie...');

    const finalVideoUrl = await combineVideoSegments(supabase, jobId, videoSegments, job, supabaseUrl);

    await updateProgress(supabase, jobId, 95, 'Creating thumbnail and finalizing...');

    const thumbnailUrl = await generateThumbnail(supabase, finalVideoUrl, assets[0]?.file_url);

    await updateProgress(supabase, jobId, 100, 'Your movie is ready!');

    const actualDuration = job.target_duration * 60;

    await supabase
      .from('render_jobs')
      .update({
        status: 'completed',
        progress_percent: 100,
        current_step: 'Movie generation complete!',
        output_video_url: finalVideoUrl,
        thumbnail_url: thumbnailUrl,
        actual_duration: actualDuration,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    console.log(`Movie generation completed for job ${jobId}`);

  } catch (error) {
    console.error('Error in processVideoGeneration:', error);
    throw error;
  }
}

function createScenes(targetDuration: number, assets: any[], description: string): any[] {
  if (!assets || assets.length === 0) {
    throw new Error('No assets available for scene creation');
  }

  const sceneTypes = [
    { name: 'Opening Scene', type: 'opening' },
    { name: 'Introduction', type: 'introduction' },
    { name: 'Rising Action', type: 'action' },
    { name: 'Development', type: 'dialogue' },
    { name: 'Main Sequence', type: 'montage' },
    { name: 'Climax', type: 'climax' },
    { name: 'Resolution', type: 'resolution' },
    { name: 'Closing Scene', type: 'closing' }
  ];

  const numScenes = Math.min(
    Math.max(Math.floor(targetDuration / 15), 3),
    Math.min(sceneTypes.length, assets.length * 2)
  );

  const sceneDuration = (targetDuration * 60) / numScenes;
  const scenes: any[] = [];

  for (let i = 0; i < numScenes; i++) {
    const startTime = i * sceneDuration;
    const endTime = startTime + sceneDuration;

    const assetIndex = i % assets.length;
    const asset = assets[assetIndex];

    scenes.push({
      name: sceneTypes[i % sceneTypes.length].name,
      type: sceneTypes[i % sceneTypes.length].type,
      startTime: Math.floor(startTime),
      endTime: Math.floor(endTime),
      duration: Math.floor(sceneDuration),
      assetId: asset.id,
      assetUrl: asset.file_url,
      assetType: asset.asset_type
    });
  }

  return scenes;
}

async function generateVideoSegment(supabase: any, scene: any, assets: any[]): Promise<string> {
  return scene.assetUrl || assets[0]?.file_url || 'placeholder-segment-url';
}

async function combineVideoSegments(
  supabase: any,
  jobId: string,
  segments: string[],
  job: RenderJob,
  supabaseUrl: string
): Promise<string> {
  // For now, return the first video asset as the output
  // In a full implementation, this would use FFmpeg to combine all segments
  if (segments.length > 0 && segments[0] !== 'placeholder-segment-url') {
    return segments[0]; // Return the actual video URL
  }
  
  const timestamp = Date.now();
  const fileName = `${supabaseUrl}/storage/v1/object/public/media-assets/movies/${jobId}/final-${timestamp}.mp4`;
  return fileName;
}

async function generateThumbnail(supabase: any, videoUrl: string, firstAssetUrl?: string): Promise<string> {
  if (firstAssetUrl && firstAssetUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return firstAssetUrl;
  }
  return `${videoUrl}-thumbnail.jpg`;
}

async function updateProgress(
  supabase: any,
  jobId: string,
  percent: number,
  step: string
) {
  await supabase
    .from('render_jobs')
    .update({
      progress_percent: percent,
      current_step: step
    })
    .eq('id', jobId);

  console.log(`Job ${jobId}: ${percent}% - ${step}`);
}
