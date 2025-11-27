import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, throwError, Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;
  let mockHttpClient: { post: jest.Mock };

  beforeEach(async () => {
    mockHttpClient = {
      post: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ChatbotComponent, FormsModule, TranslateModule.forRoot()],
      providers: [{ provide: HttpClient, useValue: mockHttpClient }]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a greeting message', () => {
    const messages = component.messages();
    expect(messages.length).toBe(1);
    expect(messages[0].sender).toBe('bot');
    expect(messages[0].text).toContain('Hi there');
  });

  it('should not send message if userMessage is empty', () => {
    component.userMessage.set('   ');
    component.sendMessage();
    const msgs = component.messages();
    expect(msgs.length).toBe(1); // Only the initial greeting
  });

  it('should send a user message and add loading bot message', fakeAsync(() => {
    const subject = new Subject<string>();

    mockHttpClient.post.mockReturnValue(subject.asObservable());

    component.userMessage.set('Hello');
    component.sendMessage();

    // Check user message + loading state
    let msgs = component.messages();
    expect(msgs.some(m => m.sender === 'user' && m.text === 'Hello')).toBe(true);
    expect(msgs.some(m => m.sender === 'bot' && m.text === '...')).toBe(true);

    // Simulate API response
    subject.next('Hello user!');
    subject.complete();
    tick();

    msgs = component.messages();
    const lastMsg = msgs[msgs.length - 1];
    expect(lastMsg.sender).toBe('bot');
    expect(lastMsg.text).toBe('Hello user!');
  }));

  it('should replace loading bot message with reply on success', () => {
    mockHttpClient.post.mockReturnValue(of('Hi back!'));

    component.userMessage.set('Hi');
    component.sendMessage();

    const finalMessages = component.messages();
    const lastMsg = finalMessages[finalMessages.length - 1];
    expect(lastMsg.sender).toBe('bot');
    expect(lastMsg.text).toBe('Hi back!');
  });

  it('should show error message when API call fails', () => {
    mockHttpClient.post.mockReturnValue(throwError(() => new Error('Network fail')));

    component.userMessage.set('test');
    component.sendMessage();

    const finalMessages = component.messages();
    const lastMsg = finalMessages[finalMessages.length - 1];
    expect(lastMsg.text).toBe('Sorry, something went wrong.');
  });

  it('should replace last bot message correctly if last is "..."', () => {
    component.messages.set([
      { sender: 'user', text: 'Hey' },
      { sender: 'bot', text: '...' }
    ]);

    component['replaceLastBotMessage']('Got it');
    const msgs = component.messages();
    expect(msgs[msgs.length - 1].text).toBe('Got it');
  });

  it('should append a new bot message if last is not "..."', () => {
    component.messages.set([{ sender: 'user', text: 'Hi' }]);
    component['replaceLastBotMessage']('Bot reply');
    const msgs = component.messages();
    expect(msgs[msgs.length - 1].text).toBe('Bot reply');
  });
});
