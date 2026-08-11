import { Injectable, signal } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product } from '../../shared/models/product';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
    sender: 'user' | 'ai',
    text: string
}


@Injectable({
    providedIn: 'root'
})
export class AiService {

    private ai = new GoogleGenerativeAI(environment.geminiApiKey);
    
    model = this.ai.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

    private chatSession = this.model.startChat({
        history: [],
        generationConfig: {
        }
    })

    messages = signal<ChatMessage[]>([
        {sender: 'ai', text: 'Hello! I am your AI assistant. How can I help you today?'}
    ])

    isLoading = signal<boolean>(false);


    initializeAsisstantWithProducts(products: Product[]): void {

        const productListText = products.map(p => 
            `- ${p.title} (${p.category}): $${p.price}`
        ).join(`\n`);

        const systemInstructionText = `
         You are the official AI Shopping Assistant for Luxe Fragrances perfume store.
         Your goal is to help customers choose and buy products from our store catalog.

         CRITICAL RULES:
         1. Act directly as a representative/assistant of Luxe Fragrances store. Never say "as an AI I don't sell perfumes".
         2. ALWAYS recommend products strictly from the store catalog list below.
         3. If a customer asks what fragrances/products we have, list the items from the catalog provided below.

         STORE CATALOG:
         ${productListText || 'No products currently loaded.'}
         `.trim();         

        this.model = this.ai.getGenerativeModel({
            model: 'gemini-3.5-flash-lite',
            systemInstruction: systemInstructionText
        })

        this.chatSession = this.model.startChat({
            history: []
    });

    }



    async sendMessage(userText: string): Promise<void>{
        if(!userText.trim()) return;

        if (!this.chatSession) {
      this.chatSession = this.model.startChat({
        history: [],
        systemInstruction: 'You are an intelligent shopping assistant for the "Shop for all" online store.'
      });
    }

        this.messages.update(prev => [...prev, {sender: 'user', text: userText}]);
        this.isLoading.set(true);


        try{
            const result = await this.chatSession.sendMessage(userText);
            const aiResponse = result.response.text();

            this.messages.update(prev => [...prev, {sender: 'ai', text: aiResponse}]);
        }catch(error){
            console.error('Gemini Api Error', error);
            this.messages.update(prev => [...prev, {sender: 'ai', text: 'Sorry, i am having trouble connecting right now'}]);
        }finally{
            this.isLoading.set(false);
        }
    }
}
