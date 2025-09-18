import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreadcrumbConfig, ReportHeaderInfo } from './report-header.models';
import { LuxonDateFormatterPipe } from '../../pipes/luxon-date-formatter.pipe';
import { DateTime } from 'luxon';
import { CrhTranslationService } from '../../services/crh-translation.service';

@Component({
  selector: 'crh-report-header',
  templateUrl: './report-header.component.html',
  styleUrl: './report-header.component.scss',
  standalone: false,
})
export class ReportHeaderComponent {
  private readonly EMAIL_SENT_KEY = 'reportheader.emailSent';
  private readonly EMAIL_NOT_SENT_KEY = 'reportheader.emailNotSent';
  private readonly NO_DATA_KEY = 'common.noData';

  private luxonDateFormatterPipe = inject(LuxonDateFormatterPipe);
  private translateService = inject(CrhTranslationService);

  public reportInfo = input<ReportHeaderInfo>();
  public breadcrumbs = input<BreadcrumbConfig[]>();

  private noDataTranslationSignal = toSignal(
    this.translateService.getTranslationFromKeyAsStream(this.NO_DATA_KEY)
  );

  protected isBreadcrumbsAvailableSignal = computed(() => {
    const breadcrumbs = this.breadcrumbs();
    return breadcrumbs! && breadcrumbs.length > 0;
  });

  public formattedReportDateSignal = computed(() => {
    const reportDate = this.reportInfo()?.reportDate;

    if (!reportDate) {
      return '';
    }
    return this.luxonDateFormatterPipe.transform(reportDate, 'short');
  });

  public formattedGeneratedDateSignal = computed(() =>
    this.formatDateAsISO8601(this.reportInfo()?.generatedDate)
  );

  public formattedModifiedDateSignal = computed(() =>
    this.formatDateAsISO8601(this.reportInfo()?.lastModifiedDate)
  );

  public isEmailSentSignal = computed(() => {
    const reportInfo = this.reportInfo();
    if (!reportInfo) {
      return undefined;
    }
    return reportInfo.isEmailSent;
  });

  public emailStatusStringSignal = computed(() => {
    if (this.isEmailSentSignal() === undefined) {
      return this.NO_DATA_KEY;
    }
    if (this.isEmailSentSignal()) {
      return this.EMAIL_SENT_KEY;
    } else {
      return this.EMAIL_NOT_SENT_KEY;
    }
  });

  private formatDateAsISO8601(date?: DateTime): string | null {
    if (date === undefined) {
      return this.noDataTranslationSignal() ?? null;
    }
    return this.luxonDateFormatterPipe.transform(date, 'iso-short');
  }

  protected onBreadcrumbClick(onClick?: () => void): void {
    if (onClick) {
      onClick();
    }
  }
}
