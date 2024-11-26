import {
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkNoDataRow,
  CdkCellOutlet,
} from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';

/*
 * Definitions for crh-related table row definitions extending from the cdk-table
 */

const ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;

@Directive({
  selector: '[crhHeaderRowDef]',
  // Disabling as inputs are just being renamed, not overriden
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [
    { name: 'columns', alias: 'crhHeaderRowDef' },
    {
      name: 'sticky',
      alias: 'crhHeaderRowDefSticky',
      transform: booleanAttribute,
    },
  ],
  providers: [
    { provide: CdkHeaderRowDef, useExisting: CrhHeaderRowDefDirective },
  ],
  standalone: true,
})
export class CrhHeaderRowDefDirective extends CdkHeaderRowDef {}

@Directive({
  selector: '[crhFooterRowDef]',
  // Disabling as inputs are just being renamed, not overriden
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [
    { name: 'columns', alias: 'crhFooterRowDef' },
    {
      name: 'sticky',
      alias: 'crhFooterRowDefSticky',
      transform: booleanAttribute,
    },
  ],
  providers: [
    { provide: CdkFooterRowDef, useExisting: CrhFooterRowDefDirective },
  ],
  standalone: true,
})
export class CrhFooterRowDefDirective extends CdkFooterRowDef {}

@Directive({
  selector: '[crhRowDef]',
  // Disabling as inputs are just being renamed, not overriden
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [
    { name: 'columns', alias: 'crhRowDefColumns' },
    { name: 'when', alias: 'crhRowDefWhen' },
  ],
  providers: [{ provide: CdkRowDef, useExisting: CrhRowDefDirective }],
  standalone: true,
})
export class CrhRowDefDirective<T> extends CdkRowDef<T> {}

@Component({
  selector: 'crh-header-row, tr[crh-header-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'crh-table-header-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: CdkHeaderRow, useExisting: CrhHeaderRowComponent }],
  imports: [CdkCellOutlet],
  standalone: true,
})
export class CrhHeaderRowComponent extends CdkHeaderRow {}

@Component({
  selector: 'crh-footer-row, tr[crh-footer-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'crh-table-footer-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: CdkFooterRow, useExisting: CrhFooterRowComponent }],
  imports: [CdkCellOutlet],
  standalone: true,
})
export class CrhFooterRowComponent extends CdkFooterRow {}

@Component({
  selector: 'crh-row, tr[crh-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'crh-table-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: CdkRow, useExisting: CrhRowComponent }],
  imports: [CdkCellOutlet],
  standalone: true,
})
export class CrhRowComponent extends CdkRow {}

@Directive({
  selector: 'ng-template[crhNoDataRow]',
  providers: [{ provide: CdkNoDataRow, useExisting: CrhNoDataRowDirective }],
  standalone: true,
})
export class CrhNoDataRowDirective extends CdkNoDataRow {
  override _contentClassName = 'crh-table-no-data-row';
}
