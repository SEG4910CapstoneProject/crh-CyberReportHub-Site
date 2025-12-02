import { TestBed } from '@angular/core/testing';
import { CrhTranslationService } from './crh-translation.service';
import { Language } from '../models/languages.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

describe('CrhTranslationService', () => {
  let service: CrhTranslationService;
  let translateService: TranslateService;
  let langChange$: Subject<any>;

  beforeEach(() => {
    langChange$ = new Subject();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: TranslateService,
          useValue: {
            onLangChange: langChange$.asObservable(),
            currentLang: 'en',
            use: jest.fn(),
            get: jest.fn().mockImplementation((key: string) => of(`translated:${key}`)),
          },
        },
      ],
    });

    service = TestBed.inject(CrhTranslationService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each([
    { inLang: 'en', outLang: 'fr' },
    { inLang: 'fr', outLang: 'en' },
  ])('should correctly get opposite lang', ({ inLang, outLang }) => {
    expect(service.getOppositeLanguage(inLang as Language)).toEqual(outLang);
  });

  it.each([
    { inLang: 'en', outLang: 'fr' },
    { inLang: 'fr', outLang: 'en' },
    { inLang: '', outLang: 'fr' },
  ])('should correctly get opposite current lang', ({ inLang, outLang }) => {
    translateService.currentLang = inLang;
    expect(service.getCurrentOppositeLanguage()).toEqual(outLang);
  });

  it('should fallback to en if invalid language emitted', (done) => {
    service.getLanguageAsStream().pipe(take(1)).subscribe(lang => {
      expect(lang).toBe('en');
      done();
    });

    langChange$.next({ lang: 'de' });
  });

  it('should emit valid language when valid emitted', (done) => {
    const emissions: string[] = [];

    service.getLanguageAsStream().subscribe(lang => {
      emissions.push(lang);

      if (emissions.length === 2) {
        expect(emissions[1]).toBe('fr'); 
        done();
      }
    });

    langChange$.next({ lang: 'fr' });
  });

  it('should use translateService.get in getTranslationFromKeyAsStream', (done) => {
    service.getTranslationFromKeyAsStream('hello').pipe(take(1)).subscribe(value => {
      expect(value).toBe('translated:hello');
      expect(translateService.get).toHaveBeenCalledWith('hello');
      done();
    });

    langChange$.next({ lang: 'en' });
  });

  it('getTranslationOnce should return only one value', (done) => {
    service.getTranslationOnce('once').subscribe(value => {
      expect(value).toBe('translated:once');
      done();
    });

    langChange$.next({ lang: 'fr' });
  });

  it('setLanguage should call translateService.use', () => {
    service.setLanguage('fr');
    expect(translateService.use).toHaveBeenCalledWith('fr');
  });
});

