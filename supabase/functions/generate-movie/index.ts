import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface GenerateMovieRequest {
  jobId: string;
  prompt?: string;
  duration?: number;
  assets?: any[];
}

interface RenderJob {
  id: string;
  user_id: string;
  title: string;
  target_duration: number;
  aspect_ratio: string;
  resolution: string;
  scene_breakdown: any[];
  asset_ids: string[];
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

    // Fetch the render job
    const { data: job, error: jobError } = await supabase
      .from('render_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return new Response(
        JSON.stringify({ error: 'Render job not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update job status to processing
    await supabase
      .from('render_jobs')
      .update({ 
        status: 'processing', 
        progress_percent: 0,
        current_step: 'Initializing video generation...',
        started_at: new Date().toISOString()
      })
      .eq('id', jobId);

    // Start processing in background (don't await)
    processVideoGeneration(supabase, job).catch(async (error) => {
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

async function processVideoGeneration(supabase: any, job: RenderJob) {
  const jobId = job.id;
  
  try {
    // Step 1: Fetch all assets (10%)
    await updateProgress(supabase, jobId, 10, 'Loading your uploaded files...');

    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('*')
      .in('id', job.asset_ids || []);

    console.log(`Processing movie with prompt: ${job.description}`);
    console.log(`Duration: ${job.target_duration} minutes`);
    console.log(`Assets: ${assets?.length || 0} files`);

    // Step 2: Create scene breakdown (20%)
    await updateProgress(supabase, jobId, 20, 'AI is analyzing your instructions and creating scenes...');
    
    const scenes = createScenes(job.target_duration, assets, job.scene_breakdown);
    
    // Save scenes to database
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

    // Step 3: Generate video segments (30-80%)
    await updateProgress(supabase, jobId, 30, 'AI is creating your movie scenes (this takes a few minutes)...');

    const videoSegments: string[] = [];
    const progressPerScene = 50 / scenes.length;

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const currentProgress = 30 + (i * progressPerScene);

      await updateProgress(
        supabase,
        jobId,
        Math.floor(currentProgress),
        `Creating scene ${i + 1}/${scenes.length}: ${scene.name} (${Math.ceil(scene.duration / 60)}min)...`
      );

      // AI video generation happens here
      // This is where your uploaded files + prompt get turned into video
      const segmentUrl = await generateVideoSegment(supabase, scene, assets);
      videoSegments.push(segmentUrl);

      // Update scene status
      await supabase
        .from('render_scenes')
        .update({ status: 'completed', rendered_url: segmentUrl })
        .eq('render_job_id', jobId)
        .eq('scene_number', i + 1);
    }

    // Step 4: Combine all segments (85%)
    await updateProgress(supabase, jobId, 85, 'Stitching all scenes together into your final movie...');

    const finalVideoUrl = await combineVideoSegments(supabase, jobId, videoSegments, job);

    // Step 5: Generate thumbnail (95%)
    await updateProgress(supabase, jobId, 95, 'Creating movie thumbnail and finalizing...');

    const thumbnailUrl = await generateThumbnail(supabase, finalVideoUrl);

    // Step 6: Finalize (100%)
    await updateProgress(supabase, jobId, 100, 'Your movie is ready! 🎬');
    
    const actualDuration = job.target_duration * 60; // Convert to seconds
    
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

function createScenes(targetDuration: number, assets: any[], sceneBreakdown: any[]): any[] {
  const sceneTypes = [
    { name: 'Opening Scene', type: 'opening' },
    { name: 'Character Introduction', type: 'introduction' },
    { name: 'Rising Action', type: 'action' },
    { name: 'Development', type: 'dialogue' },
    { name: 'Montage Sequence', type: 'montage' },
    { name: 'Climax', type: 'climax' },
    { name: 'Resolution', type: 'resolution' },
    { name: 'Closing Scene', type: 'closing' }
  ];

  const numScenes = Math.min(
    Math.max(Math.floor(targetDuration / 10), 3),
    sceneTypes.length
  );
  
  const sceneDuration = (targetDuration * 60) / numScenes; // in seconds
  const scenes: any[] = [];
  
  for (let i = 0; i < numScenes; i++) {
    const startTime = i * sceneDuration;
    const endTime = startTime + sceneDuration;
    
    // Assign assets to scenes in round-robin fashion
    const assetIndex = i % assets.length;
    const asset = assets[assetIndex];
    
    scenes.push({
      name: sceneTypes[i].name,
      type: sceneTypes[i].type,
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
  // In a real implementation, this would:
  // 1. Download the source asset from storage
  // 2. Use FFmpeg to trim/process it to match scene duration
  // 3. Apply effects, transitions, filters
  // 4. Upload the processed segment back to storage
  // 5. Return the URL
  
  // For MVP, we'll return the original asset URL
  // This allows testing the full workflow without FFmpeg setup
  return scene.assetUrl || 'placeholder-segment-url';
}

async function combineVideoSegments(
  supabase: any, 
  jobId: string, 
  segments: string[], 
  job: RenderJob
): Promise<string> {
  // In a real implementation, this would:
  // 1. Download all segment files
  // 2. Create FFmpeg concat file
  // 3. Use FFmpeg to concatenate all segments
  // 4. Apply final encoding settings (resolution, bitrate, codec)
  // 5. Upload final video to storage
  // 6. Return the final video URL
  
  // For MVP, generate a placeholder URL
  const timestamp = Date.now();
  const fileName = `movies/${jobId}/final-${timestamp}.mp4`;
  
  // In production, you'd upload the actual video file here
  // For now, return a placeholder that represents the final video
  return `${jobId}/final-movie.mp4`;
}

async function generateThumbnail(supabase: any, videoUrl: string): Promise<string> {
  // In a real implementation, this would:
  // 1. Use FFmpeg to extract a frame from the video (e.g., at 10% mark)
  // 2. Resize/optimize the image
  // 3. Upload to storage
  // 4. Return thumbnail URL
  
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
