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

  constructor(private http: HttpClient) {}

  async sendPrompt() {
    if (!this.prompt.trim()) return;

    this.messages.push({ from: 'user', text: this.prompt });
    const currentPrompt = this.prompt;
    this.prompt = '';
    this.loading = true;

    try {
      const res: any = await this.http.post('http://localhost:5000/prompt', { prompt: currentPrompt }).toPromise();
      this.messages.push({ from: 'ai', text: res.response });
      this.saveHistory();
    } catch (err) {
      this.messages.push({ from: 'ai', text: 'Erro ao se comunicar com o servidor.' });
    } finally {
      this.loading = false;
      setTimeout(() => this.scrollToBottom(), 100);
    }
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

  ngOnInit() {
    this.loadHistory();
  }
}
