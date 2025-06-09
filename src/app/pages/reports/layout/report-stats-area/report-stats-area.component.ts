import { Component, computed, input, output } from '@angular/core';
import { InteractMode } from '../../../../shared/components/stats-card/stats-card.models';
import { JsonStatsResponse } from '../../../../shared/sdk/rest-api/model/jsonStatsResponse';

@Component({
    selector: 'crh-report-stats-area',
    templateUrl: './report-stats-area.component.html',
    styleUrl: './report-stats-area.component.scss',
    standalone: false
})
export class ReportStatsAreaComponent {
  public stats = input<JsonStatsResponse[]>([]);
  public editable = input<boolean>(false);

  public _onEditStat = output<JsonStatsResponse>();
  public _onRemoveStat = output<string>();

  protected statCardEditMode = computed<InteractMode>(() => {
    if (this.editable()) {
      return 'removeMode';
    }
    return 'none';
  });
}
