import { inject, Injectable } from '@angular/core';
import { concatMap, map, Observable, shareReplay, startWith } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../models/languages.model';

@Injectable({
  providedIn: 'root',
})
export class CrhTranslationService {
  private translateService = inject(TranslateService);

  private userLanguage$ = this.translateService.onLangChange.pipe(
    map(({ lang }) => lang),
    map(lang => (this.isLanguageValid(lang) ? lang : 'en')),
    startWith('en' as Language),
    shareReplay()
  );

  public getTranslationFromKeyAsStream(
    translationKey: string
  ): Observable<string> {
    return this.userLanguage$.pipe(
      concatMap(() => this.translateService.get(translationKey))
    );
  }

  public setLanguage(lang: Language): void {
    this.translateService.use(lang);
  }

  public isLanguageValid(str: string | null | undefined): str is Language {
    return str === 'en' || str === 'fr';
  }

  public getLanguageAsStream(): Observable<Language> {
    return this.userLanguage$;
  }

  public getCurrentOppositeLanguage(): Language {
    return this.getOppositeLanguage(
      this.translateService.currentLang as Language
    );
  }

  public getOppositeLanguage(lang: Language | ''): Language {
    return lang === 'fr' ? 'en' : 'fr';
  }
}
