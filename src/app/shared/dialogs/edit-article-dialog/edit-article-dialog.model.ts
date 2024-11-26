import { DateTime } from 'luxon';
import { JsonArticleReportResponse } from '../../sdk/rest-api/model/jsonArticleReportResponse';

export interface EditArticleDialogData {
  article: Partial<JsonArticleReportResponse>;
}

export type EditArticleDialogResult = undefined | EditArticleDialogResultObject;

export interface EditArticleDialogResultObject {
  articleId?: string;
  title: string;
  description: string;
  link: string;
  publishDate: DateTime;
}
