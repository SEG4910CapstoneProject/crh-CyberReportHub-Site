import { Component, computed, inject, ViewChild } from '@angular/core';
import { ReportArticleAreaComponent } from '../layout/report-article-area/report-article-area.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { JsonReportResponse } from '../../../shared/sdk/rest-api/model/jsonReportResponse';
import { ReportHeaderInfo } from '../../../shared/components/report-header/report-header.models';
import { DateUtilsService } from '../../../shared/services/date-utils.service';
import { JsonArticleReportResponse } from '../../../shared/sdk/rest-api/model/jsonArticleReportResponse';
import { JsonStatsResponse } from '../../../shared/sdk/rest-api/model/jsonStatsResponse';
import { ArticleCategoryGroup } from '../layout/report-article-area/report-article-area.models';
import { CategoriesService } from '../services/categories.service';

@Component({
    selector: 'crh-report-view',
    templateUrl: './report-view.component.html',
    styleUrl: './report-view.component.scss',
    standalone: false
})
export class ReportViewComponent {
  @ViewChild(ReportArticleAreaComponent)
  private reportArticleArea?: ReportArticleAreaComponent;

  private activatedRoute = inject(ActivatedRoute);
  private dateUtilsService = inject(DateUtilsService);
  private categoriesService = inject(CategoriesService);

  protected reportData = toSignal(
    this.activatedRoute.data.pipe(
      filter(obj => !!obj),
      map(({ reportData }) => reportData as JsonReportResponse)
    )
  );

  protected reportHeaderInfo = computed<ReportHeaderInfo | undefined>(() => {
    const reportData = this.reportData();
    if (!reportData) {
      return undefined;
    }

    const generatedDate = this.dateUtilsService.getDateFromString(
      reportData.generatedDate
    );
    const lastModifiedDate = this.dateUtilsService.getDateFromString(
      reportData.lastModified
    );
    const isEmailSent: boolean | undefined = reportData.emailStatus;

    if (!generatedDate || !lastModifiedDate || isEmailSent === undefined) {
      return undefined;
    }

    return {
      reportDate: generatedDate,
      generatedDate: generatedDate,
      isEmailSent: isEmailSent,
      lastModifiedDate: lastModifiedDate,
    };
  });

  protected reportArticles = computed<JsonArticleReportResponse[]>(() => {
    const reportArticles = this.reportData()?.articles;
    if (!reportArticles) {
      return [];
    }

    return reportArticles;
  });

  protected reportStats = computed<JsonStatsResponse[]>(
    () => this.reportData()?.stats ?? []
  );

  protected articleCategories = computed<ArticleCategoryGroup[]>(() =>
    this.categoriesService.getCategoriesFromArticles(this.reportArticles())
  );

  protected categories = computed<string[]>(() =>
    this.articleCategories().map(category => category.name)
  );

  protected onTableContentsSelect(category: string): void {
    if (!this.reportArticleArea) {
      return;
    }

    this.reportArticleArea.scrollToCategory(category);
  }
}
