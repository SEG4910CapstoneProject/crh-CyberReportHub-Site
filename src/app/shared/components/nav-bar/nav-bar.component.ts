import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NavBarLink, NavBarSelectedLinkOptions } from './nav-bar.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { CrhTranslationService } from '../../services/crh-translation.service';
import { AuthService } from '../../services/auth.service';
import { ColorsService } from '../../services/colors.service';
import {
  Router,
  RoutesRecognized,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import {
  EMPTY,
  expand,
  filter,
  last,
  map,
  mergeMap,
  Observable,
  of,
} from 'rxjs';
import { ResponiveBreakpoint } from '../../directives/responsive.directive';
import { Dialog } from '@angular/cdk/dialog';
import { LoginDialogComponent } from '../../dialogs/login-dialog/login-dialog.component';
import { BrandingService } from '../../services/branding.service';

@Component({
  selector: 'crh-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false,
})
export class NavBarComponent implements OnInit {
  private readonly MOBILE_MODE_KEY: string = 'mobile';
  private readonly DESKTOP_MODE_KEY: string = 'desktop';

  private elementRef: ElementRef = inject(ElementRef);
  private translateService = inject(CrhTranslationService);
  private colorService = inject(ColorsService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(Dialog);
  private authService = inject(AuthService);
  private branding = inject(BrandingService);
  protected logoSrc = computed(() => this.branding.logo() || null);

  protected responiveBreakpointsConfig: ResponiveBreakpoint[] = [
    {
      id: this.MOBILE_MODE_KEY,
    },
    {
      id: this.DESKTOP_MODE_KEY,
      breakpoint: 960,
    },
  ];
  protected isLoggedIn = signal<boolean>(false); // TODO, logging is false here, why protected and why signal??

  protected responsiveModeSignal = signal<string>(this.DESKTOP_MODE_KEY);
  private menuTriggeredOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      //TODO, the dollar sign means the variable is an observable, it is an observable in auth service so that's fine. but acc to stack, the loggedIn should be isLoggedIn. without the $.
      this.isLoggedIn.set(loggedIn);
    });
  }
  protected onAuthButtonClick(): void {
    this.onClickOutsideExtended(); //TODO, whats the point of this??

    if (this.isLoggedIn()) {
      // User is logged in, so this should trigger logout.
      this.authService.logout();
    } else {
      // User is NOT logged in, open the login dialog.
      this.dialog.open(LoginDialogComponent);
    }
  }

  protected selectedLinkSignal = toSignal(
    this.router.events.pipe(
      filter(
        (data): data is RoutesRecognized => data instanceof RoutesRecognized
      ),
      map(recognizedRoute => recognizedRoute.state.root),
      mergeMap(routeSnapshot => this.getFinalChildAsStream(routeSnapshot)),
      map(routeSnapshot => routeSnapshot.data),
      map(data => data['selectedNav'] as NavBarSelectedLinkOptions),
      filter(option => !!option)
    )
  );

  private linkHomeTranslationSignal = toSignal(
    this.translateService.getTranslationFromKeyAsStream('navBar.link.home')
  );
  private linkReportsTranslationSignal = toSignal(
    this.translateService.getTranslationFromKeyAsStream('navBar.link.reports')
  );
  private linkFavTranslationSignal = toSignal(
    this.translateService.getTranslationFromKeyAsStream('navBar.link.fav')
  );
  protected langSelectTranslationSignal = toSignal(
    this.translateService.getTranslationFromKeyAsStream('navBar.langChange')
  );
  protected langSelectAriaTranslationSignal = toSignal(
    this.translateService.getTranslationFromKeyAsStream('navBar.langChangeAria')
  );
  protected loginTranslationSignal = toSignal(
    this.translateService.getTranslationFromKeyAsStream('login.login')
  );
  protected logoutTranslationSignal = toSignal(
    this.translateService.getTranslationFromKeyAsStream('login.logout')
  );

  protected navLinksSignal = computed<NavBarLink[]>(() => {
    const links: NavBarLink[] = [
      {
        id: 'home',
        label: this.linkHomeTranslationSignal(),
        path: '/',
      },
      {
        id: 'reportSearch',
        label: this.linkReportsTranslationSignal(),
        path: '/reports',
      },
      {
        id: 'articles',
        label: 'Articles',
        path: '/articles',
      },
      {
        id: 'chatbot',
        label: 'Chatbot',
        path: '/chatbot',
      },
    ];

    // Only show Favourites if logged in
    if (this.isLoggedIn()) {
      links.push({
        id: 'favourites',
        label: this.linkFavTranslationSignal(),
        path: '/favourites',
      });
    }

    return links;
  });

  protected menuOpened = computed(
    () =>
      this.menuTriggeredOpen() &&
      this.responsiveModeSignal() === this.MOBILE_MODE_KEY
  );

  protected get customCssStyleVars(): string {
    const computedColorStyle = this.colorService.getComputedStyle(
      '--crh-background-contrast-color',
      this.elementRef
    );
    if (!computedColorStyle) {
      return '';
    }
    return `--crh-nav-bar-shadow-color: ${this.colorService.setAlpha(computedColorStyle, 0.25)}`;
  }

  protected onLangChange(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        lang: this.translateService.getCurrentOppositeLanguage(),
      },
      queryParamsHandling: 'merge',
    });
  }

  protected onLogoClick(): void {
    this.router.navigate([''], {
      queryParamsHandling: 'merge',
    });
  }

  protected onBreakpointReached(breakpoint: string | undefined): void {
    this.responsiveModeSignal.set(breakpoint ?? this.MOBILE_MODE_KEY);
  }

  protected onMenuButtonClicked(): void {
    this.menuTriggeredOpen.set(!this.menuTriggeredOpen());
  }

  protected onClickOutsideExtended(): void {
    if (this.menuOpened()) {
      this.menuTriggeredOpen.set(false);
    }
  }

  private getFinalChildAsStream(
    parent: ActivatedRouteSnapshot
  ): Observable<ActivatedRouteSnapshot> {
    return of(parent).pipe(
      expand(routeSnapshot =>
        !routeSnapshot.firstChild ? EMPTY : of(routeSnapshot.firstChild)
      ),
      last(),
      filter((route): route is ActivatedRouteSnapshot => !!route)
    );
  }
}
