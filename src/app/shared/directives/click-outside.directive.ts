import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  output,
} from '@angular/core';

@Directive({
  selector: '[crhClickOutside]',
})
export class ClickOutsideDirective {
  private elementRef = inject(ElementRef);

  public onClickOutside = output<void>();

  @HostListener('document:click', ['$event'])
  private onClick(event: MouseEvent): void {
    const targetElement = event.target;
    if (!targetElement) {
      return;
    }

    const hasClickedInside =
      this.elementRef.nativeElement.contains(targetElement);
    if (!hasClickedInside) {
      this.onClickOutside.emit();
    }
  }
}
