import { Component, computed, inject, input, signal } from '@angular/core';
import { ResponiveBreakpoint } from '../../../shared/directives/responsive.directive';
import { ReportHeaderInfo } from '../../../shared/components/report-header/report-header.models';
import { PageMode } from './report-layout.models';
import { Router } from '@angular/router';

@Component({
    selector: 'crh-report-layout',
    templateUrl: './report-layout.component.html',
    styleUrl: './report-layout.component.scss',
    standalone: false
})
export class ReportLayoutComponent {
  protected readonly MOBILE_BREAKPOINT_KEY = 'mobile';
  protected readonly DESKTOP_BREAKPOINT_KEY = 'desktop';

  private router = inject(Router);

  protected responsiveBreakpointsConfig: ResponiveBreakpoint[] = [
    {
      id: this.MOBILE_BREAKPOINT_KEY,
    },
    {
      id: this.DESKTOP_BREAKPOINT_KEY,
      breakpoint: 1100,
    },
  ];

  public reportHeaderInfo = input<ReportHeaderInfo>();
  public pageMode = input<PageMode>();
  public reportId = input<number>();

  protected breakpointModeKey = signal<string | undefined>(undefined);

  protected viewEditTranslationKey = computed(() => {
    const pageMode = this.pageMode();

    return pageMode == 'edit' ? 'report.layout.view' : 'report.layout.edit';
  });

  protected onBreakpointReached(breakpoint: string | undefined): void {
    this.breakpointModeKey.set(breakpoint);
  }

  protected onEditViewClick(): void {
    const reportId = this.reportId();
    const routeToNav = `/reports/${this.pageMode() == 'edit' ? 'read' : 'edit'}/${reportId}`;

    this.router.navigate([routeToNav]);
  }
}
