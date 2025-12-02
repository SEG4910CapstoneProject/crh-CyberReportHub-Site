import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateTagDialogComponent } from './create-tag-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateTagDialogComponent (Jest)', () => {
  let component: CreateTagDialogComponent;
  let fixture: ComponentFixture<CreateTagDialogComponent>;
  let mockDialogRef: { close: jest.Mock };

  const mockData = {
    favouriteArticles: [
      { articleId: '1', title: 'Article One', publishDate: '2024-01-01' },
      { articleId: '2', title: 'Article Two', publishDate: '2024-01-02' },
    ],
  };

  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CreateTagDialogComponent, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty tag data for new tag', () => {
    expect(component.tagName).toBe('');
    expect(component.selectedArticleIds.length).toBe(0);
  });

  it('should initialize with tag data when editing', () => {
    const editData = {
      ...mockData,
      tag: { tagName: 'ExistingTag', articleIds: ['1'] },
    };

    const comp = new CreateTagDialogComponent(mockDialogRef as any, editData as any);
    expect(comp.tagName).toBe('ExistingTag');
    expect(comp.selectedArticleIds).toEqual(['1']);
  });

  it('should filter articles when search term matches', () => {
    component.articleSearchTerm = 'one';
    component.filterArticles();
    expect(component.filteredArticles.length).toBe(1);
    expect(component.filteredArticles[0].title).toBe('Article One');
  });

  it('should return all articles when search term is empty', () => {
    component.articleSearchTerm = '';
    component.filterArticles();
    expect(component.filteredArticles.length).toBe(2);
  });

  it('should reset current page when filtering', () => {
    component.currentPage = 3;
    component.articleSearchTerm = 'Two';
    component.filterArticles();
    expect(component.currentPage).toBe(1);
  });

  it('should compute correct totalPages', () => {
    component.filteredArticles = new Array(23).fill({}); // 23 items
    component.updateTotalPages();
    expect(component.totalPages).toBe(3);
  });

  it('should not exceed totalPages when nextPage is called at end', () => {
    component.totalPages = 2;
    component.currentPage = 2;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should go to next page when possible', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should not go below page 1 when prevPage is called at start', () => {
    component.currentPage = 1;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should go to previous page when possible', () => {
    component.currentPage = 3;
    component.prevPage();
    expect(component.currentPage).toBe(2);
  });

  it('should paginate articles correctly', () => {
    component.filteredArticles = [
      ...mockData.favouriteArticles,
      ...mockData.favouriteArticles,
      ...mockData.favouriteArticles,
    ]; // 6 items

    component.pageSize = 2;
    component.currentPage = 2;

    const page = component.paginatedArticles;
    expect(page.length).toBe(2);
  });

  it('should toggle article selection', () => {
    component.toggleArticleSelection('1');
    expect(component.selectedArticleIds).toContain('1');

    component.toggleArticleSelection('1');
    expect(component.selectedArticleIds).not.toContain('1');
  });

  it('should return true when article is selected', () => {
    component.selectedArticleIds = ['1'];
    expect(component.isSelected('1')).toBe(true);
  });

  it('should return false when article is not selected', () => {
    component.selectedArticleIds = ['2'];
    expect(component.isSelected('1')).toBe(false);
  });

  it('should save and close dialog with tag data', () => {
    component.tagName = 'NewTag';
    component.selectedArticleIds = ['1', '2'];

    component.save();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      tagName: 'NewTag',
      selectedArticleIds: ['1', '2'],
    });
  });

  it('should close dialog without data on cancel', () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});

