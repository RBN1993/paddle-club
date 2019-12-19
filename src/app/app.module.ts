import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IconsProviderModule} from './icons-provider.module';
import {NgZorroAntdModule, NZ_I18N, es_ES} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import es from '@angular/common/locales/es';
import {AuthRestService} from './core/services/auth.service';
import {UserRestService} from './core/services/user.service';
import {RouterModule} from '@angular/router';
import {BookingRestService} from './core/services/booking.service';


registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule
  ],
  providers: [{provide: NZ_I18N, useValue: es_ES}, AuthRestService, UserRestService, BookingRestService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
