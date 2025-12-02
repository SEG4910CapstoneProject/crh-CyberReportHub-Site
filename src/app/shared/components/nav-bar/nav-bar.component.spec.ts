import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

describe('NavBarComponent – Extended Coverage', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let authMock: any;
  let router: Router;

  beforeEach(async () => {
    authMock = {
      isLoggedIn$: of(true),
      logout: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [NavBarComponent],
      providers: [
        MockProvider(Dialog),
        { provide: AuthService, useValue: authMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should update isLoggedIn on init', () => {
    expect(component['isLoggedIn']()).toBe(true);
  });

  it('should call logout when clicking auth button while logged in', () => {
    component['isLoggedIn'].set(true);
    component['onAuthButtonClick']();
    expect(authMock.logout).toHaveBeenCalled();
  });

  it('should open login dialog when not logged in', () => {
    const dialog = TestBed.inject(Dialog);
    const openSpy = jest.spyOn(dialog, 'open');

    component['isLoggedIn'].set(false);
    component['onAuthButtonClick']();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should include favourites link ONLY when logged in', () => {
    component['isLoggedIn'].set(true);
    const links = component['navLinksSignal']();
    expect(links.some(l => l.id === 'favourites')).toBe(true);

    component['isLoggedIn'].set(false);
    const links2 = component['navLinksSignal']();
    expect(links2.some(l => l.id === 'favourites')).toBe(false);
  });

  it('should toggle menu on button click', () => {
    expect(component['menuTriggeredOpen']()).toBe(false);
    component['onMenuButtonClicked']();
    expect(component['menuTriggeredOpen']()).toBe(true);
  });

  it('should close menu when clicking outside in mobile mode', () => {
    component['responsiveModeSignal'].set('mobile');
    component['menuTriggeredOpen'].set(true);

    component['onClickOutsideExtended']();

    expect(component['menuTriggeredOpen']()).toBe(false);
  });

  it('should update responsive mode', () => {
    component['onBreakpointReached']('mobile');
    expect(component['responsiveModeSignal']()).toBe('mobile');
  });

  it('should change language through router', () => {
    const spy = jest.spyOn(router, 'navigate');

    component['onLangChange']();

    expect(spy).toHaveBeenCalled();
  });

  it('should navigate home on logo click', () => {
    const spy = jest.spyOn(router, 'navigate');

    component['onLogoClick']();

    expect(spy).toHaveBeenCalledWith([''], { queryParamsHandling: 'merge' });
  });
});
