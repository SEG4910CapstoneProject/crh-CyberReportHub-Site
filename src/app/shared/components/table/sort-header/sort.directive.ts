import { Directive, effect, output, signal } from '@angular/core';
import { nextSortDirection, SortResult } from './sort.models';

@Directive({
  selector: '[crhSort]',
  standalone: true,
})
export class CrhSortDirective {
  public _onSortChange = output<SortResult | undefined>();

  protected currentSort = signal<SortResult | undefined>(undefined);

  constructor() {
    effect(() => {
      this._onSortChange.emit(this.currentSort());
    });
  }

  public changeSort(sortResult: SortResult | undefined): void {
    if (!sortResult || sortResult.direction === '') {
      this.currentSort.set(undefined);
    } else {
      this.currentSort.set(sortResult);
    }
  }

  public cycleNextSortOption(columnId: string): void {
    const currentSort = this.currentSort();

    if (!currentSort || currentSort.columnId !== columnId) {
      this.changeSort({
        columnId,
        direction: nextSortDirection[''],
      });
      return;
    }

    this.changeSort({
      columnId,
      direction: nextSortDirection[currentSort.direction],
    });
  }
}
