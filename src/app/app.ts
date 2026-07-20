import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";
import { AiAssistant } from "./shared/components/ai-assistant/ai-assistant";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AiAssistant],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
