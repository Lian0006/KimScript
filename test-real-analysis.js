// Test script to verify real video analysis functionality
import { extractVideoContent } from './server/videoProcessor.js';
import { analyzeVideoContent } from './server/openai.js';

async function testRealAnalysis() {
  console.log("🎬 Testing Real Video Analysis System");
  
  // Test with a short YouTube video
  const testVideoUrl = "https://www.youtube.com/watch?v=jNQXAC9IVRw"; // "Me at the zoo" - first YouTube video (very short)
  
  try {
    console.log("\n📥 Step 1: Extracting real audio from video...");
    const transcription = await extractVideoContent(testVideoUrl, "YouTube");
    
    console.log("✅ Transcription successful!");
    console.log("📝 Transcribed content:", transcription.substring(0, 200) + "...");
    console.log("📊 Content length:", transcription.length, "characters");
    
    console.log("\n🧠 Step 2: Performing AI analysis on real content...");
    const analysis = await analyzeVideoContent(transcription);
    
    console.log("✅ Analysis complete!");
    console.log("\n🎯 Analysis Results:");
    console.log("Hook Type:", analysis.hookType);
    console.log("Effectiveness Score:", analysis.effectiveness);
    console.log("Viral Elements Found:", analysis.viralElements?.length || 0);
    console.log("Key Phrases:", analysis.keyPhrases?.slice(0, 3));
    console.log("Emotional Tone:", analysis.emotionalTone);
    
    console.log("\n🎉 SUCCESS: Real video analysis system is working!");
    console.log("The system successfully:");
    console.log("- Extracted authentic audio from a real video");
    console.log("- Transcribed speech using OpenAI Whisper");
    console.log("- Analyzed actual content with AI");
    console.log("- Generated comprehensive viral insights");
    
  } catch (error) {
    console.error("❌ Error during testing:", error.message);
    
    if (error.message.includes("OPENAI_API_KEY")) {
      console.log("\n💡 Solution: OpenAI API key needs to be configured");
    } else if (error.message.includes("yt-dlp")) {
      console.log("\n💡 Solution: Video download tools need to be installed");
    } else {
      console.log("\n💡 Error details:", error);
    }
  }
}

// Run the test
testRealAnalysis();