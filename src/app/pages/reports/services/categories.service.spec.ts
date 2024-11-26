import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './categories.service';
import { JsonArticleReportResponse } from '../../../shared/sdk/rest-api/model/jsonArticleReportResponse';
import { ArticleCategoryGroup } from '../layout/report-article-area/report-article-area.models';
import { environment } from '../../../../environments/environment';

window.structuredClone = (item): any => JSON.parse(JSON.stringify(item));

describe('CategoriesService', () => {
  let service: CategoriesService;

  const ARTICLES: JsonArticleReportResponse[] = [
    {
      articleId: 'someId1',
      description: 'someDescription',
      iocs: [
        {
          iocId: 2,
          iocTypeId: 1,
          iocTypeName: 'url',
          value: 'text',
        },
      ],
      link: 'someLink',
      title: 'someTitle',
      publishDate: '2024-01-01',
      category: 'cat1',
    },
    {
      articleId: 'someId2',
      description: 'someDescription',
      iocs: [
        {
          iocId: 2,
          iocTypeId: 1,
          iocTypeName: 'url',
          value: 'text',
        },
      ],
      link: 'someLink',
      title: 'someTitle',
      publishDate: '2024-01-01',
      category: 'cat2',
    },
    {
      articleId: 'someId3',
      description: 'someDescription',
      iocs: [
        {
          iocId: 2,
          iocTypeId: 1,
          iocTypeName: 'url',
          value: 'text',
        },
      ],
      link: 'someLink',
      title: 'someTitle',
      publishDate: '2024-01-01',
      category: undefined,
    },
    {
      articleId: 'someId4',
      description: 'someDescription',
      iocs: [
        {
          iocId: 2,
          iocTypeId: 1,
          iocTypeName: 'url',
          value: 'text',
        },
      ],
      link: 'someLink',
      title: 'someTitle',
      publishDate: '2024-01-01',
      category: 'cat1',
    },
  ];

  const UNCATEGORIZED_ARTICLE: JsonArticleReportResponse = {
    articleId: 'someId3',
    description: 'someDescription',
    iocs: [
      {
        iocId: 2,
        iocTypeId: 1,
        iocTypeName: 'url',
        value: 'text',
      },
    ],
    link: 'someLink',
    title: 'someTitle',
    publishDate: '2024-01-01',
    category: environment.nullArticleCategoryName,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get categories correctly', () => {
    const result = service.getCategoriesFromArticles(ARTICLES);

    expect(result[0]).toMatchObject({
      id: 0,
      name: 'cat1',
      articles: [ARTICLES[0], ARTICLES[3]],
    } satisfies ArticleCategoryGroup);
    expect(result[1]).toMatchObject({
      id: 1,
      name: 'cat2',
      articles: [ARTICLES[1]],
    } satisfies ArticleCategoryGroup);
    expect(result[2]).toMatchObject({
      id: 2,
      name: environment.nullArticleCategoryName,
      articles: [UNCATEGORIZED_ARTICLE],
    } satisfies ArticleCategoryGroup);
  });
});
