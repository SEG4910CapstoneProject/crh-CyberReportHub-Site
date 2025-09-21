import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../shared/services/auth.service';
import { ReportsService } from '../../shared/services/reports.service';
import { ArticleService, MostViewedArticle, ArticleOfNote, Article } from '../../shared/services/article.service';
import { JsonReportResponse } from '../../shared/sdk/rest-api/model/jsonReportResponse';
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
      getArticleByLink: jest.fn(),
      incrementViewCount: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: ArticleService, useValue: mockArticleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// To be implemented when login functionality bug is fixed
/*
  it('should update login status on init', () => {
    fixture.detectChanges();
    expect(component['isLoggedIn']()).toBe(true);
   });
*/

// To be implemented when latest published report bug is fixed
/*  it('should fetch latest published report', () => {
    const mockReport: JsonReportResponse = { reportId: 1 } as any;
    mockReportsService.getLatestReport.mockReturnValue(of(mockReport));

    fixture.detectChanges();

    expect(mockReportsService.getLatestReport).toHaveBeenCalled();
    expect(component.latestPublishedReport?.reportId).toBe(1);
  });
*/

  it('should fetch most viewed articles', () => {
    const mockArticles: MostViewedArticle[] = [
      { url: 'url1', title: 'Article 1', viewCount: 5 },
      { url: 'url2', title: 'Article 2', viewCount: 10 }
    ];
    mockArticleService.getTopMostViewedArticles.mockReturnValue(of(mockArticles));

    component.fetchMostViewedArticles();

    expect(mockArticleService.getTopMostViewedArticles).toHaveBeenCalled();
    expect(component.mostViewedArticles.length).toBe(2);
    expect(component.mostViewedArticles.every(a => a.viewCount > 0)).toBe(true);
  });

  it('should fetch articles of note', () => {
    const mockNotes: ArticleOfNote[] = [
      { url: 'note1', title: 'Note 1' },
      { url: 'note2', title: 'Note 2' }
    ];
    mockArticleService.getArticlesOfNote.mockReturnValue(of(mockNotes));

    component.fetchArticlesOfNote();

    expect(mockArticleService.getArticlesOfNote).toHaveBeenCalled();
    expect(component.articlesOfNote.length).toBe(2);
  });

  it('should increment view count by url', () => {
    const mockArticle: Article = {
      articleId: '123',
      title: 'Test Article',
      description: 'desc',
      category: 'cat',
      link: 'test-url',
      publishDate: '2024-01-01',
      type: 'news',
      viewCount: 0,
      isArticleOfNote: false,
      url: 'test-url'
    };

    mockArticleService.getArticleByLink.mockReturnValue(of(mockArticle));
    mockArticleService.incrementViewCount.mockReturnValue(of({}));

    component.incrementViewCountByUrl('test-url');

    expect(mockArticleService.getArticleByLink).toHaveBeenCalledWith('test-url');
    expect(mockArticleService.incrementViewCount).toHaveBeenCalledWith('123');
  });

  it('should handle error when article not found for URL', () => {
    mockArticleService.getArticleByLink.mockReturnValue(throwError(() => new Error('Not found')));

    component.incrementViewCountByUrl('bad-url');

    expect(mockArticleService.getArticleByLink).toHaveBeenCalledWith('bad-url');
  });
});
