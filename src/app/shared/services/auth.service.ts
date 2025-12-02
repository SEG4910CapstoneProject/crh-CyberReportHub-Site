import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // installed the library: `npm install jwt-decode`

export interface User {
  userId: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  private API_URL = 'http://localhost:8080/api/v1/auth';
  private API_BASE_URL = 'http://localhost:8080/api/v1';

/**
   * Helper function to perform authenticated API calls.
   * @param endpoint The API endpoint (e.g., 'reports').
   * @param options The standard fetch options.
   * @returns A promise that resolves to the API response.
   */
  public async authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('authToken');

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> ?? {}),
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${this.API_BASE_URL}/${endpoint}`, { ...options, headers });
  }


  private getStoredUser(): User | null {
    const token = localStorage.getItem('authToken');
    if (!token || token.split('.').length !== 3) {
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      return {
        userId: decoded.userId,
        email: decoded.sub,
        role: decoded.role,
      };
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  private checkLoginStatus(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate.getTime() < new Date().getTime();
    } catch (e) {
      console.error('Error decoding token', e);
      return true;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const { token } = await response.json();
      localStorage.setItem('authToken', token);

      const user = this.getStoredUser();
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);

      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  hasAnyRole(...roles: string[]): boolean {
    const userRole = this.currentUserSubject.value?.role;
    return !!userRole && roles.includes(userRole);
  }

  getRole():string | null {
    return this.currentUserSubject?.value?.role || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
