import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrhEmailTemplateCardComponent } from './crh-email-template-card.component';

describe('CrhEmailTemplateCardComponent', () => {
  let component: CrhEmailTemplateCardComponent;
  let fixture: ComponentFixture<CrhEmailTemplateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrhEmailTemplateCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrhEmailTemplateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
