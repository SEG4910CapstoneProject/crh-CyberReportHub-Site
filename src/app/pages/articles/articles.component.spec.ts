import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ArticlesComponent } from './articles.component';
import { ArticleService, Article } from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate', standalone: true })
class FakeTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

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
      isArticleOfNote: false
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
      isArticleOfNote: false
    }
  ]
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
    isArticleOfNote: true
  }
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
  isLoggedIn(): boolean { return true; }
  hasRole(): boolean { return true; }
  hasAnyRole(): boolean { return true; }
  hasPermission(): boolean { return true; }
}

class MockDarkModeService {
  isDarkMode$ = of(false);
}

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;
  let articleService: MockArticleService;
  let dialogSpy: any;

  beforeEach(async () => {
    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: (): any => of(true)
      })
    };

    await TestBed.configureTestingModule({
      declarations: [ArticlesComponent],
      imports: [FakeTranslatePipe],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 1 }) } },
        { provide: ArticleService, useClass: MockArticleService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: DarkModeService, useClass: MockDarkModeService },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    articleService = TestBed.inject(ArticleService) as any;

    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should load collapsedSections from localStorage', (): void => {
    localStorage.setItem('collapsedSections_articles', JSON.stringify({ Category1: true }));
    component.ngOnInit();
    expect(component.collapsedSections['Category1']).toBe(true);
  });

  it('should load articles and initialize articlesToShow', (): void => {
    expect(articleService.getAllArticleTypesWithArticles).toHaveBeenCalledWith(60);
    expect(component.articlesToShow['Category1']).toBe(3);
  });

  it('should fetch Articles of Note', (): void => {
    expect(articleService.getArticlesOfNote).toHaveBeenCalled();
    expect(component.articlesOfNote.length).toBe(1);
  });

  it('should toggle articles between 3 and all', (): void => {
    component.toggleArticles('Category1');
    expect(component.articlesToShow['Category1']).toBe(2);
    component.toggleArticles('Category1');
    expect(component.articlesToShow['Category1']).toBe(3);
  });

  it('should add and remove favourites', (): void => {
    const article = mockArticles['Category1'][0];
    expect(component.isFavourite(article)).toBe(false);
    component.toggleFavourite(article);
    expect(component.isFavourite(article)).toBe(true);
    component.toggleFavourite(article);
    expect(component.isFavourite(article)).toBe(false);
  });

  it('should not toggle favourites if not logged in', (): void => {
    component['isLoggedIn'].set(false);
    const article = mockArticles['Category1'][0];
    component.toggleFavourite(article);
    expect(articleService.addFavourite).not.toHaveBeenCalled();
  });

  it('should handle toggleArticleOfNote (checked)', (): void => {
    const article = mockArticles['Category1'][0];
    const event = { target: { checked: true } };
    component.toggleArticleOfNote(article, event);
    expect(article.isArticleOfNote).toBe(true);
  });

  it('should handle toggleArticleOfNote (unchecked)', (): void => {
    component.articlesOfNote = [
      { ...mockArticlesOfNote[0], url: 'link1' }
    ];

    const article = mockArticles['Category1'][0];
    const event = { target: { checked: false } };

    component.toggleArticleOfNote(article, event);

    expect(component.articlesOfNote.length).toBe(0);
  });

  it('should handle toggleArticleOfNote error branch', (): void => {
    articleService.chooseArticleOfNote.mockReturnValueOnce(
      throwError(() => new Error('fail'))
    );
    const article = mockArticles['Category1'][0];
    const event = { target: { checked: true } };
    expect(() => component.toggleArticleOfNote(article, event)).not.toThrow();
  });

  it('should increment view count', (): void => {
    component.incrementViewCount('1');
    expect(articleService.incrementViewCount).toHaveBeenCalledWith('1');
  });

  it('should handle error when fetching articles', (): void => {
    articleService.getAllArticleTypesWithArticles.mockReturnValueOnce(
      throwError(() => new Error('Error'))
    );
    component.ngOnInit();
    expect(component.isLoading).toBe(false);
  });

  it('should handle error in fetchFavourites', (): void => {
    articleService.getMyFavourites.mockReturnValueOnce(
      throwError(() => new Error('Error'))
    );
    expect(() => component.fetchFavourites()).not.toThrow();
  });

  it('should handle error in fetchArticlesOfNote', (): void => {
    articleService.getArticlesOfNote.mockReturnValueOnce(
      throwError(() => new Error('Error'))
    );
    expect(() => component.fetchArticlesOfNote()).not.toThrow();
  });

  it('should close dialog on addArticleDialog (afterClosed false branch)', (): void => {
    dialogSpy.open.mockReturnValueOnce({
      afterClosed: (): any => of(false)
    });
    component.openAddArticleDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should toggle category and save localStorage', (): void => {
    component.toggleCategory('Category1');
    expect(component.collapsedSections['Category1']).toBe(true);
    const stored = JSON.parse(localStorage.getItem('collapsedSections_articles')!);
    expect(stored['Category1']).toBe(true);
  });
});
