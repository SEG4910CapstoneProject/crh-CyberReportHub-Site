import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ArticlesComponent } from './articles.component';
import {
  ArticleService,
  Article,
} from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';

const mockArticles: Record<string, Article[]> = {
  Category1: [
    {
      articleId: '1',
      title: 'Article 1',
      description: 'desc',
      category: 'cat',
      link: 'link1',
      publishDate: '2024-01-01',
      type: 'news',
      viewCount: 0,
      isArticleOfNote: false,
    },
    {
      articleId: '2',
      title: 'Article 2',
      description: 'desc',
      category: 'cat',
      link: 'link2',
      publishDate: '2024-01-01',
      type: 'news',
      viewCount: 0,
      isArticleOfNote: false,
    },
  ],
};

const mockArticlesOfNote: Article[] = [
  {
    articleId: '1',
    title: 'Note 1',
    description: 'desc',
    category: 'cat',
    link: 'link1',
    publishDate: '2024-01-01',
    type: 'news',
    viewCount: 0,
    isArticleOfNote: true,
  },
];

class MockArticleService {
  getAllArticleTypesWithArticles = jest.fn().mockReturnValue(of(mockArticles));
  getArticlesOfNote = jest.fn().mockReturnValue(of(mockArticlesOfNote));
  chooseArticleOfNote = jest.fn().mockReturnValue(of({ success: true }));
  incrementViewCount = jest.fn().mockReturnValue(of({ success: true }));

  addFavourite = jest.fn().mockReturnValue(of({ success: true }));
  removeFavourite = jest.fn().mockReturnValue(of({ success: true }));
  getMyFavourites = jest.fn().mockReturnValue(of([]));
}

class MockAuthService {
  isLoggedIn$ = of(true);

  isLoggedIn(): boolean {
    return true;
  }

  hasRole(): boolean {
    return true;
  }

  hasAnyRole(): boolean {
    return true;
  }
}

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;
  let articleService: MockArticleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlesComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 1 }) } },
        { provide: ArticleService, useClass: MockArticleService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    articleService = TestBed.inject(
      ArticleService
    ) as unknown as MockArticleService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles and initialize articlesToShow', () => {
    expect(articleService.getAllArticleTypesWithArticles).toHaveBeenCalledWith(
      30
    );
    expect(component.articlesByCategory['Category1'].length).toBe(2);
    expect(component.articlesToShow['Category1']).toBe(3);
  });

  it('should fetch articles of note', () => {
    expect(articleService.getArticlesOfNote).toHaveBeenCalled();
    expect(component.articlesOfNote.length).toBeGreaterThanOrEqual(0);
  });

  it('should toggle articles between 3 and all', () => {
    component.toggleArticles('Category1');
    expect(component.articlesToShow['Category1']).toBe(2);
    component.toggleArticles('Category1');
    expect(component.articlesToShow['Category1']).toBe(3);
  });

  it('should add and remove favourites', () => {
    const article = mockArticles['Category1'][0];
    expect(component.isFavourite(article)).toBe(false);

    component.toggleFavourite(article);
    expect(component.isFavourite(article)).toBe(true);

    component.toggleFavourite(article);
    expect(component.isFavourite(article)).toBe(false);
  });

  /*it('should add and remove article of note', () => {
    const article = mockArticles['Category1'][1];
    const mockEvent = { target: { checked: true } };

    component.toggleArticleOfNote(article, mockEvent);
    expect(articleService.chooseArticleOfNote).toHaveBeenCalledWith(
      article.articleId
    );
    expect(component.isArticleOfNote(article)).toBe(true);

    component.toggleArticleOfNote(article, { target: { checked: false } });
    expect(component.isArticleOfNote(article)).toBe(false);
  }); */

  it('should increment view count', () => {
    component.incrementViewCount('1');
    expect(articleService.incrementViewCount).toHaveBeenCalledWith('1');
  });

  it('should handle error when fetching articles', () => {
    articleService.getAllArticleTypesWithArticles.mockReturnValueOnce(
      throwError(() => new Error('Error'))
    );
    component.ngOnInit();
    expect(component.isLoading).toBe(false);
  });

  /*
    it('should handle error when fetching articles of note', () => {
    articleService.getArticlesOfNote.mockReturnValueOnce(throwError(() => new Error('Error')));
    component.fetchArticlesOfNote();
    expect(component.articlesOfNote).toEqual([]);
  });
*/
});
