import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

/**
 * Directive that emits events when horizontal width is changes according to provided breakpoints
 */
@Directive({
    selector: '[crhResponsive]',
    standalone: false
})
export class ResponsiveDirective implements OnDestroy, OnInit {
  private elementRef = inject(ElementRef);

  private resizeObserver = new ResizeObserver(entries =>
    this.onResizeEvent(entries)
  );

  /**
   * Defined breakpoints
   */
  public breakpoints = input<ResponiveBreakpoint[]>([]);

  /**
   * How the box size will be measured
   */
  public sizing = input<SizingType>('border-box');

  /**
   * Event emitted when detected breakpoints have changed. returns id or undefined if not known.
   */
  public onBreakpointChange = output<string | undefined>();

  private sortedBreakpoints = computed(() => {
    return this.breakpoints().sort(
      (v1, v2) => (v2.breakpoint ?? 0) - (v1.breakpoint ?? 0)
    );
  });
  private currentSize = signal<SizeEvent | undefined>(undefined);
  private previousEmittedBreakpoint?: ResponiveBreakpoint;

  constructor() {
    effect(() => {
      const currentBreakpoint = this.getCurrentBreakpointSize();
      if (currentBreakpoint.id !== this.previousEmittedBreakpoint?.id) {
        this.previousEmittedBreakpoint = currentBreakpoint;
        this.onBreakpointChange.emit(currentBreakpoint.id);
      }
    });
  }

  ngOnInit(): void {
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  private onResizeEvent(entries: ResizeObserverEntry[]): void {
    if (entries.length === 0) {
      return;
    }

    const entry = entries[0];
    this.currentSize.set({
      borderSize: entry.borderBoxSize[0].inlineSize,
      contentSize: entry.contentBoxSize[0].inlineSize,
    });
  }

  private getCurrentBreakpointSize(): ResponiveBreakpoint {
    const currentSize = this.currentSize();
    const breakpoints = this.sortedBreakpoints();

    if (!currentSize) {
      return breakpoints[0];
    }

    const currentSizePx =
      this.sizing() === 'content-box'
        ? currentSize.contentSize
        : currentSize.borderSize;

    for (const breakpoint of breakpoints) {
      const breakpointWidth = breakpoint.breakpoint ?? 0;
      if (currentSizePx > breakpointWidth) {
        return breakpoint;
      }
    }

    return breakpoints[0];
  }
}

interface SizeEvent {
  contentSize: number;
  borderSize: number;
}

/**
 * Breakpoints for defining certain screen sizes
 */
export interface ResponiveBreakpoint {
  /**
   * The Id of a given size/breakpoint
   */
  id: string;
  /**
   * Value in px of the smallest value a given id is valid for. Defaults to 0 if undefined
   */
  breakpoint?: number;
}

export type SizingType = 'content-box' | 'border-box';
