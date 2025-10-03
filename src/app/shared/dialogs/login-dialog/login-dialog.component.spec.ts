import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginDialogComponent } from './login-dialog.component';
import { MockProvider } from 'ng-mocks';
import { DialogRef } from '@angular/cdk/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let dialogRefCloseMock: jest.Mock;
  let loginMock: jest.Mock;

  beforeEach(async () => {
    dialogRefCloseMock = jest.fn();
    loginMock = jest.fn().mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LoginDialogComponent],
      providers: [
        TranslateService,
        MockProvider(DialogRef, { close: dialogRefCloseMock }),
        MockProvider(AuthService, { login: loginMock }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRefCloseMock).toHaveBeenCalledWith(false);
  });

  it('should close dialog on successful login', async () => {
    component['email'] = 'admin@example.com'; // use bracket access
    component['password'] = 'password';
    await component.onLogin();
    expect(loginMock).toHaveBeenCalledWith('admin@example.com', 'password'); // fix expectation
    expect(dialogRefCloseMock).toHaveBeenCalledWith(true);
  });
});
