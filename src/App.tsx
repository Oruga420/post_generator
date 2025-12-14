import { useState } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { NewsFinder } from './components/NewsFinder';
import { ContentApprover } from './components/ContentApprover';
import { FinalDashboard } from './components/FinalDashboard';
import { GeminiService } from './services/geminiService';
import { ReplicateService } from './services/replicateService';
import { AppState, UserInput } from './types';

function App() {
  const [state, setState] = useState<AppState>({
    step: 'config',
    geminiApiKey: '',
    replicateApiKey: '',
    replicateModel: '',
  });

  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const [replicateService, setReplicateService] = useState<ReplicateService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [videoError, setVideoError] = useState<string | undefined>();

  const handleStart = (gKey: string, rKey: string, rModel: string) => {
    setState(prev => ({ ...prev, geminiApiKey: gKey, replicateApiKey: rKey, replicateModel: rModel, step: 'input' }));
    setGeminiService(new GeminiService(gKey));
    setReplicateService(new ReplicateService(rKey));
  };

  const handleAnalyze = async (input: UserInput) => {
    if (!geminiService || !replicateService) return;
    setIsLoading(true);
    try {
      // 1. Analyze
      const analysis = await geminiService.analyzeContent(input);
      
      // 2. Generate Draft Content (Article, Video Script, Image Prompt)
      const creative = await geminiService.generateCreativeContent(analysis);
      
      const newsItem = { ...analysis, generatedContent: creative };
      setState(prev => ({ ...prev, newsItem, step: 'review' })); // Show text first
      
      // 3. Generate Image (Parallel or immediately after)
      // We do this here so user sees "Painting..." in the Review screen
      if (creative) {
        generateImage(creative.imagePrompt);
      }

    } catch (e) {
      alert("Analysis failed: " + (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    if (!replicateService) return;
    try {
      const imageUrl = await replicateService.generateImage(prompt, state.replicateModel);
      
      setState(prev => {
        if (!prev.newsItem) return prev;
        return {
            ...prev,
            newsItem: {
                ...prev.newsItem,
                generatedContent: {
                    ...prev.newsItem.generatedContent!,
                    imageUrl: imageUrl 
                }
            }
        };
      });
    } catch (e) {
      console.error("Image gen failed", e);
      alert("Image generation failed. Check API Key or Console.");
    }
  };

  const handleRegenerateImage = (prompt: string) => {
    if (!state.newsItem) return;
    // Clear current image to show loading state
    setState(prev => ({
        ...prev,
        newsItem: {
            ...prev.newsItem!,
            generatedContent: { ...prev.newsItem!.generatedContent!, imageUrl: undefined }
        }
    }));
    generateImage(prompt);
  };

  const handleApprove = async () => {
    if (!geminiService || !state.newsItem?.generatedContent?.imageUrl) return;
    
    setState(prev => ({ ...prev, step: 'generating' }));
    
    try {
      const vUrl = await geminiService.generateVideo(
          state.newsItem.generatedContent.videoPrompt, 
          state.newsItem.generatedContent.imageUrl
      );
      setVideoUrl(vUrl);
      setState(prev => ({ ...prev, step: 'done' }));
    } catch (e: any) {
        setVideoError(e.message || "Video generation failed");
        // Go to dashboard anyway to show error
        setState(prev => ({ ...prev, step: 'done' })); 
    }
  };

  const handleRetryVideo = () => {
    setVideoError(undefined);
    handleApprove();
  };

  return (
    <div className="min-h-screen bg-black font-sans text-neutral-100">
      {state.step === 'config' && <ApiKeyInput onStart={handleStart} />}
      
      {state.step === 'input' && (
        <NewsFinder onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}

      {state.step === 'review' && state.newsItem && (
        <ContentApprover 
            newsItem={state.newsItem} 
            onRegenerateImage={handleRegenerateImage}
            onApprove={handleApprove}
            isGeneratingImage={!state.newsItem.generatedContent?.imageUrl}
        />
      )}

      {(state.step === 'generating' || state.step === 'done') && state.newsItem && (
        <FinalDashboard 
            newsItem={state.newsItem}
            videoUrl={videoUrl}
            error={videoError}
            onRetryVideo={handleRetryVideo}
            onReset={() => setState(prev => ({ ...prev, step: 'input', newsItem: undefined }))}
        />
      )}
    </div>
  );
}

export default App;
