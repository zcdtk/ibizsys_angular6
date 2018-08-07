import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '@core/auth/auth-guard.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthGuard
  ],
  declarations: []
})
export class CoreModule { }
