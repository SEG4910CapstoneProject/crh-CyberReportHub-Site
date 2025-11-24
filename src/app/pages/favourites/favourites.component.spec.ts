
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FavouritesComponent } from './favourites.component';
import { ArticleService } from '../../shared/services/article.service';
import { TagService } from '../../shared/services/tag.service';
import { AuthService } from '../../shared/services/auth.service';
import { DarkModeService } from '../../shared/services/dark-mode.service';
import { MatDialog } from '@angular/material/dialog';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: false
})
class FakeTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

const mockArticles = [
  {
    articleId: '1',
    title: 'Mock Article',
    description: 'Desc',
    category: 'Cat',
    link: 'mock-link',
    publishDate: '2024-01-01',
    type: 'news',
    viewCount: 5,
    isArticleOfNote: false,
  },
];

const mockTags = [{ tagId: 1, tagName: 'Tag1', articleIds: ['1'] }];

class MockArticleService {
  getMyFavourites = jest.fn().mockReturnValue(of(mockArticles));
  getMySubmittedArticles = jest.fn().mockReturnValue(of(mockArticles));
  addFavourite = jest.fn().mockReturnValue(of({}));
  removeFavourite = jest.fn().mockReturnValue(of({}));
  incrementViewCount = jest.fn().mockReturnValue(of({}));
  deleteArticle = jest.fn().mockReturnValue(of({}));
}

class MockTagService {
  getUserTags = jest.fn().mockReturnValue(of(mockTags));
  getArticlesByTag = jest.fn().mockReturnValue(of(mockArticles));
  createTag = jest.fn().mockReturnValue(of({ tagId: 2, tagName: 'NewTag' }));
  addArticleToTag = jest.fn().mockReturnValue(of({}));
  removeArticleFromTag = jest.fn().mockReturnValue(of({}));
  renameTag = jest.fn().mockReturnValue(of({}));
  deleteTag = jest.fn().mockReturnValue(of({}));
}

class MockAuthService {
  isLoggedIn$ = of(true);
}

class MockDarkModeService {
  isDarkMode$ = of(false);
}

describe('FavouritesComponent', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;
  let articleService: MockArticleService;
  let tagService: MockTagService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavouritesComponent, FakeTranslatePipe],
      providers: [
        { provide: ArticleService, useClass: MockArticleService },
        { provide: TagService, useClass: MockTagService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: DarkModeService, useClass: MockDarkModeService },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn().mockReturnValue({
              afterClosed: () => of(undefined),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
    articleService = TestBed.inject(ArticleService) as unknown as MockArticleService;
    tagService = TestBed.inject(TagService) as unknown as MockTagService;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load favourites on init', fakeAsync(() => {
    component.fetchFavourites();
    tick();
    expect(component.favouriteArticles.length).toBe(1);
    expect(component.isLoading).toBe(false);
  }));

  it('should fetch submitted articles', fakeAsync(() => {
    component.fetchSubmittedArticles();
    tick();
    expect(component.submittedArticles.length).toBe(1);
  }));

  it('should fetch tags and load articles for each', fakeAsync(() => {
    const spy = jest.spyOn(component, 'loadArticlesByTag');
    component.fetchTags();
    tick();
    expect(spy).toHaveBeenCalledWith(1);
  }));

  it('should handle tag article loading and update untaggedFavourites', fakeAsync(() => {
    component.favouriteArticles = mockArticles;
    component.loadArticlesByTag(1);
    tick();
    expect(component.taggedArticles[1]).toBeDefined();
    expect(component.untaggedFavourites.length).toBe(0);
  }));

  it('should handle error when fetching favourites', fakeAsync(() => {
    jest
      .spyOn(articleService, 'getMyFavourites')
      .mockReturnValueOnce(throwError(() => new Error('Network error')));
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    component.fetchFavourites();
    tick();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  }));

  it('should toggle favourite - remove case', fakeAsync(() => {
    component.favouriteArticles = [...mockArticles];
    (component as any).isLoggedIn.set(true);

    const removeSpy = jest.spyOn(articleService, 'removeFavourite');
    const removeTagSpy = jest.spyOn(tagService, 'removeArticleFromTag');

    component.taggedArticles = { 1: [...mockArticles] };
    component.toggleFavourite(mockArticles[0]);
    tick();

    expect(removeSpy).toHaveBeenCalled();
    expect(removeTagSpy).toHaveBeenCalled();
  }));

  it('should toggle favourite - add case', fakeAsync(() => {
    component.favouriteArticles = [];
    (component as any).isLoggedIn.set(true);

    const addSpy = jest.spyOn(articleService, 'addFavourite');
    component.toggleFavourite(mockArticles[0]);
    tick();
    expect(addSpy).toHaveBeenCalled();
  }));

  it('should not toggle favourite if not logged in', () => {
    (component as any).isLoggedIn.set(false);
    const addSpy = jest.spyOn(articleService, 'addFavourite');
    component.toggleFavourite(mockArticles[0]);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('should increment view count', () => {
    component.incrementViewCount('1');
    expect(articleService.incrementViewCount).toHaveBeenCalledWith('1');
  });

  it('should delete an article after confirm', fakeAsync(() => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.submittedArticles = [...mockArticles];
    component.deleteArticle('1');
    tick();
    expect(component.submittedArticles.length).toBe(0);
  }));

  it('should cancel article delete if not confirmed', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const spy = jest.spyOn(articleService, 'deleteArticle');
    component.deleteArticle('1');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should open create tag dialog and handle successful tag creation', fakeAsync(() => {
    const mockDialogRef = {
      afterClosed: () => of({ tagName: 'NewTag', selectedArticleIds: ['1'] }),
    };
    jest.spyOn(dialog, 'open').mockReturnValue(mockDialogRef as any);
    const createSpy = jest.spyOn(tagService, 'createTag');

    component.openCreateTagDialog();
    tick();
    expect(createSpy).toHaveBeenCalledWith('NewTag');
  }));

  it('should handle tag creation error gracefully', fakeAsync(() => {
    const mockDialogRef = {
      afterClosed: () => of({ tagName: 'BadTag', selectedArticleIds: [] }),
    };
    jest.spyOn(dialog, 'open').mockReturnValue(mockDialogRef as any);
    jest
      .spyOn(tagService, 'createTag')
      .mockReturnValueOnce(throwError(() => ({ error: { message: 'Tag failed' } })));
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(jest.fn());
    component.openCreateTagDialog();
    tick();
    expect(alertSpy).toHaveBeenCalledWith('Tag failed');
  }));

  it('should open edit tag dialog and rename tag', fakeAsync(() => {
    const mockDialogRef = {
      afterClosed: () => of({ tagName: 'Renamed', selectedArticleIds: ['1'] }),
    };
    jest.spyOn(dialog, 'open').mockReturnValue(mockDialogRef as any);
    const renameSpy = jest.spyOn(tagService, 'renameTag');
    component.favouriteArticles = [...mockArticles];
    component.openEditTagDialog(mockTags[0]);
    tick();
    expect(renameSpy).toHaveBeenCalledWith(1, 'Renamed');
  }));

  it('should delete a tag after confirmation', fakeAsync(() => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.userTags = [...mockTags];
    component.taggedArticles = { 1: mockArticles };
    const delSpy = jest.spyOn(tagService, 'deleteTag');
    component.deleteTag(mockTags[0]);
    tick();
    expect(delSpy).toHaveBeenCalled();
    expect(component.userTags.length).toBe(0);
  }));

  it('should skip tag deletion if not confirmed', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const delSpy = jest.spyOn(tagService, 'deleteTag');
    component.deleteTag(mockTags[0]);
    expect(delSpy).not.toHaveBeenCalled();
  });

  it('should toggle section state', () => {
    component.collapsedSections = {};
    component.toggleSection('favs');
    expect(component.collapsedSections['favs']).toBe(true);
    component.toggleSection('favs');
    expect(component.collapsedSections['favs']).toBe(false);
  });
});
