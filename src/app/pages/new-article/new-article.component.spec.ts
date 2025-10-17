import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NewArticleComponent } from './new-article.component';
import { ArticleService } from '../../shared/services/article.service';

describe('NewArticleComponent', () => {
  let component: NewArticleComponent;
  let fixture: ComponentFixture<NewArticleComponent>;
  let articleService: jest.Mocked<ArticleService>;

  beforeEach(async () => {
    const mockArticleService: jest.Mocked<ArticleService> = {
      ingestArticle: jest.fn(),
      checkIfArticleExists: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [NewArticleComponent],
      imports: [FormsModule],
      providers: [{ provide: ArticleService, useValue: mockArticleService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NewArticleComponent);
    component = fixture.componentInstance;
    articleService = TestBed.inject(ArticleService) as jest.Mocked<ArticleService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call service if link is missing', () => {
    component.article.link = '';
    component.onSubmit();
    expect(articleService.ingestArticle).not.toHaveBeenCalled();
  });

  it('should call ingestArticle when form is valid', fakeAsync(() => {
    component.article.title = 'Sample';
    component.article.link = 'http://example.com';
    component.article.description = 'A test description';

    // Simulate no existing article found
    articleService.checkIfArticleExists.mockReturnValue(of(null));
    articleService.ingestArticle.mockReturnValue(of({ success: true }));

    component.onSubmit();
    tick();

    expect(articleService.ingestArticle).toHaveBeenCalledWith({
      title: 'Sample',
      link: 'http://example.com',
      description: 'A test description',
    });
  }));

  it('should handle service errors gracefully', fakeAsync(() => {
    component.article.title = 'Bad article';
    component.article.link = 'http://bad.com';
    component.article.description = 'desc';

    articleService.checkIfArticleExists.mockReturnValue(of(null));
    articleService.ingestArticle.mockReturnValue(
      throwError(() => new Error('Service error'))
    );

    expect(() => {
      component.onSubmit();
      tick();
    }).not.toThrow();
    expect(articleService.ingestArticle).toHaveBeenCalled();
  }));
});
