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
      { articleId: '1', title: 'Article One' },
      { articleId: '2', title: 'Article Two' },
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

  it('should initialize with empty tag name and no articles selected when creating a new tag', () => {
    expect(component.tagName).toBe('');
    expect(component.selectedArticleIds.length).toBe(0);
  });

  it('should initialize with provided tag data when editing', () => {
    const editData = {
      ...mockData,
      tag: { tagName: 'ExistingTag', articleIds: ['1'] },
    };

    const comp = new CreateTagDialogComponent(mockDialogRef as any, editData as any);
    expect(comp.tagName).toBe('ExistingTag');
    expect(comp.selectedArticleIds).toEqual(['1']);
  });

  it('should toggle article selection (add and remove)', () => {
    const articleId = '1';
    component.toggleArticleSelection(articleId);
    expect(component.selectedArticleIds).toContain(articleId);

    component.toggleArticleSelection(articleId);
    expect(component.selectedArticleIds).not.toContain(articleId);
  });

  it('should return true when article is selected', () => {
    component.selectedArticleIds = ['1', '2'];
    expect(component.isSelected('1')).toBe(true);
  });

  it('should return false when article is not selected', () => {
    component.selectedArticleIds = ['2'];
    expect(component.isSelected('1')).toBe(false);
  });

  it('should close the dialog with tag data when save() is called', () => {
    component.tagName = 'NewTag';
    component.selectedArticleIds = ['1', '2'];

    component.save();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      tagName: 'NewTag',
      selectedArticleIds: ['1', '2'],
    });
  });

  it('should close the dialog without data when cancel() is called', () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});
