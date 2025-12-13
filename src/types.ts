export type InputType = 'text' | 'url' | 'youtube' | 'file';

export interface FileInput {
  name: string;
  type: string;
  content: string | ArrayBuffer; // Base64 or text content
}

export interface UserInput {
  type: InputType;
  value: string;
  file?: FileInput;
}

export interface NewsItem {
  id: string;
  title: string;
  originalSource: string; // URL or "User Input"
  summary: string;
  viralityScore: number;
  hotTakeAngle: string;
  isApproved: boolean;
  generatedContent?: {
    article: string;
    imagePrompt: string;
    imageUrl?: string;
    videoPrompt: string;
    videoUrl?: string;
    socialCopy: {
        linkedin: string;
        twitter: string;
        instagram: string;
        facebook: string;
    }
  }
}

export interface AppState {
  step: 'config' | 'input' | 'analysis' | 'review' | 'generating' | 'done' | 'error';
  geminiApiKey: string;
  replicateApiKey: string;
  replicateModel: string; // e.g., "stability-ai/sdxl"
  newsItem?: NewsItem;
  error?: string;
}

export const REPLICATE_MODELS = [
    { label: "Stable Diffusion XL (High Quality)", value: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b" },
    { label: "Flux Schnell (Fast)", value: "black-forest-labs/flux-schnell" },
    { label: "Playground v2.5", value: "playgroundai/playground-v2.5:ed6114352e2a712cc6f7f6aeb9f2732c4193b2184f938923a41ba66a1523351d" }
];
