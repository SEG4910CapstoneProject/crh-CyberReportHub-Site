import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  private darkModeService = inject(DarkModeService);

  messages = signal<ChatMessage[]>([]);
  userMessage = signal<string>('');
  isDarkMode = signal<boolean>(false);

  ngOnInit(): void {

    this.darkModeService.isDarkMode$.subscribe(mode => {
      this.isDarkMode.set(mode);
    });

    // Initial bot message
    this.messages.update(msgs => [
      ...msgs,
      { sender: 'bot', text: 'Hi there! How can I help you today?' },
    ]);
  }

  sendMessage(): void {
    const trimmed = this.userMessage().trim();
    if (!trimmed) return;

    this.messages.update(msgs => [...msgs, { sender: 'user', text: trimmed }]);
    this.userMessage.set('');
    this.messages.update(msgs => [...msgs, { sender: 'bot', text: '...' }]);

    this.http
      .post<{ reply: string }>('http://localhost:5000/chat', { message: trimmed })
      .subscribe({
        next: res => this.replaceLastBotMessage(res.reply),
        error: () => this.replaceLastBotMessage('Sorry, something went wrong.'),
      });
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

