import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LuxonDateModule } from '@angular/material-luxon-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogModule } from '@angular/cdk/dialog';

const modules = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  LuxonDateModule,
  MatProgressSpinnerModule,
  DialogModule,
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class MaterialModule {}
