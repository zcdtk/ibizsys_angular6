import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

const userConponents = [
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ...userConponents
  ],
  declarations: [
    ...userConponents
  ],
  providers: [

  ]
})
export class UserModule { }
