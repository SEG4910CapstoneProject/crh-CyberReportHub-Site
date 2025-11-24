import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NewArticleComponent } from './new-article.component';
import { ArticleService } from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ErrorDialogComponent } from '../../shared/dialogs/error-dialog/error-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('NewArticleComponent – extended coverage', () => {
  let component: NewArticleComponent;
  let fixture: ComponentFixture<NewArticleComponent>;
  let articleService: jest.Mocked<ArticleService>;
  let authService: jest.Mocked<AuthService>;
  let dialog: Dialog;
  let dialogOpenSpy: jest.SpyInstance;
  let dialogRef: MatDialogRef<NewArticleComponent>;

  beforeEach(async () => {
    const mockArticleService = {
      ingestArticle: jest.fn(),
      updateArticle: jest.fn(),
    } as unknown as jest.Mocked<ArticleService>;

    const mockAuthService = {
      isLoggedIn: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<AuthService>;

    const mockDialogRef = {
      close: jest.fn(),
    } as unknown as MatDialogRef<NewArticleComponent>;

    await TestBed.configureTestingModule({
      declarations: [NewArticleComponent, ErrorDialogComponent],
      imports: [FormsModule, DialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: ArticleService, useValue: mockArticleService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewArticleComponent);
    component = fixture.componentInstance;

    articleService = TestBed.inject(ArticleService) as jest.Mocked<ArticleService>;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    dialog = TestBed.inject(Dialog);
    dialogRef = TestBed.inject(MatDialogRef);

    dialogOpenSpy = jest.spyOn(dialog, 'open');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefill article when MAT_DIALOG_DATA contains article', () => {
    const data = {
      articleId: '123',
      title: 'test',
      link: 'http://link.com',
      description: 'desc',
    };

    const comp = new NewArticleComponent(articleService, dialog, authService, data, dialogRef);
    expect(comp.article).toEqual(data);
  });

  it('should show error if user is not logged in', () => {
    authService.isLoggedIn.mockReturnValue(false);

    component.article = {
      title: 't',
      link: 'http://a.com',
      description: 'd',
    };

    component.onSubmit();

    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(articleService.ingestArticle).not.toHaveBeenCalled();
  });

  it('should show error if fields are missing', () => {
    component.article = { title: '', link: '', description: '' };

    component.onSubmit();

    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(articleService.ingestArticle).not.toHaveBeenCalled();
  });

  it('should show error for invalid URL', () => {
    component.article = {
      title: 'A',
      link: 'not-a-url',
      description: 'd',
    };

    component.onSubmit();

    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(articleService.ingestArticle).not.toHaveBeenCalled();
  });

  it('should ingest article when form is valid', fakeAsync(() => {
    component.article = {
      title: 'Sample',
      link: 'http://example.com',
      description: 'Test',
    };

    const expectedPayload = { ...component.article };

    articleService.ingestArticle.mockReturnValue(of({ message: 'OK' }));

    component.onSubmit();
    tick();

    expect(articleService.ingestArticle).toHaveBeenCalledWith(expectedPayload);
    expect(dialogOpenSpy).toHaveBeenCalled();
  }));


  it('should handle ingest error gracefully', fakeAsync(() => {
    component.article = {
      title: 'Dup',
      link: 'http://dup.com',
      description: 'd',
    };

    articleService.ingestArticle.mockReturnValue(
      throwError(() => ({ status: 409, error: { message: 'Already exists' } }))
    );

    component.onSubmit();
    tick();

    expect(dialogOpenSpy).toHaveBeenCalled();
  }));

  it('should update article when data contains articleId', fakeAsync(() => {
    const data = {
      articleId: '1',
      title: 'Old',
      link: 'http://old.com',
      description: 'desc',
    };

    const comp = new NewArticleComponent(articleService, dialog, authService, data, dialogRef);
    comp.article.title = 'Updated';

    articleService.updateArticle.mockReturnValue(of({ message: 'Updated' }));

    comp.onSubmit();
    tick();

    expect(articleService.updateArticle).toHaveBeenCalledWith('1', comp.article);
    expect(dialogRef.close).toHaveBeenCalledWith(comp.article);
  }));

  it('should handle update error', fakeAsync(() => {
    const data = {
      articleId: '1',
      title: 'Old',
      link: 'http://old.com',
      description: 'desc',
    };

    const comp = new NewArticleComponent(articleService, dialog, authService, data, dialogRef);

    articleService.updateArticle.mockReturnValue(
      throwError(() => ({ status: 409, error: { message: 'Already exists' } }))
    );

    comp.onSubmit();
    tick();

    expect(dialogOpenSpy).toHaveBeenCalled();
  }));
});
