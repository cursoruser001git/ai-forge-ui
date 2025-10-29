const API_BASE_URL = 'https://freeapi-tbmj.onrender.com';

export interface Model {
  id: string;
  name: string;
  description?: string;
  provider?: string;
  context_length?: number;
  pricing?: {
    input?: number;
    output?: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
}

// Health check
export async function checkHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      return { status: 'healthy', timestamp: new Date().toISOString(), ...data };
    }
    return { status: 'unhealthy', timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy', timestamp: new Date().toISOString() };
  }
}

// Get models by category
export async function getModelsByCategory(category: string): Promise<Model[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${category}/models`);
    if (!response.ok) {
      throw new Error(`Failed to fetch models for category: ${category}`);
    }
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error(`Error fetching models for category ${category}:`, error);
    return [];
  }
}

// Get all categories
export const CATEGORIES = [
  { id: 'openai', name: 'OpenAI', icon: '🤖' },
  { id: 'llama', name: 'Llama', icon: '🦙' },
  { id: 'qwen', name: 'Qwen', icon: '🧠' },
  { id: 'kimi', name: 'Kimi', icon: '⭐' },
  { id: 'deepseek', name: 'DeepSeek', icon: '🔍' },
  { id: 'coder', name: 'Code Models', icon: '💻' },
  { id: 'embed', name: 'Embeddings', icon: '🔗' },
  { id: 'audio', name: 'Audio', icon: '🎵' },
  { id: 'image', name: 'Image', icon: '🖼️' },
];

// Send chat request (non-streaming)
export async function sendChatRequest(
  category: string,
  request: ChatRequest
): Promise<{ content: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/${category}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...request, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`Chat request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices?.[0]?.message?.content || 'No response' };
  } catch (error) {
    console.error('Chat request error:', error);
    throw error;
  }
}

// Send streaming chat request
export async function sendStreamingChatRequest(
  category: string,
  request: ChatRequest,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${category}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`Streaming chat request failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            onComplete();
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Ignore parsing errors for SSE format
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming chat error:', error);
    onError(error as Error);
  }
}

// Local storage helpers for API keys
export function saveApiKey(provider: string, key: string): void {
  const keys = getStoredApiKeys();
  keys[provider] = key;
  localStorage.setItem('ai_api_keys', JSON.stringify(keys));
}

export function getApiKey(provider: string): string | null {
  const keys = getStoredApiKeys();
  return keys[provider] || null;
}

export function getStoredApiKeys(): Record<string, string> {
  try {
    const stored = localStorage.getItem('ai_api_keys');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function removeApiKey(provider: string): void {
  const keys = getStoredApiKeys();
  delete keys[provider];
  localStorage.setItem('ai_api_keys', JSON.stringify(keys));
}