import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.checkLoginStatus()
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getStoredUser()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  // --- Helpers to handle storage ---
  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('authUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  private checkLoginStatus(): boolean {
    return this.getStoredUser() !== null;
  }

  // --- Login logic with separate accounts ---
  login(username: string, password: string): boolean {
    let user: User | null = null;

    if (username === 'admin' && password === 'password') {
      user = { username: 'admin', role: 'admin' };
    } else if (username === 'analyst' && password === 'password') {
      user = { username: 'analyst', role: 'analyst' };
    } else if (username === 'restricted_analyst' && password === 'password') {
      user = { username: 'restricted_analyst', role: 'restricted_analyst' };
    }

    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem('authUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // --- Keep old style helper functions ---
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
