import { fakeAsync, tick } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouritesComponent } from './favourites.component';
import { of } from 'rxjs';
import { ArticleService } from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';

class MockArticleService {
  getMyFavourites = jest.fn().mockReturnValue(
    of([
      {
        articleId: '1',
        title: 'Mock Article',
        description: 'Mock description',
        category: 'Mock Category',
        link: 'mock-link',
        publishDate: '2024-01-01',
        type: 'news',
        viewCount: 5,
        isArticleOfNote: false,
      },
    ])
  );
  addFavourite = jest.fn();
  removeFavourite = jest.fn();
  incrementViewCount = jest.fn();
}

class MockAuthService {
  isLoggedIn$ = of(true);
}

describe('FavouritesComponent', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;
  let articleService: MockArticleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavouritesComponent],
      providers: [
        { provide: ArticleService, useClass: MockArticleService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
    articleService = TestBed.inject(ArticleService) as unknown as MockArticleService;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load favourites when fetchFavourites is called', fakeAsync(() => {
    component.fetchFavourites();
    tick();

    expect(articleService.getMyFavourites).toHaveBeenCalled();
    expect(component.favouriteArticles.length).toBe(1);
    expect(component.favouriteArticles[0].title).toBe('Mock Article');
  }));
});
