import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportResultComponent } from './report-result.component';
import { MockProvider } from 'ng-mocks';
import { CrhTranslationService } from '../../../shared/services/crh-translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../../../shared/models/languages.model';
import { ComponentRef } from '@angular/core';
import { SearchReportDetailsResponse } from '../../../shared/sdk/rest-api/model/searchReportDetailsResponse';

global.structuredClone = (val: any): any => JSON.parse(JSON.stringify(val));

describe('ReportResultComponent', () => {
  let component: ReportResultComponent;
  let fixture: ComponentFixture<ReportResultComponent>;
  let componentRef: ComponentRef<ReportResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ReportResultComponent],
      providers: [
        MockProvider(CrhTranslationService, {
          getLanguageAsStream: jest.fn(
            () => new BehaviorSubject<Language>('en')
          ),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportResultComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set report signals', () => {
    const report: SearchReportDetailsResponse = {
      reportId: 1,
      reportType: 'DAILY',
      articleTitles: ['title1', 'title2'],
      generatedDate: '2024-05-05',
      lastModified: '2024-05-06',
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
      template: 'default', //Might need to change this to correct type
      type: 'Weekly',
    };
    componentRef.setInput('result', report);
    fixture.detectChanges();

    expect(component['reportGeneratedDate']()).toEqual('May 5, 2024');
    expect(component['availableIocs']()[0]).toEqual('url: 1');
  });
});
