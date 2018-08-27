import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { IBizFormComponent } from './ibiz-form/ibiz-form.component';
import { IBizFormGroupComponent } from './ibiz-form-group/ibiz-form-group.component';
import { IBizFormItemComponent } from './ibiz-form-item/ibiz-form-item.component';
import { IbizDatepickerComponent } from './ibiz-datepicker/ibiz-datepicker.component';

const conponents = [
  IBizFormComponent,
  IBizFormGroupComponent,
  IBizFormItemComponent,
  IbizDatepickerComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ...conponents
  ],
  declarations: [
    ...conponents,
  ],
  entryComponents: [
  ],
})
export class IBizComponentsModule { }
