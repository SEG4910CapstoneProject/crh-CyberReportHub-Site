import { Component, input, output } from '@angular/core';
import { JsonArticleReportResponse } from '../../../../shared/sdk/rest-api/model/jsonArticleReportResponse';

@Component({
  selector: 'crh-article-suggestion',
  templateUrl: './article-suggestion.component.html',
  styleUrl: './article-suggestion.component.scss',
})
export class ArticleSuggestionComponent {
  public articleDetails = input<JsonArticleReportResponse>();

  public onEditClicked = output<void>();
  public onDeleteClicked = output<void>();
  public onAddClicked = output<void>();
}
