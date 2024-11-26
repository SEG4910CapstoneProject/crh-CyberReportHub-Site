import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportArticleAreaComponent } from './report-article-area.component';
import { ComponentRef } from '@angular/core';
import { ArticleCategoryGroup } from './report-article-area.models';
import { JsonArticleReportResponse } from '../../../../shared/sdk/rest-api/model/jsonArticleReportResponse';

describe('ReportArticleAreaComponent', () => {
  let component: ReportArticleAreaComponent;
  let fixture: ComponentFixture<ReportArticleAreaComponent>;
  let componentRef: ComponentRef<ReportArticleAreaComponent>;

  const MOCK_CATEGORY_NAME = 'cat1';

  const MOCK_ARTICLES: JsonArticleReportResponse[] = [
    {
      articleId: 'abc',
      description: 'description',
      iocs: [
        {
          iocId: 1,
          iocTypeId: 1,
          iocTypeName: 'url',
          value: 'abc',
        },
      ],
      link: 'someLink',
      title: 'someTitle',
      category: MOCK_CATEGORY_NAME,
      publishDate: '2024-10-10',
    },
  ];

  const MOCK_CATEGORY_GROUPS: ArticleCategoryGroup[] = [
    {
      id: 0,
      articles: MOCK_ARTICLES,
      name: MOCK_CATEGORY_NAME,
    },
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

  it('should scroll to category when exists', () => {
    const scrollMockFn = jest.fn();
    const headerQueries = {
      get: jest.fn(() => ({
        nativeElement: {
          scrollIntoView: scrollMockFn,
        },
      })),
    };
    component['headerElements'] = headerQueries as any;
    componentRef.setInput('articleCategoryGroups', MOCK_CATEGORY_GROUPS);

    component.scrollToCategory('cat1');

    expect(scrollMockFn).toHaveBeenCalled();
  });

  it('should not scroll to category when exists', () => {
    const scrollMockFn = jest.fn();
    const headerQueries = {
      get: jest.fn(() => ({
        nativeElement: {
          scrollIntoView: scrollMockFn,
        },
      })),
    };
    component['headerElements'] = headerQueries as any;
    componentRef.setInput('articleCategoryGroups', MOCK_CATEGORY_GROUPS);

    component.scrollToCategory('cat2');

    expect(scrollMockFn).not.toHaveBeenCalled();
  });
});
