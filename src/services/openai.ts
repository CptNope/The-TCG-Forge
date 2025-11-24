/**
 * OpenAI Service
 * Handles image and text generation using OpenAI API
 */

interface GenerateImageOptions {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
}

interface GenerateTextOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  model?: 'gpt-4' | 'gpt-4-turbo-preview' | 'gpt-3.5-turbo';
}

export class OpenAIService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    // Load API key from localStorage
    this.apiKey = localStorage.getItem('openai_api_key');
  }

  /**
   * Set OpenAI API key
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  /**
   * Get current API key
   */
  getApiKey(): string | null {
    return this.apiKey;
  }

  /**
   * Clear API key
   */
  clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem('openai_api_key');
  }

  /**
   * Check if API key is set
   */
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /**
   * Generate image using DALL-E
   */
  async generateImage(options: GenerateImageOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set. Please add your API key in Settings.');
    }

    try {
      const response = await fetch(`${this.baseURL}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: options.prompt,
          size: options.size || '1024x1024',
          quality: options.quality || 'standard',
          style: options.style || 'vivid',
          n: options.n || 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate image');
      }

      const data = await response.json();
      return data.data[0].url; // Returns image URL
    } catch (error: any) {
      console.error('OpenAI Image Generation Error:', error);
      throw error;
    }
  }

  /**
   * Generate text using GPT
   */
  async generateText(options: GenerateTextOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set. Please add your API key in Settings.');
    }

    try {
      const messages: any[] = [];
      
      if (options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: options.prompt,
      });

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || 'gpt-3.5-turbo',
          messages,
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate text');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI Text Generation Error:', error);
      throw error;
    }
  }

  /**
   * Generate card artwork prompt
   */
  generateArtworkPrompt(cardData: {
    name: string;
    type?: string;
    rarity?: string;
    abilityText?: string;
    element?: string;
  }): string {
    const parts = ['Fantasy trading card game artwork'];
    
    if (cardData.element) {
      parts.push(`${cardData.element} element themed`);
    }
    
    parts.push(`for "${cardData.name}"`);
    
    if (cardData.type) {
      parts.push(`a ${cardData.type.toLowerCase()}`);
    }
    
    if (cardData.rarity === 'Legendary' || cardData.rarity === 'Epic') {
      parts.push('epic and powerful');
    }
    
    if (cardData.abilityText && cardData.abilityText.length > 0) {
      parts.push(`with ${cardData.abilityText.substring(0, 50)}`);
    }
    
    parts.push('highly detailed, digital art, vibrant colors, game card illustration');
    
    return parts.join(', ');
  }

  /**
   * Generate card ability text
   */
  async generateAbilityText(cardData: {
    name: string;
    type?: string;
    power?: number;
    cost?: number;
    element?: string;
  }): Promise<string> {
    const systemPrompt = `You are a game designer creating ability text for a trading card game. 
Generate creative, balanced, and thematic ability text that fits the card's properties. 
Keep it concise (1-3 sentences). Use game terminology and clear language.`;

    const prompt = `Generate an ability for a card named "${cardData.name}"
${cardData.type ? `Type: ${cardData.type}` : ''}
${cardData.power ? `Power: ${cardData.power}` : ''}
${cardData.cost ? `Cost: ${cardData.cost}` : ''}
${cardData.element ? `Element: ${cardData.element}` : ''}

Create a unique, balanced ability that fits this card.`;

    return await this.generateText({ prompt, systemPrompt, maxTokens: 150 });
  }

  /**
   * Generate flavor text
   */
  async generateFlavorText(cardData: {
    name: string;
    type?: string;
    abilityText?: string;
  }): Promise<string> {
    const systemPrompt = `You are a creative writer crafting flavor text for trading cards.
Write atmospheric, evocative flavor text that adds lore and character.
Keep it brief (1-2 sentences). Make it memorable and thematic.`;

    const prompt = `Write flavor text for "${cardData.name}", a ${cardData.type || 'card'}.
${cardData.abilityText ? `Its ability: ${cardData.abilityText}` : ''}

Create evocative flavor text that enhances the card's theme.`;

    return await this.generateText({ prompt, systemPrompt, maxTokens: 100 });
  }

  /**
   * Generate card name
   */
  async generateCardName(theme: string, type?: string): Promise<string> {
    const systemPrompt = `You are a creative naming specialist for trading card games.
Generate unique, memorable card names. Return ONLY the name, nothing else.`;

    const prompt = `Generate a unique name for a ${type || 'card'} with theme: ${theme}`;

    return await this.generateText({ prompt, systemPrompt, maxTokens: 20 });
  }

  /**
   * Bulk generate card ideas
   */
  async generateCardIdeas(count: number, theme: string): Promise<Array<{
    name: string;
    description: string;
  }>> {
    const systemPrompt = `You are a game designer brainstorming trading card ideas.
Generate creative card concepts with names and brief descriptions.
Return as JSON array: [{"name": "Card Name", "description": "Brief description"}]`;

    const prompt = `Generate ${count} unique card ideas for theme: ${theme}
Each should have a creative name and brief description of the card's concept.`;

    const response = await this.generateText({ 
      prompt, 
      systemPrompt, 
      maxTokens: 500,
      temperature: 0.9,
    });

    try {
      return JSON.parse(response);
    } catch {
      // If parsing fails, return empty array
      return [];
    }
  }
}

// Export singleton instance
export const openAI = new OpenAIService();
