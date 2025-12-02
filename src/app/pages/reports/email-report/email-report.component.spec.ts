import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailReportComponent } from './email-report.component';
import { TranslateModule } from '@ngx-translate/core';

describe('EmailReportComponent', () => {
  let component: EmailReportComponent;
  let fixture: ComponentFixture<EmailReportComponent>;

  beforeEach(async () => {
    history.pushState({ role: "admin" , reportId: 1 }, "");
    await TestBed.configureTestingModule({
      declarations: [EmailReportComponent],
      imports:[
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
