import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SettingsComponent } from './settings.component';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { AuthService } from '../../shared/services/auth.service';
import { BrandingService } from '../../shared/services/branding.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockDarkMode: any;
  let mockAuth: any;
  let mockBranding: any;

  const STORAGE_KEY = 'brandingSettings';

  beforeEach(async () => {
    mockDarkMode = {
      isDarkMode$: of(false),
      setDarkMode: jest.fn(),
    };
    mockAuth = {
      currentUser$: of({ role: 'ADMIN' }),
    };
    mockBranding = {
      logo: jest.fn().mockReturnValue('default-logo.png'),
      init: jest.fn(),
      clearLogo: jest.fn(),
      saveLogo: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        FormBuilder,
        { provide: DarkModeService, useValue: mockDarkMode },
        { provide: AuthService, useValue: mockAuth },
        { provide: BrandingService, useValue: mockBranding },
      ],
    }).compileComponents();

    localStorage.clear();
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and init form defaults', () => {
    expect(component).toBeTruthy();
    expect(component.form.value.primaryColor).toBe('#002D72');
  });

  it('should load saved settings from localStorage on init', () => {
    const saved = {
      primaryColor: '#000000',
      accentColor: '#FFFFFF',
      logo: 'logo.png',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    jest.spyOn(console, 'warn').mockImplementation(() => {});
    component.ngOnInit();
    expect(component.form.value.primaryColor).toBe('#000000');
    expect(component.preview()).toBe('logo.png');
  });

  it('should handle corrupted JSON gracefully', () => {
    localStorage.setItem(STORAGE_KEY, '{badjson');
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    jest.spyOn(component as any, 'loadBrandingSettings').mockImplementation(() => {});
    component.ngOnInit();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('onToggleChange should call darkModeService.setDarkMode', () => {
    const event = { target: { checked: true } } as any;
    component.onToggleChange(event);
    expect(mockDarkMode.setDarkMode).toHaveBeenCalledWith(true);
  });

  it('onClearlogo should clear preview, call clearLogo, and remove logo from storage', () => {
    const saved = { logo: 'x.png', primaryColor: '#111' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    component.preview.set('old');
    component.onClearlogo();

    expect(component.preview()).toBeNull();
    expect(mockBranding.clearLogo).toHaveBeenCalled();

    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(parsed.logo).toBeUndefined();
  });

  it('handleLogoUpload should set preview to reader.result', async () => {
    const blob = new Blob(['dummy'], { type: 'image/png' });
    const file = new File([blob], 'file.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as any;

    const fakeReader: any = {
      readAsDataURL: jest.fn(),
      onload: null,
      result: 'data:image/png;base64,fake',
    };
    jest.spyOn(window as any, 'FileReader').mockImplementation(() => fakeReader);

    component.handleLogoUpload(event);
    fakeReader.onload();
    expect(component.preview()).toBe('data:image/png;base64,fake');
  });

  it('handleLogoUpload should exit early if no file', () => {
    const previewSpy = jest.spyOn(component.preview, 'set');
    component.handleLogoUpload({ target: { files: [] } } as any);
    expect(previewSpy).not.toHaveBeenCalled();
  });

  it('saveSettings should persist merged settings and call branding.saveLogo', () => {
    component.form.patchValue({
      primaryColor: '#123',
      accentColor: '#abc',
    });
    component.preview.set('logo123');
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.saveSettings();

    expect(mockBranding.saveLogo).toHaveBeenCalledWith('logo123');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.primaryColor).toBe('#123');
    expect(stored.logo).toBe('logo123');
  });

  it('updateFavicon should set link href if link exists', () => {
    const link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);

    (component as any).updateFavicon('favicon.ico');
    expect(link.href).toContain('favicon.ico');

    link.remove();
  });

  it('loadBrandingSettings should patch values from localStorage', () => {
    const settings = { primaryColor: '#111', accentColor: '#222', logo: 'L' };
    localStorage.setItem('brandingSettings', JSON.stringify(settings));

    (component as any).loadBrandingSettings();
    expect(component.form.value.primaryColor).toBe('#111');
  });

  it('loadBrandingSettings should skip if nothing stored', () => {
    localStorage.removeItem('brandingSettings');
    const spy = jest.spyOn(component.form, 'patchValue');
    (component as any).loadBrandingSettings();
    expect(spy).not.toHaveBeenCalled();
  });
});
