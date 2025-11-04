import { TestBed } from '@angular/core/testing';
import { DarkModeService } from './dark-mode.service';

describe('DarkModeService', () => {
  let service: DarkModeService;

  beforeEach(() => {

    localStorage.clear();
    document.body.className = '';
    TestBed.configureTestingModule({});
    service = TestBed.inject(DarkModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with false if no localStorage value', () => {
    const initialValue = JSON.parse(localStorage.getItem('darkMode') || 'false');
    expect(initialValue).toBeFalsy();
    expect(document.body.classList.contains('dark-mode')).toBeFalsy();
  });

  it('should initialize with true if localStorage value is true', () => {
    localStorage.setItem('darkMode', 'true');
    const newService = new DarkModeService();
    expect(newService['isDarkModeSubject'].value).toBeTruthy();
    expect(document.body.classList.contains('dark-mode')).toBeTruthy();
  });

  it('should set dark mode to true', () => {
    service.setDarkMode(true);
    expect(document.body.classList.contains('dark-mode')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('darkMode')!)).toBeTruthy();
  });

  it('should set dark mode to false', () => {
    service.setDarkMode(false);
    expect(document.body.classList.contains('dark-mode')).toBeFalsy();
    expect(JSON.parse(localStorage.getItem('darkMode')!)).toBeFalsy();
  });

  it('should emit new values when mode changes', (done) => {
    const emittedValues: boolean[] = [];
    const subscription = service.isDarkMode$.subscribe((val) => emittedValues.push(val));

    service.setDarkMode(true);
    service.setDarkMode(false);

    setTimeout(() => {
      expect(emittedValues).toContain(true);
      expect(emittedValues).toContain(false);
      subscription.unsubscribe();
      done();
    });
  });

  it('should call applyMode with correct parameter', () => {
    const spy = jest.spyOn<any, any>(service as any, 'applyMode');
    service.setDarkMode(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

});

