import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { PaginatorStatus, PaginatorVariant } from './paginator.models';
import { SelectConfig, SelectOption } from '../select/select.model';

@Component({
  selector: 'crh-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  public options = input<number[]>([5, 10, 25]);
  public totalResults = input<number>(0);
  public variant = input<PaginatorVariant>('full');
  public pageStatus = output<PaginatorStatus>();

  private currentPage = signal<number>(0);
  private itemsPerPageIndex = signal<number>(0);

  protected selectConfig = computed(() => {
    const options = this.options();
    return {
      options: options.map((value, index) => {
        return {
          id: index.toString(),
          label: value.toString(),
        } satisfies SelectOption;
      }),
    } satisfies SelectConfig;
  });

  private itemsPerPage = computed(() => {
    const options = this.options();
    const itemsPerPageIndex = this.itemsPerPageIndex();
    return options[itemsPerPageIndex];
  });

  private lastPage = computed(() => {
    const totalResults = this.totalResults();
    const itemsPerPage = this.itemsPerPage();
    return Math.ceil(totalResults / itemsPerPage) - 1;
  });

  protected startNum = computed(() => {
    const currentPage = this.currentPage();
    const itemsPerPage = this.itemsPerPage();
    return itemsPerPage * currentPage + 1;
  });

  protected endNum = computed(() => {
    const startNum = this.startNum();
    const totalResults = this.totalResults();
    const itemsPerPage = this.itemsPerPage();

    const endNum = startNum + itemsPerPage - 1;
    if (endNum > totalResults) {
      return totalResults;
    }
    return endNum;
  });

  protected disableFirstPage = computed(() => {
    const currentPage = this.currentPage();
    return currentPage === 0;
  });

  protected disableLastPage = computed(() => {
    const currentPage = this.currentPage();
    const lastPage = this.lastPage();
    return currentPage === lastPage;
  });

  constructor() {
    effect(() => {
      this.pageStatus.emit({
        itemsPerPage: this.itemsPerPage(),
        page: this.currentPage(),
      });
    });
  }

  protected onSelectChange(id: string | undefined): void {
    if (!id) {
      return;
    }

    const startNum = this.startNum();
    const newItemsPerPageIndex = Number.parseInt(id);

    const options = this.options();
    const itemsPerPage = options[newItemsPerPageIndex];
    const newPage = Math.floor(startNum / itemsPerPage);

    this.itemsPerPageIndex.set(newItemsPerPageIndex);
    this.currentPage.set(newPage);
  }

  public reset(): void {
    this.currentPage.set(0);
  }

  protected toBeginning(): void {
    this.currentPage.set(0);
  }

  protected toEnd(): void {
    this.currentPage.set(this.lastPage());
  }

  protected incrementPage(): void {
    this.currentPage.set(this.currentPage() + 1);
  }

  protected decrementPage(): void {
    this.currentPage.set(this.currentPage() - 1);
  }
}
