import { NgModule } from '@angular/core';

import { LayoutModule } from '@angular/cdk/layout';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CdkMenuModule } from '@angular/cdk/menu';

const modules = [LayoutModule, CdkAccordionModule, CdkMenuModule];

@NgModule({
  imports: modules,
  exports: modules,
})
export class CdkModule {}
