import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ReportResultComponent } from './report-result.component';
import { MockProvider } from 'ng-mocks';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { IocTypeService } from '../../reports/services/ioc-type.service';
import { ColorsService } from '../../../shared/services/colors.service';
import { TranslateModule } from '@ngx-translate/core';
import { Language } from '../../../shared/models/languages.model';
import { SearchReportDetailsResponse } from '../../../shared/sdk/rest-api/model/searchReportDetailsResponse';

global.structuredClone = (val: any): any => JSON.parse(JSON.stringify(val));

describe('ReportResultComponent', () => {
  let component: ReportResultComponent;
  let fixture: ComponentFixture<ReportResultComponent>;
  let componentRef: ComponentRef<ReportResultComponent>;
  let router: Router;
  let iocTypeService: jest.Mocked<IocTypeService>;
  let colorsService: jest.Mocked<ColorsService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ReportResultComponent],
      providers: [
        MockProvider(CrhTranslationService, {
          getLanguageAsStream: jest.fn(
            () => new BehaviorSubject<Language>('en')
          ),
        }),
        MockProvider(IocTypeService, {
          getTypesFromIOCs: jest.fn((iocs: any[]) => [
            {
              id: 1,
              name: 'url',
              iocs,
            },
          ]),
        }),
        MockProvider(ColorsService, {
          getComputedStyle: jest.fn().mockReturnValue('rgb(0, 0, 0)'),
          setAlpha: jest.fn().mockReturnValue('rgba(0, 0, 0, 0.25)'),
        }),
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(ReportResultComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    router = TestBed.inject(Router);
    iocTypeService = TestBed.inject(IocTypeService) as jest.Mocked<IocTypeService>;
    colorsService = TestBed.inject(ColorsService) as jest.Mocked<ColorsService>;

    fixture.detectChanges();
  });

  const buildReport = (overrides: Partial<SearchReportDetailsResponse> = {}): SearchReportDetailsResponse => ({
    reportId: 1,
    reportType: 'DAILY',
    articleTitles: ['title1', 'title2'],
    generatedDate: '2024-05-05T12:34:00Z',
    lastModified: '2024-05-06T12:00:00Z',
    iocs: [
      {
        iocId: 1,
        iocTypeId: 2,
        iocTypeName: 'url',
        value: 'ioc',
      },
    ],
    stats: [
      {
        statisticId: 'id1',
        statisticNumber: 10,
        title: 'statTitle',
        subtitle: 'statSubtitle',
      },
    ],
    emailStatus: false,
    template: 'report_template',
    type: 'report_type',
    ...overrides,
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute reportGeneratedDate and availableIocs', () => {
    const report = buildReport();
    componentRef.setInput('result', report);
    fixture.detectChanges();

    const generated = (component as any).reportGeneratedDate();
    const iocs = (component as any).availableIocs();

    expect(generated).toBe('May 5, 2024');
    expect(iocs[0]).toBe('url: 1');
    expect(iocTypeService.getTypesFromIOCs).toHaveBeenCalledWith(report.iocs);
  });

  it('should return empty availableIocs when result is undefined', () => {
    componentRef.setInput('result', undefined as any);
    fixture.detectChanges();

    const iocs = (component as any).availableIocs();
    expect(iocs).toEqual([]);
  });

  it('should compute emailSent* for emailStatus=false', () => {
    const report = buildReport({ emailStatus: false });
    componentRef.setInput('result', report);
    fixture.detectChanges();

    const key = (component as any).emailSentTranslationKey();
    const icon = (component as any).emailSentIcon();
    const cssClass = (component as any).emailSentClass();

    expect(key).toBe('common.emailStatus.notSent');
    expect(icon).toBe('close');
    expect(cssClass).toBe('report-result-not-sent');
  });

  it('should compute emailSent* for emailStatus=true', () => {
    const report = buildReport({ emailStatus: true });
    componentRef.setInput('result', report);
    fixture.detectChanges();

    const key = (component as any).emailSentTranslationKey();
    const icon = (component as any).emailSentIcon();
    const cssClass = (component as any).emailSentClass();

    expect(key).toBe('common.emailStatus.sent');
    expect(icon).toBe('check');
    expect(cssClass).toBe('report-result-sent');
  });

  it('should compute customCssStyleVars when color style is available', () => {
    const cssVars = (component as any).customCssStyleVars;

    expect(colorsService.getComputedStyle).toHaveBeenCalledWith(
      '--crh-background-contrast-color',
      expect.anything()
    );
    expect(colorsService.setAlpha).toHaveBeenCalledWith('rgb(0, 0, 0)', 0.25);
    expect(cssVars).toBe('--crh-card-color-shadow: rgba(0, 0, 0, 0.25)');
  });

  it('should return empty customCssStyleVars when no computed color style', () => {
    (colorsService.getComputedStyle as jest.Mock).mockReturnValueOnce('');
    const cssVars = (component as any).customCssStyleVars;
    expect(cssVars).toBe('');
  });

  it('should navigate to report details on link click when result exists', () => {
    const report = buildReport({ reportId: 42 });
    componentRef.setInput('result', report);
    fixture.detectChanges();

    const navigateSpy = jest.spyOn(router, 'navigate');

    (component as any).onLinkClick();

    expect(navigateSpy).toHaveBeenCalledWith(['/reports/read/42']);
  });

  it('should not navigate when result is undefined', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    componentRef.setInput('result', undefined as any);
    fixture.detectChanges();

    (component as any).onLinkClick();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should emit _onDelete when onDeleteCard is called and result exists', () => {
    const report = buildReport({ reportId: 99 });
    componentRef.setInput('result', report);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component._onDelete, 'emit');

    (component as any).onDeleteCard();

    expect(emitSpy).toHaveBeenCalledWith(99);
  });

  it('should not emit _onDelete when result is undefined', () => {
    const emitSpy = jest.spyOn(component._onDelete, 'emit');
    componentRef.setInput('result', undefined as any);
    fixture.detectChanges();

    (component as any).onDeleteCard();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should respect isLoggedInSignal input', () => {
    componentRef.setInput('isLoggedInSignal', true);
    fixture.detectChanges();
    expect(component['isLoggedInSignal']()).toBe(true);

    componentRef.setInput('isLoggedInSignal', false);
    fixture.detectChanges();
    expect(component['isLoggedInSignal']()).toBe(false);
  });
});
