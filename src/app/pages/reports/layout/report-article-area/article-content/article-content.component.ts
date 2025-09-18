import { Component, computed, inject, input, output } from '@angular/core';
import { JsonArticleReportResponse } from '../../../../../shared/sdk/rest-api/model/jsonArticleReportResponse';
import { IocTypeService } from '../../../services/ioc-type.service';

@Component({
  selector: 'crh-article-content',
  templateUrl: './article-content.component.html',
  styleUrl: './article-content.component.scss',
  standalone: false,
})
export class ArticleContentComponent {
  public articleDetails = input<JsonArticleReportResponse>();
  public editable = input<boolean>(false);
  private iocTypeService = inject(IocTypeService);

  public _onEditClicked = output<void>();
  public _onDeleteClicked = output<void>();

  protected availableIocs = computed(() => {
    const articleDetails = this.articleDetails();
    if (!articleDetails) {
      return [];
    }

    const iocTypes = this.iocTypeService.getTypesFromIOCs(articleDetails.iocs);
    return iocTypes.map(ioc => ioc.name + ': ' + ioc.iocs.length);
  });
}
