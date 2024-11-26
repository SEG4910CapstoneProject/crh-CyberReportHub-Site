import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSidebarAreaComponent } from './report-sidebar-area.component';

describe('ReportSidebarAreaComponent', () => {
  let component: ReportSidebarAreaComponent;
  let fixture: ComponentFixture<ReportSidebarAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportSidebarAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportSidebarAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
