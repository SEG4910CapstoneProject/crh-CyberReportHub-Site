import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(
    this.getInitialMode()
  ); //from local storage
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.applyMode(this.isDarkModeSubject.value);
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark); //update state
    this.applyMode(isDark); //update body claas
    localStorage.setItem('darkMode', JSON.stringify(isDark)); //save pref
  }

  private applyMode(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  private getInitialMode(): boolean {
    return JSON.parse(localStorage.getItem('darkMode') || 'false'); //restore initial mode from storage.
  }
}
