import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditArticleDialogComponent } from './edit-article-dialog.component';
import { MockProvider } from 'ng-mocks';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DateUtilsService } from '../../services/date-utils.service';
import { EditArticleDialogData } from './edit-article-dialog.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CrhTranslationService } from '../../services/crh-translation.service';

describe('EditArticleDialogComponent', () => {
  let component: EditArticleDialogComponent;
  let fixture: ComponentFixture<EditArticleDialogComponent>;

  let dialogRefCloseMock: jest.Mock;

  const MOCK_INITIAL_DATA: EditArticleDialogData = {
    article: {
      articleId: 'someId',
      title: 'someTitle',
      description: 'someDescription',
      link: 'someLink',
      iocs: [],
      publishDate: '2024-01-01',
      category: 'cat1',
    },
  };

  beforeEach(async () => {
    dialogRefCloseMock = jest.fn();

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EditArticleDialogComponent],
      providers: [
        DateUtilsService,
        TranslateService,
        CrhTranslationService,
        MockProvider(DialogRef, {
          disableClose: false,
          close: dialogRefCloseMock,
        }),
        MockProvider(DIALOG_DATA, MOCK_INITIAL_DATA),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditArticleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const dialogRef = TestBed.inject(DialogRef);

    expect(component).toBeTruthy();
    expect(dialogRef.disableClose).toBe(true);
  });

  it('should set input values when data is provided', () => {
    expect(component['formControl'].controls.link.value).toStrictEqual(
      MOCK_INITIAL_DATA.article.link
    );
    expect(component['formControl'].controls.title.value).toStrictEqual(
      MOCK_INITIAL_DATA.article.title
    );
    expect(component['formControl'].controls.description.value).toStrictEqual(
      MOCK_INITIAL_DATA.article.description
    );
    expect(
      component['formControl'].controls.publishDate.value?.toISODate()
    ).toStrictEqual(MOCK_INITIAL_DATA.article.publishDate);
  });

  it('should disable link field when data is provided', () => {
    expect(component['formControl'].controls.link.disabled).toBe(true);
  });

  it('should close dialog on cancel', () => {
    component['onCancel']();

    expect(dialogRefCloseMock).toHaveBeenCalledWith();
  });

  it('should close dialog on confirm', () => {
    component['onConfirm']();
    const dateUtils = TestBed.inject(DateUtilsService);

    expect(dialogRefCloseMock).toHaveBeenCalledWith({
      articleId: MOCK_INITIAL_DATA.article.articleId,
      title: MOCK_INITIAL_DATA.article.title,
      description: MOCK_INITIAL_DATA.article.description,
      link: MOCK_INITIAL_DATA.article.link,
      publishDate: dateUtils.getDateFromString(
        MOCK_INITIAL_DATA.article.publishDate
      ),
    });
  });

  it('should not close when forms are invalid', () => {
    component['formControl'].controls.description.setValue(null);
    component['onConfirm']();

    expect(dialogRefCloseMock).not.toHaveBeenCalled();
  });
});
