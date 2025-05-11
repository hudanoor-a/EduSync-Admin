
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Ensure you have GOOGLE_API_KEY set in your environment for this to work.
export const ai = genkit({
  plugins: [googleAI()],
  // Removed default model from here, it should be specified in prompts or generate calls
  // model: 'googleai/gemini-2.0-flash', 
});
