import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ArticlesComponent } from './articles.component';
import { ArticleService } from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

// Mock ArticleService
const mockArticleService = {
  getAllArticleTypesWithArticles: jest.fn().mockReturnValue(of({})),
  getArticlesOfNote: jest.fn().mockReturnValue(of([])),
  incrementViewCount: jest.fn().mockReturnValue(of({})),
  chooseArticleOfNote: jest.fn().mockReturnValue(of({}))
};

// Mock AuthService
const mockAuthService = {
  isLoggedIn$: of(false)
};

// Mock ActivatedRoute
const mockActivatedRoute = {
  snapshot: { params: {} },
  queryParams: of({})
};

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlesComponent],
      providers: [
        { provide: ArticleService, useValue: mockArticleService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch articles of note on init', () => {
    expect(mockArticleService.getArticlesOfNote).toHaveBeenCalled();
  });

  it('should increment view count', () => {
    component.incrementViewCount('123');
    expect(mockArticleService.incrementViewCount).toHaveBeenCalledWith('123');
  });
});
