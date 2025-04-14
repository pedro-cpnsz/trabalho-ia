import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  platformId = inject(PLATFORM_ID);
  prompt = '';
  messages: { from: 'user' | 'ai'; text: string }[] = [];
  loading = false;
  private typingInterval: any;

  constructor(private http: HttpClient) {}

  sendMessage() {
    const userText = this.prompt.trim();
    if (!userText) return;
  
    const userMessage: { from: 'user' | 'ai'; text: string } = { from: 'user', text: userText };
    this.messages.push(userMessage);
    this.prompt = '';
    this.loading = true;
    this.saveHistory();
    this.scrollToBottom();
  
    this.http.post<{ response: string }>('http://localhost:5000/prompt', { prompt: userText }).subscribe({
      next: (res) => {
        const aiMessage: { from: 'user' | 'ai'; text: string } = { from: 'ai', text: '' };
        this.messages.push(aiMessage);
        this.saveHistory();
  
        this.typewriterEffect(
          res.response,
          (partialText) => {
            aiMessage.text = partialText;
            this.scrollToBottom();
          },
          () => {
            this.loading = false;
            this.saveHistory();
          }
        );
      },
      error: () => {
        this.messages.push({ from: 'ai', text: 'Erro ao enviar a mensagem.' });
        this.loading = false;
        this.saveHistory();
      }
    });
  }
  

  scrollToBottom() {
    const container = document.getElementById('chat-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  saveHistory() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('chat-history', JSON.stringify(this.messages));
    }
  }

  loadHistory() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('chat-history');
      if (saved) {
        this.messages = JSON.parse(saved);
      }
    }
  }

  typewriterEffect(text: string, callback: (partialText: string) => void, done: () => void) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        callback(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        done();
      }
    }, 20);
  }  

  resetChat() {
      this.http.post('http://localhost:5000/reset', {}).subscribe(() => {
      this.messages = [];
      this.saveHistory();
    });
  }
  
  ngOnInit() {
    this.loadHistory();
  }
}
