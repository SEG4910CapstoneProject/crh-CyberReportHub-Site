import { CdkAccordionItem } from '@angular/cdk/accordion';
import { Component, effect, input, ViewChild } from '@angular/core';

@Component({
    selector: 'crh-accordion',
    templateUrl: './accordion.component.html',
    styleUrl: './accordion.component.scss',
    standalone: false
})
export class AccordionComponent {
  @ViewChild(CdkAccordionItem, {
    static: true,
  })
  private accordion?: CdkAccordionItem;

  public header = input<string>('Header');
  public defaultOpenState = input<boolean>(false);

  constructor() {
    effect(() => {
      const openState = this.defaultOpenState();
      this.setState(openState);
    });
  }

  public setState(open: boolean): void {
    if (!this.accordion) {
      return;
    }
    if (open) {
      this.accordion.open();
      return;
    }
    this.accordion.close();
  }
}
