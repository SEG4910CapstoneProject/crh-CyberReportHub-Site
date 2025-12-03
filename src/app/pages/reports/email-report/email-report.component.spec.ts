import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailReportComponent } from './email-report.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

describe('EmailReportComponent', () => {
  let component: EmailReportComponent;
  let fixture: ComponentFixture<EmailReportComponent>;
  let mockHttpClient: { post: jest.Mock };

  beforeEach(async () => {
    mockHttpClient = { post: jest.fn() };
    history.pushState({ role: "admin" , reportId: 1 }, "");
    await TestBed.configureTestingModule({
      declarations: [EmailReportComponent],
      imports:[
        TranslateModule.forRoot()
      ],
      providers:[{provide: HttpClient, useValue: mockHttpClient}]
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
