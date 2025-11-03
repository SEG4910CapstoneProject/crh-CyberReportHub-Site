import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FavouritesComponent } from './favourites.component';
import { of } from 'rxjs';
import { ArticleService } from '../../shared/services/article.service';
import { AuthService } from '../../shared/services/auth.service';
import { TagService } from '../../shared/services/tag.service';
import { MatDialog } from '@angular/material/dialog';

class MockArticleService {
  getMyFavourites = jest.fn().mockReturnValue(of([
    { articleId: '1', title: 'Mock Article', description: 'Desc', category: 'Cat', link: 'mock-link', publishDate: '2024-01-01', type: 'news', viewCount: 5, isArticleOfNote: false }
  ]));
  getMySubmittedArticles = jest.fn().mockReturnValue(of([]));
  addFavourite = jest.fn();
  removeFavourite = jest.fn();
  incrementViewCount = jest.fn();
}

class MockTagService {
  getUserTags = jest.fn().mockReturnValue(of([]));
  getArticlesByTag = jest.fn().mockReturnValue(of([]));
  createTag = jest.fn().mockReturnValue(of({ tagId: 1, tagName: 'Tag1' }));
  addArticleToTag = jest.fn().mockReturnValue(of({}));
  deleteTag = jest.fn().mockReturnValue(of({}));
}

class MockAuthService {
  isLoggedIn$ = of(true);
}

describe('FavouritesComponent', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [FavouritesComponent],
      providers: [
        { provide: ArticleService, useClass: MockArticleService },
        { provide: TagService, useClass: MockTagService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useValue: { open: jest.fn((): any => ({ afterClosed: () => of(undefined) })) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favourites on init', fakeAsync((): void => {
    component.fetchFavourites();
    tick();
    expect(component.favouriteArticles.length).toBe(1);
  }));

  it('should open create tag dialog', (): void => {
    const dialogSpy = jest.spyOn((component as any).dialog, 'open');
    component.openCreateTagDialog();
    expect(dialogSpy).toHaveBeenCalled();
  });
});
