import OpenAI from "openai";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Real video audio extraction and transcription
export async function extractVideoContent(videoUrl: string, platform: string): Promise<string> {
  try {
    console.log(`Starting real audio extraction from: ${videoUrl}`);
    
    // Extract audio from video using yt-dlp and ffmpeg
    const audioBuffer = await extractAudioFromVideo(videoUrl);
    
    // Transcribe audio using OpenAI Whisper
    const transcription = await transcribeAudioBuffer(audioBuffer);
    
    if (!transcription || transcription.trim().length === 0) {
      throw new Error("No transcription could be generated from video audio");
    }

    console.log(`Transcription completed: ${transcription.length} characters`);
    return transcription.trim();
    
  } catch (error) {
    console.error("Error in video processing:", error);
    throw new Error(`Failed to extract and transcribe video content: ${(error as Error).message}`);
  }
}

async function extractAudioFromVideo(videoUrl: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const tempDir = '/tmp';
    const timestamp = Date.now() + Math.random().toString(36).substr(2, 9);
    const audioBasePath = path.join(tempDir, `audio_${timestamp}`);
    
    console.log("Extracting and compressing audio with yt-dlp and ffmpeg...");
    
    // Ultra-optimized yt-dlp configuration for maximum speed
    const ytDlpArgs = [
      '--extract-audio',
      '--audio-format', 'opus', // OPUS format is 30% more efficient than MP3
      '--audio-quality', '9', // Lowest quality for maximum speed
      '--no-playlist',
      '--no-warnings',
      '--ignore-errors',
      '--max-downloads', '1',
      '--output', `${audioBasePath}.%(ext)s`,
      '--no-check-certificate',
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      // Ultra-aggressive speed optimizations
      '--prefer-free-formats',
      '--socket-timeout', '20', // Reduced timeout
      '--retries', '1', // Fewer retries for speed
      '--fragment-retries', '1',
      '--concurrent-fragments', '8', // Double concurrent fragments
      '--http-chunk-size', '20971520', // Double chunk size (20MB)
      '--buffer-size', '64K', // Larger buffer
      '--no-part',
      '--no-mtime',
      '--no-write-info-json',
      '--no-write-thumbnail',
      '--no-write-subs',
      '--no-write-auto-subs',
      '--no-embed-metadata',
      '--no-embed-chapters',
      '--no-embed-info-json',
      '--no-embed-thumbnail',
      '--no-embed-subs',
      // Additional speed flags
      '--no-call-home',
      '--no-cache-dir',
      '--no-write-description',
      '--no-write-annotations',
      '--skip-unavailable-fragments'
    ];

    // Add platform-specific options for better compatibility
    if (videoUrl.includes('instagram.com')) {
      ytDlpArgs.push('--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      ytDlpArgs.push('--referer', 'https://www.instagram.com/');
    } else if (videoUrl.includes('tiktok.com')) {
      ytDlpArgs.push('--referer', 'https://www.tiktok.com/');
      ytDlpArgs.push('--extractor-args', 'tiktok:webpage_url_basename=tiktok.com');
    } else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      // YouTube-specific optimizations
      ytDlpArgs.push('--extractor-args', 'youtube:player_client=android');
    }

    ytDlpArgs.push(videoUrl);
    
    console.log(`yt-dlp command: yt-dlp ${ytDlpArgs.join(' ')}`);
    
    const ytDlp = spawn('yt-dlp', ytDlpArgs);
    
    // Add timeout to prevent hanging processes
    const timeout = setTimeout(() => {
      ytDlp.kill('SIGTERM');
      reject(new Error('Video processing timeout - please try again with a shorter video'));
    }, 120000); // 2 minutes timeout

    let stderr = '';
    let stdout = '';
    
    ytDlp.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    ytDlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytDlp.on('close', (code) => {
      clearTimeout(timeout); // Clear timeout on process completion
      console.log(`yt-dlp process exited with code: ${code}`);
      console.log(`yt-dlp stdout: ${stdout}`);
      console.log(`yt-dlp stderr: ${stderr}`);
      
      // Check if the audio file was actually created successfully
      // yt-dlp creates files with different extensions (.opus, .mp3, etc.)
      const possibleExtensions = ['.opus', '.mp3', '.m4a', '.ogg'];
      let actualAudioPath = null;
      
      for (const ext of possibleExtensions) {
        const testPath = audioBasePath + ext;
        if (fs.existsSync(testPath)) {
          actualAudioPath = testPath;
          break;
        }
      }
      
      if (actualAudioPath) {
        console.log(`Audio file created successfully: ${actualAudioPath}`);
        // Continue with processing regardless of exit code
        // (yt-dlp sometimes exits with non-zero code when using --max-downloads)
        processAudio(actualAudioPath);
        return;
      }
      
      // Only handle errors if no audio file was created
      // Note: Code 101 with --max-downloads is normal, but we already handled success above
      if (code !== 0) {
        // Handle specific platform authentication issues
        if (stderr.includes('login required') || stderr.includes('rate-limit reached')) {
          if (videoUrl.includes('instagram.com')) {
            reject(new Error('Instagram requiere autenticación. Por favor, intenta con un video público de YouTube, TikTok público, o proporciona una URL diferente.'));
          } else if (videoUrl.includes('tiktok.com')) {
            reject(new Error('Este video de TikTok requiere autenticación. Por favor, intenta con un video público o una URL diferente.'));
          } else {
            reject(new Error('Este video requiere autenticación para acceder. Por favor, intenta con un video público de YouTube.'));
          }
          return;
        }
        
        // Handle Chrome cookies database error
        if (stderr.includes('could not find chrome cookies database')) {
          reject(new Error('Error de configuración del navegador. Por favor, intenta con un video público de YouTube, TikTok o Instagram.'));
          return;
        }
        
        // Handle specific JSON parsing errors
        if (stderr.includes('JSON object must be str, bytes or bytearray, not NoneType')) {
          if (videoUrl.includes('tiktok.com')) {
            reject(new Error('Error procesando video de TikTok. El video puede estar restringido. Por favor, intenta con un video público de YouTube o Instagram.'));
          } else if (videoUrl.includes('instagram.com')) {
            reject(new Error('Error procesando video de Instagram. El video puede estar restringido. Por favor, intenta con un video público de YouTube o TikTok.'));
          } else {
            reject(new Error('Error de procesamiento del video. El video puede estar restringido o no disponible. Por favor, intenta con un video público.'));
          }
          return;
        }
        
        // Handle other common errors
        if (stderr.includes('Video unavailable') || stderr.includes('not available')) {
          reject(new Error('Video no disponible. Por favor, verifica que la URL sea correcta y el video sea público.'));
          return;
        }
        
        // Handle platform-specific errors
        if (stderr.includes('TikTok') && stderr.includes('blocked')) {
          reject(new Error('Este video de TikTok está bloqueado o restringido. Por favor, intenta con un video público de YouTube o Instagram.'));
          return;
        }
        
        if (stderr.includes('Instagram') && stderr.includes('blocked')) {
          reject(new Error('Este video de Instagram está bloqueado o restringido. Por favor, intenta con un video público de YouTube o TikTok.'));
          return;
        }
        
        if (stderr.includes('YouTube') && stderr.includes('blocked')) {
          reject(new Error('Este video de YouTube está bloqueado o restringido. Por favor, intenta con un video público de TikTok o Instagram.'));
          return;
        }
        
        reject(new Error(`Error al procesar video: ${stderr}`));
        return;
      }
    });

    // Process audio with ffmpeg for compression
    // This runs regardless of yt-dlp exit code, as long as the file exists
    const processAudio = (inputAudioPath: string) => {
      try {
        if (fs.existsSync(inputAudioPath)) {
          const compressedAudioPath = path.join(tempDir, `compressed_audio_${Date.now()}.ogg`);
          
          // Ultra-fast ffmpeg processing optimized for transcription
          const ffmpegArgs = [
            '-i', inputAudioPath,
            '-ar', '8000', // Reduce to 8kHz (minimum for decent speech recognition)
            '-ac', '1', // Convert to mono
            '-acodec', 'libopus', // Use OPUS codec (more efficient than MP3)
            '-b:a', '32k', // Lower bitrate for maximum speed
            '-preset', 'ultrafast', // Fastest encoding preset
            '-threads', '0', // Use all available CPU threads
            '-avoid_negative_ts', 'make_zero',
            '-fflags', '+genpts',
            '-f', 'ogg', // OGG container for OPUS
            '-y', // Overwrite output file
            compressedAudioPath
          ];
          
          const ffmpeg = spawn('ffmpeg', ffmpegArgs);
          
          ffmpeg.on('close', (ffmpegCode) => {
            try {
              // Clean up original audio file
              fs.unlinkSync(inputAudioPath);
              
              if (ffmpegCode === 0 && fs.existsSync(compressedAudioPath)) {
                const audioBuffer = fs.readFileSync(compressedAudioPath);
                // Clean up compressed audio file
                fs.unlinkSync(compressedAudioPath);
                console.log(`Audio compressed: ${audioBuffer.length} bytes`);
                resolve(audioBuffer);
              } else {
                reject(new Error('Audio compression failed'));
              }
            } catch (error) {
              reject(error);
            }
          });
          
          ffmpeg.on('error', (error) => {
            reject(new Error(`ffmpeg error: ${error.message}`));
          });
          
        } else {
          reject(new Error(`Audio file was not found: ${inputAudioPath}`));
        }
      } catch (error) {
        reject(error);
      }
    };

    ytDlp.on('error', (error) => {
      clearTimeout(timeout);
      reject(new Error(`yt-dlp spawn error: ${error.message}`));
    });
  });
}

async function transcribeAudioBuffer(audioBuffer: Buffer): Promise<string> {
  try {
    // Create temporary file for OpenAI Whisper (optimized OGG format)
    const tempPath = `/tmp/audio_${Date.now()}.ogg`;
    fs.writeFileSync(tempPath, audioBuffer);

    console.log("Transcribing optimized audio with OpenAI Whisper...");
    
    // Use OpenAI Whisper for transcription with ultra-fast settings
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
      language: "es", // Spanish language
      response_format: "text",
      temperature: 0.0, // Deterministic for speed
      prompt: "Audio viral 8kHz mono" // Minimal context for speed
    });

    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    return transcription;
    
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error(`Failed to transcribe audio: ${(error as Error).message}`);
  }
}

export function validateVideoUrl(url: string): boolean {
  const validDomains = [
    'tiktok.com',
    'instagram.com',
    'youtube.com',
    'youtu.be',
    'facebook.com',
    'twitter.com',
    'x.com',
    'linkedin.com',
    'vimeo.com',
    'dailymotion.com'
  ];
  
  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  return validDomains.some(domain => url.includes(domain));
}

export function extractPlatformFromUrl(url: string): string {
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('facebook.com')) return 'Facebook';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('vimeo.com')) return 'Vimeo';
  if (url.includes('dailymotion.com')) return 'Dailymotion';
  return 'Unknown';
}

export function extractContentHints(url: string): string[] {
  const hints: string[] = [];
  
  // Extract keywords from URL path
  const urlParts = url.toLowerCase().split('/').filter(part => part.length > 2);
  
  // Common content type indicators
  const contentTypes = ['fitness', 'food', 'beauty', 'tech', 'business', 'education', 'entertainment'];
  
  urlParts.forEach(part => {
    contentTypes.forEach(type => {
      if (part.includes(type)) {
        hints.push(type);
      }
    });
  });
  
  return hints;
}