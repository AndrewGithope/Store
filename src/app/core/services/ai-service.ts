import { Injectable, signal } from '@angular/core';
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { Product } from '../../shared/models/product';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai = new GoogleGenerativeAI(environment.geminiApiKey);
  private model!: GenerativeModel;
  private chatSession!: ChatSession;

  messages = signal<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! I am your Luxe Fragrances AI assistant. How can I help you today?' }
  ]);

  isLoading = signal<boolean>(false);

  constructor() {

    this.initModelAndChat([]);
  }

  initializeAsisstantWithProducts(products: Product[]): void {
    this.initModelAndChat(products);
  }

  private initModelAndChat(products: Product[]): void {
    const productListText = products.length > 0
      ? products.map(p => `- ${p.title} (${p.category}): $${p.price}`).join('\n')
      : 'No products currently loaded.';

    const systemInstructionText = `
You are the official AI Shopping Assistant for Luxe Fragrances perfume store.
Your goal is to help customers choose and buy products from our store catalog.

CRITICAL RULES:
1. Act directly as a representative/assistant of Luxe Fragrances store. Never say "as an AI I don't sell perfumes".
2. ALWAYS recommend products strictly from the store catalog list below.
3. If a customer asks what fragrances/products we have, list the items from the catalog provided below.

STORE CATALOG:
${productListText}
`.trim();

    this.model = this.ai.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemInstructionText
    });

    this.chatSession = this.model.startChat({
      history: []
    });
  }

  async sendMessage(userText: string): Promise<void> {
    if (!userText.trim()) return;

    this.messages.update(prev => [...prev, { sender: 'user', text: userText }]);
    this.isLoading.set(true);

    try {
      const result = await this.chatSession.sendMessage(userText);
      const aiResponse = result.response.text();

      this.messages.update(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('Gemini API Error', error);
      this.messages.update(prev => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I am having trouble connecting right now.' }
      ]);
    } finally {
      this.isLoading.set(false);
    }
  }
}