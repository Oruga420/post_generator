import React, { useState } from 'react';
import { NewsItem } from '../types';
import { RefreshCcw, Check } from 'lucide-react';

interface Props {
  newsItem: NewsItem;
  onRegenerateImage: (prompt: string) => void;
  onApprove: () => void;
  isGeneratingImage: boolean;
}

export const ContentApprover: React.FC<Props> = ({ newsItem, onRegenerateImage, onApprove, isGeneratingImage }) => {
  const [imgPrompt, setImgPrompt] = useState(newsItem.generatedContent?.imagePrompt || "");
  
  if (!newsItem.generatedContent) return null;

  return (
    <div className="min-h-screen p-8 text-white max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column: Text Content */}
      <div className="space-y-6">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Article Draft</h2>
            <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-neutral-300">{newsItem.generatedContent.article}</p>
            </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Video Script / Prompt</h2>
            <div className="bg-black p-4 rounded-xl font-mono text-sm text-green-400">
                {newsItem.generatedContent.videoPrompt}
            </div>
        </div>
      </div>

      {/* Right Column: Visuals & Actions */}
      <div className="space-y-6">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
            <h2 className="text-2xl font-bold mb-4 text-pink-400">Visuals</h2>
            
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 relative group">
                {newsItem.generatedContent.imageUrl ? (
                    <img src={newsItem.generatedContent.imageUrl} alt="Generated" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        {isGeneratingImage ? "Painting..." : "No Image"}
                    </div>
                )}
            </div>

            <div className="flex gap-2 mb-2">
                <input 
                    type="text" 
                    value={imgPrompt}
                    onChange={(e) => setImgPrompt(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
                />
                <button 
                    onClick={() => onRegenerateImage(imgPrompt)}
                    disabled={isGeneratingImage}
                    className="p-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 disabled:opacity-50"
                >
                    <RefreshCcw className={`w-4 h-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 sticky top-6">
            <h3 className="text-xl font-bold mb-4">Ready for Production?</h3>
            <p className="text-neutral-400 mb-6">
                Once approved, we will generate the final video and package all assets for download.
            </p>
            <button
                onClick={onApprove}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-black font-bold text-lg rounded-xl shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2"
            >
                <Check className="w-6 h-6" />
                Approve & Generate Video
            </button>
        </div>
      </div>
    </div>
  );
};
