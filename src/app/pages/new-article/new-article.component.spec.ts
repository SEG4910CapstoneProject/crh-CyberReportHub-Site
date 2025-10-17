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
    const mockArticleService = {
      ingestArticle: jest.fn(),
    } as unknown as jest.Mocked<ArticleService>;

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

  it('should not call ingestArticle if fields are missing', () => {
    component.article.title = '';
    component.article.link = '';
    component.article.description = '';
    component.onSubmit();
    expect(articleService.ingestArticle).not.toHaveBeenCalled();
  });

  it('should call ingestArticle when form is valid', fakeAsync(() => {
    component.article.title = 'Sample';
    component.article.link = 'http://example.com';
    component.article.description = 'Test description';

    articleService.ingestArticle.mockReturnValue(of({ message: 'Article successfully ingested' }));

    component.onSubmit();
    tick();

    expect(articleService.ingestArticle).toHaveBeenCalledWith({
      title: 'Sample',
      link: 'http://example.com',
      description: 'Test description',
    });
  }));

  it('should handle backend errors gracefully', fakeAsync(() => {
    component.article.title = 'Duplicate';
    component.article.link = 'http://duplicate.com';
    component.article.description = 'desc';

    articleService.ingestArticle.mockReturnValue(
      throwError(() => ({ error: { message: 'Article already exists' } }))
    );

    expect(() => {
      component.onSubmit();
      tick();
    }).not.toThrow();

    expect(articleService.ingestArticle).toHaveBeenCalled();
  }));
});
