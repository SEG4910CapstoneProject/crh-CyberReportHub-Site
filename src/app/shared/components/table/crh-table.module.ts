import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { CrhRecycleRowsDirective, CrhTableComponent } from './table.component';
import { CrhTextColumnComponent } from './text-column';
import {
  CrhCellDirective,
  CrhCellDefDirective,
  CrhColumnDefDirective,
  CrhFooterCellDirective,
  CrhFooterCellDefDirective,
  CrhHeaderCellDirective,
  CrhHeaderCellDefDirective,
} from './cell';
import {
  CrhFooterRowComponent,
  CrhFooterRowDefDirective,
  CrhHeaderRowComponent,
  CrhHeaderRowDefDirective,
  CrhNoDataRowDirective,
  CrhRowComponent,
  CrhRowDefDirective,
} from './row';
import { SortHeaderComponent } from './sort-header/sort-header.component';
import { CrhSortDirective } from './sort-header/sort.directive';

const DECLARATIONS = [
  // Table
  CrhTableComponent,
  CrhRecycleRowsDirective,

  // Columns
  CrhTextColumnComponent,

  // Cell Definitions
  CrhCellDefDirective,
  CrhHeaderCellDefDirective,
  CrhFooterCellDefDirective,
  CrhColumnDefDirective,
  CrhHeaderCellDirective,
  CrhFooterCellDirective,
  CrhCellDirective,

  // Row Definitions
  CrhHeaderRowDefDirective,
  CrhFooterRowDefDirective,
  CrhRowDefDirective,
  CrhHeaderRowComponent,
  CrhFooterRowComponent,
  CrhRowComponent,
  CrhNoDataRowDirective,

  // Sort
  CrhSortDirective,
  SortHeaderComponent,
];

@NgModule({
  imports: [CdkTableModule, ...DECLARATIONS],
  exports: DECLARATIONS,
})
export class CrhTableModule {}
