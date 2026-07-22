import { Component, inject, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/services/ai-service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css',
})
export class AiAssistant {
  private aiService = inject(AiService);

  messages = this.aiService.messages;
  isLoading = this.aiService.isLoading;

  isOpen = signal<boolean>(false);

  userInput = '';

  toggleChat():void {
    this.isOpen.update(val => !val);
  }

  async onSendMessage(): Promise<void> {
    const textToSend = this.userInput;
    if(!textToSend.trim()) return;

    this.userInput = '';
    await this.aiService.sendMessage(textToSend);
  }
}
