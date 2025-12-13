import React, { useState, useRef } from 'react';
import { UserInput } from '../types';
import { Search, Paperclip, Youtube, FileText, Globe } from 'lucide-react';

interface Props {
  onAnalyze: (input: UserInput) => void;
  isLoading: boolean;
}

export const NewsFinder: React.FC<Props> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInputType = (val: string, f: File | null): UserInput['type'] => {
    if (f) return 'file';
    if (val.includes('youtube.com') || val.includes('youtu.be')) return 'youtube';
    if (val.startsWith('http')) return 'url';
    return 'text';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !file) return;

    const type = getInputType(text, file);
    let fileInput;

    if (file) {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        onAnalyze({
          type,
          value: text || "File Upload",
          file: {
            name: file.name,
            type: file.type,
            content: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    } else {
      onAnalyze({ type, value: text });
    }
  };

  const currentType = getInputType(text, file);
  
  const getIcon = () => {
    switch (currentType) {
        case 'youtube': return <Youtube className="w-5 h-5" />;
        case 'file': return <FileText className="w-5 h-5" />;
        case 'url': return <Globe className="w-5 h-5" />;
        default: return <Search className="w-5 h-5" />;
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Analyzing...";
    switch (currentType) {
        case 'youtube': return "Analyze Video";
        case 'file': return "Analyze File";
        case 'url': return "Scan News";
        default: return "Find Trends";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-white">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight">
        What's happening?
      </h2>
      
      <div className="w-full max-w-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
        
        <form onSubmit={handleSubmit} className="relative bg-neutral-900 rounded-2xl p-2 flex items-center shadow-2xl border border-neutral-800">
          <div className="pl-4 pr-2 text-neutral-400">
            {getIcon()}
          </div>
          
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste URL, YouTube link, or type a topic..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-neutral-500 py-3"
            disabled={isLoading}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.pdf,.csv,image/*"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 rounded-full hover:bg-neutral-800 transition-colors ${file ? 'text-blue-400' : 'text-neutral-400'}`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={isLoading || (!text && !file)}
            className="ml-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {getButtonText()}
          </button>
        </form>

        {file && (
          <div className="absolute top-full mt-4 left-0 bg-neutral-800 px-3 py-1 rounded-full text-sm text-neutral-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            {file.name}
            <button onClick={() => setFile(null)} className="ml-2 hover:text-white">×</button>
          </div>
        )}
      </div>
    </div>
  );
};
