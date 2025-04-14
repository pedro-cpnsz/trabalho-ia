import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  prompt: string = '';
  resposta: string = '';
  carregando: boolean = false;

  constructor(private chatService: ChatService) {}

  enviarPrompt() {
    this.carregando = true;
    this.chatService.enviarPrompt(this.prompt).subscribe({
      next: (res) => {
        this.resposta = res.response;
        this.carregando = false;
      },
      error: (err) => {
        console.error(err);
        this.carregando = false;
      }
    });
  }
}
