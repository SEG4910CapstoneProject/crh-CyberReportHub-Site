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
import { of } from 'rxjs';

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
      { url: 'url1', title: 'Article 1', viewCount: 5, articleId: 'a1' },
      { url: 'url2', title: 'Article 2', viewCount: 10, articleId: 'a2' },
    ];
    mockArticleService.getTopMostViewedArticles.mockReturnValue(of(mockArticles));

    component.fetchMostViewedArticles();

    expect(mockArticleService.getTopMostViewedArticles).toHaveBeenCalled();
    expect(component.mostViewedArticles.length).toBe(2);
    expect(component.mostViewedArticles.every(a => a.viewCount > 0)).toBe(true);
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

  // Tests incrementing view count
  it('should increment view count by articleId', () => {
    mockArticleService.incrementViewCount.mockReturnValue(of({}));

    component.incrementViewCount('123');

    expect(mockArticleService.incrementViewCount).toHaveBeenCalledWith('123');
  });
});
