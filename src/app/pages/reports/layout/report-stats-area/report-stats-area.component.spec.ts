import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStatsAreaComponent } from './report-stats-area.component';
import { ComponentRef } from '@angular/core';

describe('ReportStatsAreaComponent', () => {
  let component: ReportStatsAreaComponent;
  let fixture: ComponentFixture<ReportStatsAreaComponent>;
  let componentRef: ComponentRef<ReportStatsAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportStatsAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportStatsAreaComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    {
      editMode: true,
      statMode: 'removeMode',
    },
    {
      editMode: false,
      statMode: 'none',
    },
  ])(
    'should set correct stat card states with editmode %editMode',
    ({ editMode, statMode }) => {
      componentRef.setInput('editable', editMode);
      expect(component['statCardEditMode']()).toStrictEqual(statMode);
    }
  );
});
