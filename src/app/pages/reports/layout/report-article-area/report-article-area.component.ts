import {
  Component,
  computed,
  ElementRef,
  input,
  output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { JsonArticleReportResponse } from '../../../../shared/sdk/rest-api/model/jsonArticleReportResponse';
import { ArticleCategoryGroup } from './report-article-area.models';

@Component({
    selector: 'crh-report-article-area',
    templateUrl: './report-article-area.component.html',
    styleUrl: './report-article-area.component.scss',
    standalone: false
})
export class ReportArticleAreaComponent {
  @ViewChildren('reportCategories', { read: ElementRef })
  private headerElements?: QueryList<ElementRef>;

  public editable = input<boolean>(false);
  public articleCategoryGroups = input<ArticleCategoryGroup[]>([]);

  public _onArticleEdit = output<JsonArticleReportResponse>();
  public _onArticleRemove = output<string>();

  private articleCategoryNameGroupIdMap = computed<Map<string, number>>(() => {
    return new Map<string, number>(
      this.articleCategoryGroups().map(group => [group.name, group.id])
    );
  });

  public scrollToCategory(categoryName: string): void {
    if (!this.headerElements) {
      return;
    }

    const categoryMap = this.articleCategoryNameGroupIdMap();
    const index = categoryMap.get(categoryName);

    if (index === undefined) {
      return;
    }

    const matchedElement = this.headerElements.get(index);
    if (matchedElement === undefined) {
      return;
    }

    matchedElement.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
