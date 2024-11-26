import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHeaderComponent } from './report-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReportHeaderInfo } from './report-header.models';
import { ComponentRef } from '@angular/core';
import { DateTime } from 'luxon';
import { LuxonDateFormatterPipe } from '../../pipes/luxon-date-formatter.pipe';
import { CrhTranslationService } from '../../services/crh-translation.service';

describe('ReportHeaderComponent', () => {
  let component: ReportHeaderComponent;
  let componentRef: ComponentRef<ReportHeaderComponent>;
  let fixture: ComponentFixture<ReportHeaderComponent>;

  const reportHeaderInfoMock: ReportHeaderInfo = {
    reportDate: DateTime.utc(2024, 7, 11),
    generatedDate: DateTime.utc(2024, 7, 10),
    lastModifiedDate: DateTime.utc(2024, 7, 9),
    isEmailSent: true,
  };

  const reportDateFormatted = '2024/07/11';
  const generatedDateFormatted = '2024-07-10';
  const lastModifiedDateFormatted = '2024-07-09';

  const noDataStr = 'common.noData';
  const emailSentStr = 'reportheader.emailSent';
  const emailNotSentStr = 'reportheader.emailNotSent';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ReportHeaderComponent],
      providers: [LuxonDateFormatterPipe, CrhTranslationService],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportHeaderComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format report dates when defined', () => {
    componentRef.setInput('reportInfo', reportHeaderInfoMock);
    fixture.detectChanges();
    expect(component.formattedReportDateSignal()).toBe(reportDateFormatted);
    expect(component.formattedGeneratedDateSignal()).toBe(
      generatedDateFormatted
    );
    expect(component.formattedModifiedDateSignal()).toBe(
      lastModifiedDateFormatted
    );
  });

  it('should show nodata for report dates when undefined', () => {
    componentRef.setInput('reportInfo', undefined);
    fixture.detectChanges();
    expect(component.formattedReportDateSignal()).toBe('');
    expect(component.formattedGeneratedDateSignal()).toBe(noDataStr);
    expect(component.formattedModifiedDateSignal()).toBe(noDataStr);
  });

  it('should use email sent translation when status is true', () => {
    componentRef.setInput('reportInfo', reportHeaderInfoMock);
    fixture.detectChanges();
    expect(component.emailStatusStringSignal()).toBe(emailSentStr);
  });

  it('should use email not sent translation when status is false', () => {
    componentRef.setInput('reportInfo', {
      reportDate: DateTime.utc(2024, 7, 11),
      generatedDate: DateTime.utc(2024, 7, 10),
      lastModifiedDate: DateTime.utc(2024, 7, 9),
      isEmailSent: false,
    });
    fixture.detectChanges();
    expect(component.emailStatusStringSignal()).toBe(emailNotSentStr);
  });

  it('should use no data string when report info not available', () => {
    componentRef.setInput('reportInfo', undefined);
    fixture.detectChanges();
    expect(component.emailStatusStringSignal()).toBe(noDataStr);
  });
});
