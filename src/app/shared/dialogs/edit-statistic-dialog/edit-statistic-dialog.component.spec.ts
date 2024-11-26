import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStatisticDialogComponent } from './edit-statistic-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CrhTranslationService } from '../../services/crh-translation.service';
import { MockProvider } from 'ng-mocks';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { EditStatDialogData } from './edit-statistic-dialog.model';

describe('EditStatisticDialogComponent', () => {
  let component: EditStatisticDialogComponent;
  let fixture: ComponentFixture<EditStatisticDialogComponent>;

  let dialogRefCloseMock: jest.Mock;

  const MOCK_INITIAL_DATA: EditStatDialogData = {
    stat: {
      statisticId: 'someId',
      statisticNumber: 100,
      title: 'someTitle',
      subtitle: 'someSubtitle',
    },
  };

  beforeEach(async () => {
    dialogRefCloseMock = jest.fn();

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EditStatisticDialogComponent],
      providers: [
        TranslateService,
        CrhTranslationService,
        MockProvider(DialogRef, {
          disableClose: false,
          close: dialogRefCloseMock,
        }),
        MockProvider(DIALOG_DATA, MOCK_INITIAL_DATA),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditStatisticDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const dialogRef = TestBed.inject(DialogRef);

    expect(component).toBeTruthy();
    expect(dialogRef.disableClose).toBe(true);
  });

  it('should set input values when data is provided', () => {
    expect(component['formControl'].controls.statistic.value).toStrictEqual(
      MOCK_INITIAL_DATA.stat.statisticNumber.toString()
    );
    expect(component['formControl'].controls.title.value).toStrictEqual(
      MOCK_INITIAL_DATA.stat.title
    );
    expect(component['formControl'].controls.subtitle.value).toStrictEqual(
      MOCK_INITIAL_DATA.stat.subtitle
    );
  });

  it('should close dialog on cancel', () => {
    component['onCancel']();

    expect(dialogRefCloseMock).toHaveBeenCalledWith();
  });

  it('should close dialog on confirm', () => {
    component['onConfirm']();

    expect(dialogRefCloseMock).toHaveBeenCalledWith({
      title: MOCK_INITIAL_DATA.stat.title,
      subtitle: MOCK_INITIAL_DATA.stat.subtitle,
      value: MOCK_INITIAL_DATA.stat.statisticNumber,
    });
  });

  it('should not close when forms are invalid', () => {
    component['formControl'].controls.title.setValue(null);
    component['onConfirm']();

    expect(dialogRefCloseMock).not.toHaveBeenCalled();
  });
});
