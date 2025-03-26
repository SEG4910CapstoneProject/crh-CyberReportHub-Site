import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {}

  // Check if the user is logged in by checking localStorage
  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('authToken'); // If there's an authToken, the user is logged in
  }

  login(username: string, password: string): boolean {
    // This is mock - replace with real API call
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('authToken', 'mock-auth-token');
      this.isLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('authToken');  // Remove token from localStorage
    this.isLoggedInSubject.next(false);
  }
}
