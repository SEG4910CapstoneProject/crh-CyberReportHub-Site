import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportArticleAreaComponent } from './report-article-area.component';
import { ComponentRef } from '@angular/core';
import { ArticleCategoryGroup } from './report-article-area.models';
import { JsonArticleReportResponse } from '../../../../shared/sdk/rest-api/model/jsonArticleReportResponse';

describe('ReportArticleAreaComponent', () => {
  let component: ReportArticleAreaComponent;
  let fixture: ComponentFixture<ReportArticleAreaComponent>;
  let componentRef: ComponentRef<ReportArticleAreaComponent>;

  const MOCK_ARTICLES: JsonArticleReportResponse[] = [
    {
      articleId: 'abc',
      description: 'description',
      iocs: [{ iocId: 1, iocTypeId: 1, iocTypeName: 'url', value: 'abc' }],
      link: 'someLink',
      title: 'someTitle',
      category: 'cat1',
      publishDate: '2024-10-10',
    },
  ];

  const MOCK_CATEGORY_GROUPS: ArticleCategoryGroup[] = [
    { id: 0, articles: MOCK_ARTICLES, name: 'cat1' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportArticleAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportArticleAreaComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not scroll when headerElements undefined', () => {
    component['headerElements'] = undefined as any;
    componentRef.setInput('articleCategoryGroups', MOCK_CATEGORY_GROUPS);
    expect(() => component.scrollToCategory('cat1')).not.toThrow();
  });

  it('should not scroll when category not found', () => {
    component['headerElements'] = { get: jest.fn() } as any;
    componentRef.setInput('articleCategoryGroups', MOCK_CATEGORY_GROUPS);
    component.scrollToCategory('catX');
    expect((component['headerElements'] as any).get).not.toHaveBeenCalled();
  });

  it('should not scroll when element undefined', () => {
    const getFn = jest.fn(() => undefined);
    component['headerElements'] = { get: getFn } as any;
    componentRef.setInput('articleCategoryGroups', MOCK_CATEGORY_GROUPS);
    component.scrollToCategory('cat1');
    expect(getFn).toHaveBeenCalledWith(0);
  });

  it('should scroll when category exists', () => {
    const scrollFn = jest.fn();
    component['headerElements'] = {
      get: jest.fn(() => ({ nativeElement: { scrollIntoView: scrollFn } })),
    } as any;
    componentRef.setInput('articleCategoryGroups', MOCK_CATEGORY_GROUPS);
    component.scrollToCategory('cat1');
    expect(scrollFn).toHaveBeenCalled();
  });

  it('should not scroll when wrong category', () => {
    const scrollFn = jest.fn();
    component['headerElements'] = {
      get: jest.fn(() => ({ nativeElement: { scrollIntoView: scrollFn } })),
    } as any;
    componentRef.setInput('articleCategoryGroups', MOCK_CATEGORY_GROUPS);
    component.scrollToCategory('cat2');
    expect(scrollFn).not.toHaveBeenCalled();
  });
});
