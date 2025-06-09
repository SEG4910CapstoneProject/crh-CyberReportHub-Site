import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { CrhSortDirective } from './sort.directive';
import {
  directionToAriaSortDirection,
  directionToMatSymbol,
  nextSortDirection,
  SortDirection,
  SortResult,
} from './sort.models';
import { CrhColumnDefDirective } from '../cell';
import { ColorsService } from '../../../services/colors.service';

/* Component selected disabled for next component as this is augmenting
 * an existing component with these rules.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[crh-sort-header]:not(crh-text-column):not(ng-container)',
  templateUrl: './sort-header.component.html',
  styleUrl: './sort-header.component.scss',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    'role': 'button',
    'aria-labelledby': 'crh-sort-header-content',
    'attr.aria-sort': 'ariaSortLabel()',
    '(click)': 'onClick()',
  },
  standalone: true,
})
export class SortHeaderComponent {
  private parentSortDirective = inject(CrhSortDirective, {
    optional: true,
  })!;

  private parentColumnDefinition = inject(CrhColumnDefDirective, {
    optional: true,
  })!;

  private colorsService = inject(ColorsService);
  private elementRef = inject(ElementRef);

  public sortAria = input<string>('Sort');

  private name = signal<string | undefined>(undefined);
  private currentSortSignal = signal<SortResult | undefined>(undefined);
  protected isHoveringSignal = signal<boolean>(false);

  protected shouldUseHoverColor = computed(() => {
    const isHovering = this.isHoveringSignal();
    const currentSort = this.currentSortSignal();
    const columnId = this.name();
    return (
      isHovering &&
      (currentSort === undefined || currentSort.columnId !== columnId)
    );
  });

  protected shouldShowAsCurrentSort = computed(() => {
    const currentSort = this.currentSortSignal();
    const columnId = this.name();
    const isHovering = this.isHoveringSignal();
    return isHovering || (!!currentSort && currentSort.columnId === columnId);
  });

  private currentSortDirection = computed<SortDirection>(() => {
    const currentSort = this.currentSortSignal();
    const columnId = this.name();
    if (!currentSort || currentSort.columnId !== columnId) {
      return '';
    }
    return currentSort.direction;
  });

  protected currentSortIcon = computed<string>(() => {
    const currentSortDirection = this.currentSortDirection();
    if (currentSortDirection === '') {
      const nextDirection = nextSortDirection[''];
      return directionToMatSymbol[nextDirection];
    }
    return directionToMatSymbol[currentSortDirection];
  });

  protected ariaSortLabel = computed(() => {
    const currentSortDirection = this.currentSortDirection();
    return directionToAriaSortDirection[currentSortDirection];
  });

  constructor() {
    // Manually assert existance of CrhSort in parent for better error message
    if (!this.parentSortDirective) {
      throw Error('crh-sort-header is not a child of a crh-sort');
    }

    if (!this.parentColumnDefinition) {
      throw Error('crh-sort-header is not a child of a crhColumnDef');
    }

    this.parentSortDirective._onSortChange.subscribe(value =>
      this.currentSortSignal.set(value)
    );

    this.name.set(this.parentColumnDefinition.name);
  }

  public onMouseEnter(): void {
    this.isHoveringSignal.set(true);
  }

  public onMouseLeave(): void {
    this.isHoveringSignal.set(false);
  }

  protected onClick(): void {
    const columnName = this.name();
    if (!columnName) {
      throw Error('crh-sort-header has no column defined name');
    }
    this.parentSortDirective.cycleNextSortOption(columnName);
  }

  protected get customCssStyleVars(): string {
    const computedColorStyle = this.colorsService.getComputedStyle(
      '--crh-base-text-color',
      this.elementRef
    );
    if (!computedColorStyle) {
      return '';
    }
    return `--crh-sort-header-hover-color: ${this.colorsService.setAlpha(computedColorStyle, 0.5)}`;
  }
}
