import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';
import {
  _COALESCED_STYLE_SCHEDULER,
  _CoalescedStyleScheduler,
  CDK_TABLE,
  CdkTable,
  DataRowOutlet,
  FooterRowOutlet,
  HeaderRowOutlet,
  NoDataRowOutlet,
  STICKY_POSITIONING_LISTENER,
} from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ColorsService } from '../../services/colors.service';

@Directive({
  selector: 'crh-table[recycleRows], table[crh-table][recycleRows]',
  providers: [
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _RecycleViewRepeaterStrategy,
    },
  ],
  standalone: true,
})
export class CrhRecycleRowsDirective {}

@Component({
    selector: 'crh-table, table[crh-table]',
    exportAs: 'crhTable',
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    host: {
        'class': 'crh-table-host',
        'role': 'table',
        '[style]': 'customCssStyleVars',
    },
    providers: [
        {
            provide: _VIEW_REPEATER_STRATEGY,
            useClass: _DisposeViewRepeaterStrategy,
        },
        { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
        { provide: CdkTable, useExisting: CrhTableComponent },
        { provide: CDK_TABLE, useExisting: CrhTableComponent },
        { provide: STICKY_POSITIONING_LISTENER, useValue: null },
    ],
    imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet]
})
export class CrhTableComponent<T> extends CdkTable<T> {
  private colorsService = inject(ColorsService);
  private elementRef = inject(ElementRef);

  protected get customCssStyleVars(): string {
    const computedColorStyle = this.colorsService.getComputedStyle(
      '--crh-background-contrast-color',
      this.elementRef
    );
    if (!computedColorStyle) {
      return '';
    }
    return `
      --crh-table-divider-color: ${this.colorsService.setAlpha(computedColorStyle, 0.25)};
      --crh-table-header-divider-color: ${this.colorsService.setAlpha(computedColorStyle, 0.5)};
    `;
  }
}
