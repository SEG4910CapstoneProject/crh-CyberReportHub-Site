import { Component, inject, OnInit, signal, effect, runInInjectionContext, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { DarkModeService } from '../../shared/services/dark-mode.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'crh-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChatbotComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private injector = inject(Injector);
  private darkModeService = inject(DarkModeService);

  messages = signal<ChatMessage[]>([]);
  userMessage = signal<string>('');
  isDarkMode = signal<boolean>(false);

  private storageKey = 'chatbotMessages_guest';
  private storage: Storage = sessionStorage; // default for guests

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    // If logged in, switch to persistent localStorage
    if (user) {
      this.storageKey = `chatbotMessages_${user.userId}`;
      this.storage = localStorage;
    }

    // Load previous chat (if exists)
    const saved = this.storage.getItem(this.storageKey);
    if (saved) {
      this.messages.set(JSON.parse(saved));
    } else {
      this.messages.set([{ sender: 'bot', text: 'Hi there! How can I help you today?' }]);
    }

    // Auto-save messages when they change
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.storage.setItem(this.storageKey, JSON.stringify(this.messages()));
      });
    });

    // Track dark mode changes
    this.darkModeService.isDarkMode$.subscribe(mode => {
      this.isDarkMode.set(mode);
    });

    // Clear chat immediately when user logs out
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.storage.removeItem(this.storageKey);
        this.messages.set([{ sender: 'bot', text: 'Hi there! How can I help you today?' }]);
      }
    });
  }

  sendMessage(): void {
    const trimmed = this.userMessage().trim();
    if (!trimmed) return;

    this.messages.update(msgs => [...msgs, { sender: 'user', text: trimmed }]);
    this.userMessage.set('');
    this.messages.update(msgs => [...msgs, { sender: 'bot', text: '...' }]);

    this.http
      .post('http://localhost:8080/api/v1/chat', { message: trimmed }, { responseType: 'text' })
      .subscribe({
        next: reply => this.replaceLastBotMessage(reply),
        error: () => this.replaceLastBotMessage('Sorry, something went wrong.'),
      });
  }

  clearChat(): void {
    this.storage.removeItem(this.storageKey);
    this.messages.set([{ sender: 'bot', text: 'Chat cleared. How can I help you?' }]);
  }

  private replaceLastBotMessage(text: string): void {
    const msgs = this.messages();
    const lastIndex = msgs.length - 1;
    if (msgs[lastIndex]?.sender === 'bot' && msgs[lastIndex].text === '...') {
      msgs[lastIndex] = { sender: 'bot', text };
    } else {
      msgs.push({ sender: 'bot', text });
    }
    this.messages.set([...msgs]);
  }
}
