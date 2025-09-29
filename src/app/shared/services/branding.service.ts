import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'brandingSettings'; //to save logo in settings

interface Branding {
  logo: string | null;
}

@Injectable({ providedIn: 'root' })
export class BrandingService {
  logo = signal<string | null>(null);

  init(): void {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<Branding>;
        this.logo.set(parsed.logo ?? null);
        this.updateFavicon(parsed.logo ?? null);
      } catch (e) {
        console.warn('brandingSettings JSON parse failed', e);
      }
    }
  }

  saveLogo(dataUrlOrUrl: string | null): void {
    this.logo.set(dataUrlOrUrl);

    const saved = localStorage.getItem(STORAGE_KEY);
    const current = saved ? JSON.parse(saved) : {};
    if (dataUrlOrUrl == null) {
      delete current.logo;
    } else {
      current.logo = dataUrlOrUrl;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...current, logo: dataUrlOrUrl })
    );

    this.updateFavicon(dataUrlOrUrl); // update favicon immediately
  }

  clearLogo(): void {
    this.saveLogo(null);
  }

  updateFavicon(dataUrlOrUrl: string | null): void {
    let link =
      document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
      document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');

    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    link.href = dataUrlOrUrl ?? 'favicon.ico';
  }
}
