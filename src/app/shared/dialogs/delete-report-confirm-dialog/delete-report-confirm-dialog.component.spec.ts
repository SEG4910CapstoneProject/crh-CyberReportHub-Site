import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReportConfirmDialogComponent } from './delete-report-confirm-dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('DeleteReportConfirmDialogComponent', () => {
  let component: DeleteReportConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteReportConfirmDialogComponent>;
  let dialogRefMock: DialogRef<DeleteReportConfirmDialogComponent>;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DeleteReportConfirmDialogComponent],
      providers: [
        {provide: DIALOG_DATA,useValue:{message:'dialog.confirm_report_deletion'}},
        {provide: DialogRef, useValue: { close: jest.fn() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteReportConfirmDialogComponent);
    dialogRefMock = TestBed.inject(DialogRef) as DialogRef<DeleteReportConfirmDialogComponent>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
