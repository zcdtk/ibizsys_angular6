import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { LayoutPassportComponent } from './passport/passport.component';
import { HeaderComponent } from './default/header/header.component';
import { LoginComponent } from './passport/login/login.component';
import { UserComponentComponent }  from './default/header/components/user-component/user-component.component';

const component = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  LayoutPassportComponent,
  HeaderComponent,
  LoginComponent,
  UserComponentComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [...component]
})
export class LayoutModule { }

