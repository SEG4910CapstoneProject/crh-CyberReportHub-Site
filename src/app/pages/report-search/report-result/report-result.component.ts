import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { SearchReportDetailsResponse } from '../../../shared/sdk/rest-api/model/searchReportDetailsResponse';
import { DateTime } from 'luxon';
import { Router } from '@angular/router';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IocTypeService } from '../../reports/services/ioc-type.service';
import { ColorsService } from '../../../shared/services/colors.service';

@Component({
  selector: 'crh-report-result',
  templateUrl: './report-result.component.html',
  styleUrl: './report-result.component.scss',
  standalone: false,
})
export class ReportResultComponent {
  private router = inject(Router);
  private crhTranslationService = inject(CrhTranslationService);
  private iocTypeService = inject(IocTypeService);
  private colorService = inject(ColorsService);
  private elementRef: ElementRef = inject(ElementRef);

  public result = input<SearchReportDetailsResponse>();
  public _onDelete = output<number>();
  public isLoggedInSignal = input<boolean>(false);
  public canDeleteSignal = input<boolean>(false);

  private emailSent = computed(() => {
    const result = this.result();
    if (!result) {
      return undefined;
    }

    return result.emailStatus;
  });

  private currentLanguage = toSignal(
    this.crhTranslationService.getLanguageAsStream()
  );

  protected get customCssStyleVars(): string {
    const computedColorStyle = this.colorService.getComputedStyle(
      '--crh-background-contrast-color',
      this.elementRef
    );
    if (!computedColorStyle) {
      return '';
    }
    return `--crh-card-color-shadow: ${this.colorService.setAlpha(computedColorStyle, 0.25)}`;
  }

  protected reportGeneratedDate = computed(() => {
    const result = this.result();
    if (!result) {
      return undefined;
    }

    const generatedDateTime = DateTime.fromISO(result.generatedDate);
    return generatedDateTime.toLocaleString(DateTime.DATE_FULL, {
      locale: this.currentLanguage(),
    });
  });

  protected availableIocs = computed(() => {
    const result = this.result();
    if (!result) {
      return [];
    }

    const iocTypes = this.iocTypeService.getTypesFromIOCs(result.iocs);
    return iocTypes.map(ioc => ioc.name + ': ' + ioc.iocs.length);
  });

  protected emailSentTranslationKey = computed(() => {
    if (this.emailSent()) {
      return 'common.emailStatus.sent';
    }
    return 'common.emailStatus.notSent';
  });

  protected emailSentIcon = computed(() => {
    if (this.emailSent()) {
      return 'check';
    }
    return 'close';
  });

  protected emailSentClass = computed(() => {
    if (this.emailSent()) {
      return 'report-result-sent';
    }
    return 'report-result-not-sent';
  });

  protected onLinkClick(): void {
    const result = this.result();
    if (result) {
      this.router.navigate([`/reports/read/${result.reportId}`]);
    }
  }

  protected onDeleteCard(): void {
    const result = this.result();
    if (result) {
      this._onDelete.emit(result.reportId);
    }
  }
}
