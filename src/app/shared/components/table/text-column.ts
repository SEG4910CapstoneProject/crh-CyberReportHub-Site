import { CdkTextColumn } from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CrhCellDirective,
  CrhCellDefDirective,
  CrhColumnDefDirective,
  CrhHeaderCellDirective,
  CrhHeaderCellDefDirective,
} from './cell';

/**
 * From CDK: Table
 * Column that simply shows text content for the header and row cells. Assumes that the table
 * is using the native table implementation (`<table>`).
 *
 * By default, the name of this column will be the header text and data property accessor.
 * The header text can be overridden with the `headerText` input. Cell values can be overridden with
 * the `dataAccessor` input. Change the text justification to the start or end using the `justify`
 * input.
 */
@Component({
  selector: 'crh-text-column',
  template: `
    <ng-container crhColumnDef>
      <th crhHeaderCell *crhHeaderCellDef [style.text-align]="justify">
        {{ headerText }}
      </th>
      <td crhCell *crhCellDef="let data" [style.text-align]="justify">
        {{ dataAccessor(data, name) }}
      </td>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    CrhColumnDefDirective,
    CrhHeaderCellDefDirective,
    CrhHeaderCellDirective,
    CrhCellDefDirective,
    CrhCellDirective,
  ],
})
export class CrhTextColumnComponent<T> extends CdkTextColumn<T> {}
