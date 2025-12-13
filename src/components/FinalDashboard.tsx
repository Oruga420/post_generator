import React from 'react';
import { NewsItem } from '../types';
import { Download, Copy, RefreshCw, AlertTriangle, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface Props {
  newsItem: NewsItem;
  videoUrl?: string; // Or the generating status
  error?: string;
  onRetryVideo: () => void;
  onReset: () => void;
}

export const FinalDashboard: React.FC<Props> = ({ newsItem, videoUrl, error, onRetryVideo, onReset }) => {
  const generated = newsItem.generatedContent;
  if (!generated) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  const handleDownloadAll = () => {
    const csvContent = [
        ["Title", newsItem.title],
        ["Summary", newsItem.summary],
        ["Article", generated.article],
        ["Image Prompt", generated.imagePrompt],
        ["Video Prompt", generated.videoPrompt],
        ["LinkedIn", generated.socialCopy.linkedin],
        ["Twitter", generated.socialCopy.twitter],
        ["Instagram", generated.socialCopy.instagram],
        ["Facebook", generated.socialCopy.facebook],
        ["Image URL", generated.imageUrl || ""],
        ["Video URL", videoUrl || ""]
    ].map(e => e.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `lunas_post_${newsItem.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SocialCard = ({ icon: Icon, title, text }: { icon: any, title: string, text: string }) => (
    <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-neutral-300 font-semibold">
                <Icon className="w-4 h-4" /> {title}
            </div>
            <button onClick={() => handleCopy(text)} className="p-1 hover:text-white text-neutral-500">
                <Copy className="w-4 h-4" />
            </button>
        </div>
        <p className="text-sm text-neutral-400 line-clamp-4">{text}</p>
    </div>
  );

  return (
    <div className="min-h-screen p-8 text-white max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Content Ready
        </h1>
        <div className="flex gap-4">
            <button onClick={onReset} className="px-4 py-2 text-neutral-400 hover:text-white">Start New</button>
            <button onClick={handleDownloadAll} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 font-semibold">
                <Download className="w-4 h-4" /> Download All (CSV)
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Media */}
        <div className="space-y-8">
            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <h2 className="text-xl font-semibold mb-4 text-pink-400">Generative Video</h2>
                {error ? (
                    <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-center">
                        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-400 mb-4">{error}</p>
                        <button onClick={onRetryVideo} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-2 mx-auto">
                            <RefreshCw className="w-4 h-4" /> Retry Generation
                        </button>
                    </div>
                ) : videoUrl ? (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
                        <video src={videoUrl} controls className="w-full h-full" />
                        <a href={videoUrl} download className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-5 h-5" />
                        </a>
                    </div>
                ) : (
                    <div className="aspect-video bg-neutral-800 rounded-xl flex flex-col items-center justify-center animate-pulse">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <span className="text-neutral-500">Rendering Video...</span>
                    </div>
                )}
            </div>

            <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Generated Image</h2>
                <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
                    <img src={generated.imageUrl} alt="Result" className="w-full h-full object-cover" />
                    <a href={generated.imageUrl} download="image.png" className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>

        {/* Right: Text Assets */}
        <div className="grid grid-cols-1 gap-4 content-start">
            <h2 className="text-xl font-semibold text-neutral-400">Social Copy</h2>
            <SocialCard icon={Linkedin} title="LinkedIn" text={generated.socialCopy.linkedin} />
            <SocialCard icon={Twitter} title="X / Twitter" text={generated.socialCopy.twitter} />
            <SocialCard icon={Instagram} title="Instagram" text={generated.socialCopy.instagram} />
            <SocialCard icon={Facebook} title="Facebook" text={generated.socialCopy.facebook} />
            
            <div className="mt-8 bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-blue-400">Full Article</h2>
                    <button onClick={() => handleCopy(generated.article)} className="text-sm text-neutral-500 hover:text-white flex items-center gap-1">
                        <Copy className="w-4 h-4" /> Copy
                    </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="whitespace-pre-wrap text-neutral-300">{generated.article}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
