import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Language } from './shared/models/languages.model';
import { CrhTranslationService } from './shared/services/crh-translation.service';

@Component({
  selector: 'crh-cyber-report-hub',
  templateUrl: './cyber-report-hub.component.html',
  styleUrl: './cyber-report-hub.component.scss',
})
export class CyberReportHubComponent {
  title = 'test';

  private translateService = inject(TranslateService);
  private crhTranslationService = inject(CrhTranslationService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.translateService.setDefaultLang('en');

    this.activatedRoute.queryParamMap
      .pipe(
        map(paramMap => paramMap.get('lang')),
        filter((lang): lang is Language =>
          this.crhTranslationService.isLanguageValid(lang)
        ),
        tap(lang => this.crhTranslationService.setLanguage(lang)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
