import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportArticlesComponent } from './report-articles.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { StatisticsService } from '../../../shared/sdk/rest-api/api/statistics.service';
import { ReportsService } from '../../../shared/sdk/rest-api/api/reports.service';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';

describe('ReportArticlesComponent', () => {
  let component: ReportArticlesComponent;
  let fixture: ComponentFixture<ReportArticlesComponent>;
  let reportsServiceMock: any;
  let statisticsServiceMock: any;
  let dialogMock: any;

  beforeEach(async () => {
    reportsServiceMock = {
      addSingleStatToReport: jest.fn(() => of({})),
    };

    statisticsServiceMock = {
      getStatistics: jest.fn(() => of([])),
    };

    dialogMock = {
      open: jest.fn(() => ({
        closed: of({ value: 10, title: 'Title', subtitle: 'SubTitle' }),
      })),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [ReportArticlesComponent],
      providers: [
        { provide: ReportsService, useValue: reportsServiceMock },
        { provide: StatisticsService, useValue: statisticsServiceMock },
        { provide: Dialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a statistic via dialog', () => {
    const initialLength = component.addedStats.length;
    component.openAddStatDialog();
    expect(component.addedStats.length).toBe(initialLength + 1);
  });

  it('should add and remove stats correctly', () => {
    component.addedStats = [
      { statisticId: 'stat-1', statisticNumber: 5, title: 't', subtitle: 's' },
    ];
    component.onStatRemove('stat-1');
    expect(component.addedStats.length).toBe(0);
  });

  it('should call addSingleStatToReport', () => {
    component.reportId = 1;
    component.onStatAdd('stat-123');
    expect(reportsServiceMock.addSingleStatToReport).toHaveBeenCalledWith(
      1,
      'stat-123'
    );
  });
});
