import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CyberReportHubComponent } from './cyber-report-hub.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CrhTranslationService } from './shared/services/crh-translation.service';

describe('CyberReportHubComponent', () => {
  let fixture: ComponentFixture<CyberReportHubComponent>;
  let app: CyberReportHubComponent;
  let paramQueryMap: BehaviorSubject<ParamMap>;

  beforeEach(async () => {
    paramQueryMap = new BehaviorSubject<ParamMap>(convertToParamMap({}));

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [CyberReportHubComponent],
      providers: [
        TranslateService,
        MockProvider(ActivatedRoute, {
          queryParamMap: paramQueryMap,
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CyberReportHubComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should set correct language', () => {
    const expectedLang = 'fr';
    const translationService = TestBed.inject(CrhTranslationService);
    const setLangSpy = jest.spyOn(translationService, 'setLanguage');

    paramQueryMap.next(convertToParamMap({ lang: expectedLang }));
    fixture.detectChanges();
    expect(setLangSpy).toHaveBeenCalled();
  });
});
