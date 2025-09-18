import { Component, input, output } from '@angular/core';
import { JsonArticleReportResponse } from '../../../../shared/sdk/rest-api/model/jsonArticleReportResponse';

@Component({
  selector: 'crh-article-suggestion',
  templateUrl: './article-suggestion.component.html',
  styleUrl: './article-suggestion.component.scss',
  standalone: false,
})
export class ArticleSuggestionComponent {
  public articleDetails = input<JsonArticleReportResponse>();

  public _onEditClicked = output<void>();
  public _onDeleteClicked = output<void>();
  public _onAddClicked = output<void>();
}
