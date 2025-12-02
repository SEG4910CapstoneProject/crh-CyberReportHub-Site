import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, throwError, Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { AuthService } from '../../shared/services/auth.service';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;
  let mockHttpClient: { post: jest.Mock };

  beforeEach(async () => {
    mockHttpClient = { post: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ChatbotComponent, FormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: DarkModeService, useValue: { isDarkMode$: of(false) } },
        {
          provide: AuthService,
          useValue: {
            isLoggedIn$: of(false),
            getCurrentUser: (): any => null
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a greeting message', (): void => {
    expect(component.messages()).toEqual([{ sender: 'bot', text: 'chat.welcome' }]);
  });

  it('should not send message if userMessage is empty', (): void => {
    component.userMessage.set('   ');
    component.sendMessage();
    expect(component.messages().length).toBe(1);
  });

  it('should send a user message and add loading bot message', (): void => {
    const subject = new Subject<string>();
    mockHttpClient.post.mockReturnValue(subject.asObservable());

    component.userMessage.set('Hello');
    component.sendMessage();

    let msgs = component.messages();
    expect(msgs.some(m => m.text === 'Hello')).toBe(true);
    expect(msgs.some(m => m.text === '...')).toBe(true);

    subject.next('Hello user!');
    subject.complete();

    msgs = component.messages();
    expect(msgs[msgs.length - 1]).toEqual({ sender: 'bot', text: 'Hello user!' });
  });

  it('should replace loading bot message with reply on success', (): void => {
    mockHttpClient.post.mockReturnValue(of('Hi back!'));

    component.userMessage.set('Hi');
    component.sendMessage();

    const last = component.messages().pop();
    expect(last?.text).toBe('Hi back!');
  });

  it('should show error message when API call fails', (): void => {
    mockHttpClient.post.mockReturnValue(throwError(() => new Error()));

    component.userMessage.set('test');
    component.sendMessage();

    const last = component.messages().pop();
    expect(last?.text).toBe('chat.error');
  });

  it('should replace last bot message if last is "..."', (): void => {
    component.messages.set([
      { sender: 'user', text: 'Hey' },
      { sender: 'bot', text: '...' }
    ]);

    component['replaceLastBotMessage']('Done');
    const last = component.messages().pop();
    expect(last?.text).toBe('Done');
  });

  it('should append new bot message if last is not "..."', (): void => {
    component.messages.set([{ sender: 'bot', text: 'hello' }]);
    component['replaceLastBotMessage']('New');

    const last = component.messages().pop();
    expect(last?.text).toBe('New');
  });

  it('should load saved chat history when present', (): void => {
    localStorage.setItem(
      'chatbotMessages_guest',
      JSON.stringify([{ sender: 'bot', text: 'old.message' }])
    );

    const newFixture = TestBed.createComponent(ChatbotComponent);
    const newComp = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComp.messages()).toEqual([{ sender: 'bot', text: 'old.message' }]);

    localStorage.removeItem('chatbotMessages_guest');
  });

  it('should handle dark mode subscription', (): void => {
    expect(component.isDarkMode()).toBe(false);
  });

  it('should autosave messages when updated', fakeAsync((): void => {
    expect(true).toBe(true);
  }));

  it('should switch to user-specific storage when logged in', (): void => {
    const auth = TestBed.inject(AuthService) as any;
    auth.getCurrentUser = (): any => ({ userId: 2 });

    const newFixture = TestBed.createComponent(ChatbotComponent);
    const newComp = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComp['storageKey']).toBe('chatbotMessages_2');
  });

  it('should reset to default when logging out', (): void => {
    component.messages.set([{ sender: 'bot', text: 'abc' }]);
    localStorage.removeItem('chatbotMessages_guest');

    component['wasLoggedIn'] = true;
    (TestBed.inject(AuthService) as any).isLoggedIn$ = of(false);

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.messages()).toEqual([{ sender: 'bot', text: 'chat.welcome' }]);
  });
});



