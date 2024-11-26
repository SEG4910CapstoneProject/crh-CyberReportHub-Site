import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCardDiagramComponent } from './stats-card-diagram.component';

describe('StatsCardDiagramComponent', () => {
  let component: StatsCardDiagramComponent;
  let fixture: ComponentFixture<StatsCardDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsCardDiagramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCardDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
