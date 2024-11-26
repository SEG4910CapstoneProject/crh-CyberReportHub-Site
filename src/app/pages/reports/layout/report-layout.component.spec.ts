import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLayoutComponent } from './report-layout.component';
import { MockProvider } from 'ng-mocks';
import { Router } from '@angular/router';
import { ComponentRef } from '@angular/core';
import { PageMode } from './report-layout.models';

describe('ReportLayoutComponent', () => {
  let component: ReportLayoutComponent;
  let fixture: ComponentFixture<ReportLayoutComponent>;
  let reference: ComponentRef<ReportLayoutComponent>;

  let navigateMock: jest.Mock;

  beforeEach(async () => {
    navigateMock = jest.fn();

    await TestBed.configureTestingModule({
      declarations: [ReportLayoutComponent],
      providers: [
        MockProvider(Router, {
          navigate: navigateMock,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportLayoutComponent);
    component = fixture.componentInstance;
    reference = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to edit page when view mode', () => {
    reference.setInput('pageMode', 'view' satisfies PageMode);
    reference.setInput('reportId', 1);

    component['onEditViewClick']();

    expect(navigateMock).toHaveBeenCalledWith(['/reports/edit/1']);
  });

  it('should navigate to read page when edit mode', () => {
    reference.setInput('pageMode', 'edit' satisfies PageMode);
    reference.setInput('reportId', 1);

    component['onEditViewClick']();

    expect(navigateMock).toHaveBeenCalledWith(['/reports/read/1']);
  });
});
