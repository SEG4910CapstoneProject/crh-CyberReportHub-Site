import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelButtonsComponent } from './confirm-cancel-buttons.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ConfirmCancelButtonsComponent', () => {
  let component: ConfirmCancelButtonsComponent;
  let fixture: ComponentFixture<ConfirmCancelButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ConfirmCancelButtonsComponent],
      providers: [TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmCancelButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
