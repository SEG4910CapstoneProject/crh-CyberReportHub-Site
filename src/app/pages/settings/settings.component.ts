import { Component, OnInit, signal, inject } from '@angular/core';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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


  ngOnInit(): void {
    // Initialize form with default values
    this.form = this.fb.group({
      primaryColor: ['#002D72'],
      accentColor: ['#FF5733'],
      logo: [null],
    });

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

  handleLogoUpload(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ():void => {
        this.form.patchValue({ logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  saveSettings(): void {
    const brandingSettings = this.form.value;
    localStorage.setItem('brandingSettings', JSON.stringify(brandingSettings));
    alert('Settings saved!');
  }
}
