import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  // BehaviorSubject is a variant of Subject that requires an initial value and emits its current value whenever it is subscribed to.

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Check if the user is logged in by checking localStorage
  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('authToken'); // If there's an authToken, the user is logged in
    //  if getItem says null. what does this method return??? well apparently !! changes any value to a boolean, kinda makes sense here
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
