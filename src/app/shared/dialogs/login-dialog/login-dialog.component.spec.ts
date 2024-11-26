import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { MockProvider } from 'ng-mocks';
import { DialogRef } from '@angular/cdk/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let dialogRefCloseMock: jest.Mock;

  beforeEach(async () => {
    dialogRefCloseMock = jest.fn();

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LoginDialogComponent],
      providers: [
        TranslateService,
        MockProvider(DialogRef, {
          close: dialogRefCloseMock,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on close', () => {
    component['onCancel']();
    expect(dialogRefCloseMock).toHaveBeenCalled();
  });
});
