import { Component, inject, OnInit, signal, effect, runInInjectionContext, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { TranslateModule } from '@ngx-translate/core';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'crh-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
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
  private storage: Storage = localStorage; // add persistence for guests
  private wasLoggedIn = false; // Tracks when to clear chats
  private initialized = false;

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
      this.messages.set([{ sender: 'bot', text: 'chat.welcome' }]);
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

    // login/logout transition handling
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {

      if (!this.initialized) {
          this.initialized = true;
          this.wasLoggedIn = isLoggedIn;
          return;
        }

      if (this.wasLoggedIn !== isLoggedIn) {

        // ---- USER LOGGED OUT ----
        if (!isLoggedIn) {
          this.storageKey = 'chatbotMessages_guest';
          this.storage = localStorage;

          // Load guest history if exists, else reset
          const guestSaved = this.storage.getItem(this.storageKey);
          this.messages.set(
            guestSaved ? JSON.parse(guestSaved) :
            [{ sender: 'bot', text: 'Hi there! How can I help you today?' }]
            [{ sender: 'bot', text: 'chat.welcome' }]
          );

          return;
        }

        // ---- USER LOGGED IN ----
        if (isLoggedIn) {
          const newUser = this.authService.getCurrentUser();
          if (newUser) {
            this.storageKey = `chatbotMessages_${newUser.userId}`;
            this.storage = localStorage;

            const userSaved = this.storage.getItem(this.storageKey);

            // Only set messages if switching users or first load
            this.messages.set(
              userSaved ? JSON.parse(userSaved) :
              [{ sender: 'bot', text: 'chat.welcome' }]
            );
          }
        }
      }

      this.wasLoggedIn = isLoggedIn;
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
        error: () => this.replaceLastBotMessage('chat.error'),
      });
  }

  clearChat(): void {
    this.storage.removeItem(this.storageKey);
    this.messages.set([{ sender: 'bot', text: 'chat.cleared' }]);
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
