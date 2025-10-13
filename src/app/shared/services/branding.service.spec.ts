import { BrandingService } from './branding.service';

describe('BrandingService', () => {
  let service: BrandingService;
  let setItemSpy: jest.SpyInstance;
  let getItemSpy: jest.SpyInstance;
  let removeItemSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new BrandingService();

    // Mock localStorage
    setItemSpy = jest.spyOn(localStorage['__proto__'], 'setItem');
    getItemSpy = jest.spyOn(localStorage['__proto__'], 'getItem');
    removeItemSpy = jest.spyOn(localStorage['__proto__'], 'removeItem');
    setItemSpy.mockImplementation(jest.fn());
    getItemSpy.mockImplementation(() => null);
    removeItemSpy.mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.head.innerHTML = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init()', () => {
    it('should set logo from saved settings', () => {
      const stored = JSON.stringify({ logo: 'logo-url' });
      getItemSpy.mockReturnValue(stored);

      const faviconSpy = jest.spyOn(service, 'updateFavicon');
      service.init();

      expect(service.logo()).toBe('logo-url');
      expect(faviconSpy).toHaveBeenCalledWith('logo-url');
    });

    it('should handle JSON parse error gracefully', () => {
      getItemSpy.mockReturnValue('invalid-json');
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(jest.fn());

      service.init();

      expect(warnSpy).toHaveBeenCalledWith(
        'brandingSettings JSON parse failed',
        expect.any(Error)
      );
      warnSpy.mockRestore();
    });

    it('should do nothing if no saved value', () => {
      getItemSpy.mockReturnValue(null);
      const faviconSpy = jest.spyOn(service, 'updateFavicon');
      service.init();
      expect(faviconSpy).not.toHaveBeenCalled();
    });
  });

  describe('saveLogo()', () => {
    it('should save and update favicon', () => {
      const faviconSpy = jest.spyOn(service, 'updateFavicon');
      service.saveLogo('data:image/png;base64,test');

      expect(setItemSpy).toHaveBeenCalledWith(
        'brandingSettings',
        expect.stringContaining('data:image/png;base64,test')
      );
      expect(service.logo()).toBe('data:image/png;base64,test');
      expect(faviconSpy).toHaveBeenCalledWith('data:image/png;base64,test');
    });

    it('should handle null logo and delete property', () => {
      const saved = JSON.stringify({ logo: 'old-logo' });
      getItemSpy.mockReturnValue(saved);
      const faviconSpy = jest.spyOn(service, 'updateFavicon');

      service.saveLogo(null);

      expect(setItemSpy).toHaveBeenCalled();
      expect(faviconSpy).toHaveBeenCalledWith(null);
      expect(service.logo()).toBeNull();
    });
  });

  describe('clearLogo()', () => {
    it('should call saveLogo(null)', () => {
      const spy = jest.spyOn(service, 'saveLogo');
      service.clearLogo();
      expect(spy).toHaveBeenCalledWith(null);
    });
  });

  describe('updateFavicon()', () => {
    it('should update existing favicon link', () => {
      const link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);

      service.updateFavicon('new-favicon.ico');

      const found = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      expect(found).toBeTruthy();
      expect(found.href).toContain('new-favicon.ico');
    });

    it('should create a new link element if none exists', () => {
      service.updateFavicon('another-favicon.ico');

      const created = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      expect(created).toBeTruthy();
      expect(created.href).toContain('another-favicon.ico');
    });

    it('should default to favicon.ico when null is passed', () => {
      service.updateFavicon(null);

      const created = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      expect(created).toBeTruthy();
      expect(created.href).toContain('favicon.ico');
    });
  });
});
