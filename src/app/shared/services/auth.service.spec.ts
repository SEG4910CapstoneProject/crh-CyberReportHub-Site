import { AuthService, User } from './auth.service';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

/* eslint-disable @typescript-eslint/no-empty-function */
const noop = (): void => {};
/* eslint-enable @typescript-eslint/no-empty-function */

describe('AuthService', () => {
  let service: AuthService;
  let mockFetch: jest.Mock;

  beforeEach((): void => {
    jest.clearAllMocks();

    mockFetch = jest.fn();
    (global as any).fetch = mockFetch;

    const store: Record<string, string> = {};

    jest
      .spyOn(localStorage['__proto__'], 'getItem')
      .mockImplementation(((key: string): string => store[key]) as any);

    jest
      .spyOn(localStorage['__proto__'], 'setItem')
      .mockImplementation(((key: string, value: string): void => {
        store[key] = value;
      }) as any);

    jest
      .spyOn(localStorage['__proto__'], 'removeItem')
      .mockImplementation(((key: string): void => {
        delete store[key];
      }) as any);

    service = new AuthService();
  });

  afterEach((): void => {
    jest.restoreAllMocks();
  });

  describe('authenticatedFetch', () => {
    it('should include Authorization header if token exists', async (): Promise<void> => {
      localStorage.setItem('authToken', 'fakeToken123');
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async (): Promise<unknown> => ({}),
      } as any);

      await service.authenticatedFetch('reports', { method: 'GET' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/reports',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fakeToken123',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should not include Authorization header if no token', async (): Promise<void> => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async (): Promise<unknown> => ({}),
      } as any);

      await service.authenticatedFetch('reports');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/reports',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        })
      );
    });
  });

  describe('getStoredUser', () => {
    it('should return user from valid token', (): void => {
      (jwtDecode as jest.Mock).mockReturnValue({
        userId: '123',
        sub: 'test@example.com',
        role: 'ADMIN',
      });
      localStorage.setItem('authToken', 'valid.token.here');

      const result = (service as any).getStoredUser();
      expect(result).toEqual({
        userId: '123',
        email: 'test@example.com',
        role: 'ADMIN',
      });
    });

    it('should return null for invalid token structure', (): void => {
      localStorage.setItem('authToken', 'invalidtoken');
      const result = (service as any).getStoredUser();
      expect(result).toBeNull();
    });

    it('should catch decode error and return null', (): void => {
      (jwtDecode as jest.Mock).mockImplementation((): never => {
        throw new Error('bad token');
      });
      localStorage.setItem('authToken', 'a.b.c');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      const result = (service as any).getStoredUser();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Invalid token', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token (not expired)', (): void => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      (jwtDecode as jest.Mock).mockReturnValue({ exp: futureTime });

      const result = (service as any).isTokenExpired('valid.token');
      expect(result).toBe(false);
    });

    it('should return true for expired token', (): void => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      (jwtDecode as jest.Mock).mockReturnValue({ exp: pastTime });

      const result = (service as any).isTokenExpired('expired.token');
      expect(result).toBe(true);
    });

    it('should handle decode error gracefully', (): void => {
      (jwtDecode as jest.Mock).mockImplementation((): never => {
        throw new Error('decode failed');
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      const result = (service as any).isTokenExpired('bad.token');
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('Error decoding token', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('checkLoginStatus', () => {
    it('should return false if no token', (): void => {
      const result = (service as any).checkLoginStatus();
      expect(result).toBe(false);
    });

    it('should return true if token exists and not expired', (): void => {
      localStorage.setItem('authToken', 'token');
      jest.spyOn(service as any, 'isTokenExpired').mockReturnValue(false);
      const result = (service as any).checkLoginStatus();
      expect(result).toBe(true);
    });

    it('should return false if token expired', (): void => {
      localStorage.setItem('authToken', 'token');
      jest.spyOn(service as any, 'isTokenExpired').mockReturnValue(true);
      const result = (service as any).checkLoginStatus();
      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    it('should handle successful login and store token', async (): Promise<void> => {
      const mockResponse = {
        ok: true,
        json: async (): Promise<{ token: string }> => ({ token: 'jwt.token' }),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      (jwtDecode as jest.Mock).mockReturnValue({
        userId: '1',
        sub: 'email@test.com',
        role: 'USER',
      });

      const result = await service.login('email@test.com', 'password123');
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'jwt.token');
    });

    it('should return false if response not ok', async (): Promise<void> => {
      mockFetch.mockResolvedValue({ ok: false } as any);
      const result = await service.login('email', 'pass');
      expect(result).toBe(false);
    });

    it('should handle fetch error gracefully', async (): Promise<void> => {
      mockFetch.mockRejectedValue(new Error('Network fail'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      const result = await service.login('email', 'pass');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Login failed', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('should clear token and reset subjects', (): void => {
      localStorage.setItem('authToken', 'jwt');
      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(service.isLoggedIn()).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('state getters', () => {
    it('isLoggedIn() should reflect BehaviorSubject', (): void => {
      (service as any).isLoggedInSubject.next(true);
      expect(service.isLoggedIn()).toBe(true);
    });

    it('hasRole() should check user role', (): void => {
      (service as any).currentUserSubject.next({
        userId: '1',
        email: 'a',
        role: 'ADMIN',
      });
      expect(service.hasRole('ADMIN')).toBe(true);
      expect(service.hasRole('USER')).toBe(false);
    });

    it('getCurrentUser() should return current user', (): void => {
      const user: User = { userId: '2', email: 'x@test.com', role: 'USER' };
      (service as any).currentUserSubject.next(user);
      expect(service.getCurrentUser()).toEqual(user);
    });
  });
});
