import React, { useState } from 'react';
import { REPLICATE_MODELS } from '../types';

interface Props {
  onStart: (geminiKey: string, replicateKey: string, model: string) => void;
}

export const ApiKeyInput: React.FC<Props> = ({ onStart }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [replicateKey, setReplicateKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(REPLICATE_MODELS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey && replicateKey) {
      onStart(geminiKey, replicateKey, selectedModel);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
      <div className="w-full max-w-md bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-700">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Setup Agents
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">Gemini API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="AIzaSy..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">Replicate API Key</label>
            <input
              type="password"
              value={replicateKey}
              onChange={(e) => setReplicateKey(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
              placeholder="r8_..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">Image Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all appearance-none"
            >
              {REPLICATE_MODELS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg transform transition-all hover:scale-[1.02]"
          >
            Initialize System
          </button>
        </form>
      </div>
    </div>
  );
};
