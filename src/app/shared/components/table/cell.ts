import { Directive, Input } from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';

/*
 * Definitions for crh-related table cell definitions extending from the cdk-table
 */

@Directive({
  selector: '[crhCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: CrhCellDefDirective }],
  standalone: true,
})
export class CrhCellDefDirective extends CdkCellDef {}

@Directive({
  selector: '[crhHeaderCellDef]',
  providers: [
    { provide: CdkHeaderCellDef, useExisting: CrhHeaderCellDefDirective },
  ],
  standalone: true,
})
export class CrhHeaderCellDefDirective extends CdkHeaderCellDef {}

@Directive({
  selector: '[crhFooterCellDef]',
  providers: [
    { provide: CdkFooterCellDef, useExisting: CrhFooterCellDefDirective },
  ],
  standalone: true,
})
export class CrhFooterCellDefDirective extends CdkFooterCellDef {}

@Directive({
  selector: '[crhColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: CrhColumnDefDirective },
    {
      provide: 'MAT_SORT_HEADER_COLUMN_DEF',
      useExisting: CrhColumnDefDirective,
    },
  ],
  standalone: true,
})
export class CrhColumnDefDirective extends CdkColumnDef {
  @Input('crhColumnDef')
  override set name(name: string) {
    this._setNameInput(name);
  }

  override get name(): string {
    return this._name;
  }
}

@Directive({
  selector: 'crhHeaderCell, th[crhHeaderCell]',
  host: {
    class: 'crh-table-header-cell',
    role: 'columnheader',
  },
  standalone: true,
})
export class CrhHeaderCellDirective extends CdkHeaderCell {}

@Directive({
  selector: 'crhFooterCell, td[crhFooterCell]',
  host: {
    class: 'crh-table-footer-cell',
  },
  standalone: true,
})
export class CrhFooterCellDirective extends CdkFooterCell {}

@Directive({
  selector: 'crhCell, td[crhCell]',
  host: {
    class: 'crh-table-cell',
  },
  standalone: true,
})
export class CrhCellDirective extends CdkCell {}
