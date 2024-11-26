import { JsonArticleReportResponse } from '../../../../shared/sdk/rest-api/model/jsonArticleReportResponse';
import { JsonIocResponse } from '../../../../shared/sdk/rest-api/model/jsonIocResponse';

export interface ArticleCategoryGroup {
  id: number;
  name: string;
  articles: JsonArticleReportResponse[];
}

export interface IOCTypeGroup {
  id: number;
  name: string;
  iocs: JsonIocResponse[];
}

export interface ArticleContent {
  id: string;
  title: string;
  iocs: string[];
  link: string;
  description: string;
}
