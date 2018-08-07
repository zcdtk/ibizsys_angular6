import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { LayoutPassportComponent } from './passport/passport.component';

const component = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  LayoutPassportComponent
];

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule
  ],
  declarations: [...component]
})
export class LayoutModule { }
