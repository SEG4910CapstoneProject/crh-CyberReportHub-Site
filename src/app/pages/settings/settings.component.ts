import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrandingService } from '../../shared/services/branding.service';

const STORAGE_KEY = 'brandingSettings';

@Component({
    selector: 'crh-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    standalone: false
})
export class SettingsComponent implements OnInit {
  // State signals
  protected isDarkMode = signal(false);
  protected isLoggedIn = signal(false);
  form: FormGroup = new FormGroup({});

  // Inject dependencies
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private darkModeService = inject(DarkModeService);
  private branding = inject(BrandingService);

  // live preview (falls back to saved logo)
  preview = signal<string | null>(null);
  logoToSave = computed(() => this.preview() ?? this.branding.logo());


  ngOnInit(): void {
    // Initialize form with default values
    this.form = this.fb.group({
      primaryColor: ['#002D72'],
      accentColor: ['#FF5733'],

    });

   // hydrate logo + colors
   this.branding.init();
   const saved = localStorage.getItem(STORAGE_KEY);
   if (saved) {
     try {
       const parsed = JSON.parse(saved);
       this.form.patchValue({
         primaryColor: parsed.primaryColor ?? '#002D72',
         accentColor: parsed.accentColor ?? '#FF5733',
       });
       // live preview starts with saved logo
       this.preview.set(parsed.logo ?? this.branding.logo());
     } catch {}
   }

    // Subscribe to dark mode and login status
    this.darkModeService.isDarkMode$.subscribe(mode =>
      this.isDarkMode.set(mode)
    );
    this.authService.isLoggedIn$.subscribe(status =>
      this.isLoggedIn.set(status)
    );

    // Load saved branding settings
    this.loadBrandingSettings();
  }
  private updateFavicon(dataUrlOrUrl: string | null) {
    const link: HTMLLinkElement | null =
      document.querySelector('link[rel="icon"]') ||
      document.querySelector('link[rel="shortcut icon"]');
    if (link && dataUrlOrUrl) {
      link.href = dataUrlOrUrl;
    }
  }

  private loadBrandingSettings(): void {
    const savedSettings = localStorage.getItem('brandingSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.form.patchValue({
        primaryColor: settings.primaryColor || '#002D72',
        accentColor: settings.accentColor || '#FF5733',
        logo: settings.logo || null,
      });
    }
  }

  onToggleChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.darkModeService.setDarkMode(isChecked);
  }

  handleLogoUpload(ev: Event) {
    const file = (ev.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.preview.set(reader.result as string);
    reader.readAsDataURL(file);
  }


  saveSettings(): void {

    this.branding.saveLogo(this.logoToSave());

    // merge colors
    const saved = localStorage.getItem(STORAGE_KEY);
    const current = saved ? JSON.parse(saved) : {};
    const next = {
      ...current,
      primaryColor: this.form.value.primaryColor,
      accentColor: this.form.value.accentColor,
      logo: this.logoToSave(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    alert('Settings saved!');
  }

}
