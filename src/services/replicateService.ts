import { REPLICATE_MODELS } from "../types";

export class ReplicateService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateImage(prompt: string, model: string): Promise<string> {
        // Using a CORS proxy because Replicate does not support browser-side calls
        // Note: In production, do this backend-side.
        // For this demo, we can try to use a proxy if available, or just fetch and warn.
        
        // We will try a direct fetch. If it fails, the UI should show a CORS error.
        // BUT, many users use a proxy variable.
        
        // Let's pretend we are using a proxy or the user setup allows it.
        // Using Vite proxy to avoid CORS
        const response = await fetch("/api/replicate/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Token ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                version: model.split(':')[1] || undefined, 
                input: { prompt: prompt, num_outputs: 1 }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Replicate API failed");
        }

        let prediction = await response.json();
        
        // Poll for result
        while (prediction.status !== "succeeded" && prediction.status !== "failed") {
            await new Promise(r => setTimeout(r, 2000));
            // Rewrite URL to use proxy
            const pollUrl = prediction.urls.get.replace('https://api.replicate.com/v1', '/api/replicate');
            
            const pollRes = await fetch(pollUrl, {
                headers: {
                    "Authorization": `Token ${this.apiKey}`,
                }
            });
            prediction = await pollRes.json();
        }

        if (prediction.status === "failed") {
            throw new Error("Image generation failed");
        }

        return prediction.output[0];
    }
}
