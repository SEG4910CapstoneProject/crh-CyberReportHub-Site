import { TestBed } from '@angular/core/testing';

import { CrhTranslationService } from './crh-translation.service';
import { Language } from '../models/languages.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('CrhTranslationService', () => {
  let service: CrhTranslationService;
  let translationService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(CrhTranslationService);
    translationService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each([
    {
      inLang: 'en',
      outLang: 'fr',
    },
    {
      inLang: 'fr',
      outLang: 'en',
    },
  ])('should correctly get opposite lang', ({ inLang, outLang }) => {
    expect(service.getOppositeLanguage(inLang as Language)).toEqual(outLang);
  });

  it.each([
    {
      inLang: 'en',
      outLang: 'fr',
    },
    {
      inLang: 'fr',
      outLang: 'en',
    },
    {
      inLang: '',
      outLang: 'fr',
    },
  ])('should correctly get opposite current lang', ({ inLang, outLang }) => {
    translationService.currentLang = inLang;
    expect(service.getCurrentOppositeLanguage()).toEqual(outLang);
  });
});
