import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      addArticle: jest.fn(),
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

  it('should not call service if required fields are missing', () => {
    component.article = { title: '', link: '', type: '' };

    component.onSubmit();

    expect(articleService.addArticle).not.toHaveBeenCalled();
  });

  it('should call service when form is valid', () => {
    const testArticle = {
      title: 'Test Title',
      link: 'http://example.com',
      type: 'News',
    };
    component.article = testArticle;

    articleService.addArticle.mockReturnValue(of({ success: true }));

    component.onSubmit();

    expect(articleService.addArticle).toHaveBeenCalled();
    const calledArg = (articleService.addArticle as jest.Mock).mock.calls[0][0];
    expect(calledArg.title).toBe('Test Title');
    expect(calledArg.link).toBe('http://example.com');
    expect(calledArg.type).toBe('News');
  });

  it('should handle error from service gracefully', () => {
    component.article = {
      title: 'Bad Article',
      link: 'http://bad.com',
      type: 'News',
    };

    articleService.addArticle.mockReturnValue(
      throwError(() => new Error('Service error'))
    );

    expect(() => component.onSubmit()).not.toThrow();
    expect(articleService.addArticle).toHaveBeenCalled();
  });

  it('should generate an articleId if missing before submitting', () => {
    component.article = {
      title: 'UUID Article',
      link: 'http://uuid.com',
      type: 'Blog',
    };

    articleService.addArticle.mockReturnValue(of({ success: true }));

    component.onSubmit();

    expect(articleService.addArticle).toHaveBeenCalled();
    const calledArg = (articleService.addArticle as jest.Mock).mock.calls[0][0];
    expect(calledArg.articleId).toBeDefined();
    expect(typeof calledArg.articleId).toBe('string');
  });
});
