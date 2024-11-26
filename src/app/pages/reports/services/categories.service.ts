import { Injectable } from '@angular/core';
import { JsonArticleReportResponse } from '../../../shared/sdk/rest-api/model/jsonArticleReportResponse';
import { ArticleCategoryGroup } from '../layout/report-article-area/report-article-area.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  public getCategoriesFromArticles(
    articles: JsonArticleReportResponse[]
  ): ArticleCategoryGroup[] {
    const resultMap: Record<string, ArticleCategoryGroup> = {};

    const copiedArticles = structuredClone(articles);

    for (const article of copiedArticles) {
      if (article.category == undefined) {
        article.category = environment.nullArticleCategoryName;
      }

      if (resultMap[article.category] == null) {
        resultMap[article.category] = {
          id: 0,
          name: article.category,
          articles: [],
        };
      }

      resultMap[article.category].articles.push(article);
    }

    const result = Object.values(resultMap);
    let currentIndex = 0;
    result.forEach(articleGroup => {
      articleGroup.id = currentIndex;
      currentIndex++;
    });

    return result;
  }
}
