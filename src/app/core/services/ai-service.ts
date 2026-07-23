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

    private apiKey = environment.geminiApiKey;

    private ai = new GoogleGenerativeAI(this.apiKey);

    private model = this.ai.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: 'You are an intelligent shopping assistant for the "Shop for all" online store. Help customers find products, recommend items, and be polite. Keep answers relatively short and friendly.'
    });

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

        const systemInstructionText = `You are an intelligent shopping assistant for the "Shop for all" online store. 
Help customers find products, recommend items based ONLY on the catalog provided below, and be polite. 
Keep answers relatively short and friendly.

Here is the current assortment of our store:
${productListText}`;

        this.model = this.ai.getGenerativeModel({
            model: 'gemini-2.0-flash',
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
