import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../shared/services/auth.service';
import { ReportsService } from '../../shared/services/reports.service';
import {
  ArticleService,
  MostViewedArticle,
  Article,
} from '../../shared/services/article.service';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let mockAuthService: any;
  let mockReportsService: any;
  let mockArticleService: any;

  beforeEach(async () => {
    mockAuthService = { isLoggedIn$: of(true) };
    mockReportsService = { getLatestReport: jest.fn() };
    mockArticleService = {
      getTopMostViewedArticles: jest.fn(),
      getArticlesOfNote: jest.fn(),
      incrementViewCount: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: ArticleService, useValue: mockArticleService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should update login status when authService emits false', () => {
    mockAuthService.isLoggedIn$ = of(false);


    mockReportsService.getLatestReport.mockReturnValue(of(null));
    mockArticleService.getTopMostViewedArticles.mockReturnValue(of([]));
    mockArticleService.getArticlesOfNote.mockReturnValue(of([]));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component['isLoggedIn']()).toBe(false);
  });



  it('should set latestPublishedReport to null when no report is returned', () => {
    mockReportsService.getLatestReport = jest.fn().mockReturnValue(of(null));
    mockArticleService.getTopMostViewedArticles = jest.fn().mockReturnValue(of([]));
    mockArticleService.getArticlesOfNote = jest.fn().mockReturnValue(of([]));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.latestPublishedReport).toBeNull();
  });


  it('should format dates when latest report contains valid ISO dates', () => {
    const mockReport = {
      reportId: 1,
      generatedDate: '2024-01-01T10:00:00Z',
      lastModified: '2024-01-02T12:00:00Z'
    };

    mockReportsService.getLatestReport = jest.fn().mockReturnValue(of(mockReport));
    mockArticleService.getTopMostViewedArticles = jest.fn().mockReturnValue(of([]));
    mockArticleService.getArticlesOfNote = jest.fn().mockReturnValue(of([]));


    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.latestPublishedReport?.generatedDate).toContain('2024');
    expect(component.latestPublishedReport?.lastModified).toContain('2024');
  });



  it('should return original string for invalid date', () => {
    const result = component.formatDate('not-a-date');
    expect(result).toBe('not-a-date');
  });

  it('should fetch most viewed articles', () => {
    const mockArticles: MostViewedArticle[] = [
      { url: 'url1', title: 'Article 1', viewCount: 5, articleId: 'a1' },
      { url: 'url2', title: 'Article 2', viewCount: 10, articleId: 'a2' },
    ];
    mockArticleService.getTopMostViewedArticles.mockReturnValue(of(mockArticles));

    component.fetchMostViewedArticles();

    expect(mockArticleService.getTopMostViewedArticles).toHaveBeenCalled();
    expect(component.mostViewedArticles.length).toBe(2);
    expect(component.mostViewedArticles.every(a => a.viewCount > 0)).toBe(true);
  });


  it('should filter out articles with zero viewCount', () => {
    const mockArticles: MostViewedArticle[] = [
      { url: 'a', title: 'A', viewCount: 0, articleId: '1' },
      { url: 'b', title: 'B', viewCount: 5, articleId: '2' },
    ];

    mockArticleService.getTopMostViewedArticles.mockReturnValue(of(mockArticles));

    component.fetchMostViewedArticles();

    expect(component.mostViewedArticles.length).toBe(1);
    expect(component.mostViewedArticles[0].title).toBe('B');
  });

  it('should log error when fetching most viewed articles fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    mockArticleService.getTopMostViewedArticles.mockReturnValue(
      throwError(() => new Error('fail'))
    );

    component.fetchMostViewedArticles();

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });


  it('should fetch articles of note', () => {
    const mockNotes: Article[] = [
      {
        articleId: 'n1',
        title: 'Note 1',
        description: 'desc1',
        category: 'cat1',
        link: 'note1',
        publishDate: '2024-01-01',
        type: 'news',
        viewCount: 0,
        isArticleOfNote: true,
      },
      {
        articleId: 'n2',
        title: 'Note 2',
        description: 'desc2',
        category: 'cat2',
        link: 'note2',
        publishDate: '2024-02-01',
        type: 'news',
        viewCount: 0,
        isArticleOfNote: true,
      },
    ];
    mockArticleService.getArticlesOfNote.mockReturnValue(of(mockNotes));

    component.fetchArticlesOfNote();

    expect(mockArticleService.getArticlesOfNote).toHaveBeenCalled();
    expect(component.articlesOfNote.length).toBe(2);
    expect(component.articlesOfNote[0].title).toBe('Note 1');
  });


  it('should log error when fetching Articles of Note fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    mockArticleService.getArticlesOfNote.mockReturnValue(
      throwError(() => new Error('test'))
    );

    component.fetchArticlesOfNote();

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });


  it('should increment view count by articleId', () => {
    mockArticleService.incrementViewCount.mockReturnValue(of({}));

    component.incrementViewCount('123');

    expect(mockArticleService.incrementViewCount).toHaveBeenCalledWith('123');
  });


  it('should log error when incrementing view count fails', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    mockArticleService.incrementViewCount.mockReturnValue(
      throwError(() => new Error('inc error'))
    );

    component.incrementViewCount('xyz');

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
