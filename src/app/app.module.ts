import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';

import { LayoutModule } from './layout/layout.module';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
import { IBizAppService } from '@ibizsys/IBizAppService';
import { IBizHttp } from '@ibizsys/util/IBizHttp';
import { IBizNotification } from '@ibizsys/util/IBizNotification';
import { DefaultInterceptor } from '@core/net/default.interceptor';

import localeZhHans from '@angular/common/locales/zh-Hans';
registerLocaleData(localeZhHans);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    LayoutModule,
    RouteRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    IBizAppService,
    IBizHttp,
    IBizNotification,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
