import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialogComponent } from './error-dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;
  let dialogRefMock: DialogRef<ErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ErrorDialogComponent],
      providers: [
        {provide: DIALOG_DATA,useValue:{message:'dialog.error_message_incomplete_fields'}},
        {provide: DialogRef, useValue: { close: jest.fn() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorDialogComponent);
    dialogRefMock = TestBed.inject(DialogRef) as DialogRef<ErrorDialogComponent>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.data.message).toBe('dialog.error_message_incomplete_fields') // I don't think it calls the .json file that has this variable, but it is fine
  });

  it('should call close on onCancel', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
