import {NgModule} from '@angular/core';

import {BookingRoutingModule} from './booking-routing.module';

import {BookingComponent} from './booking.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [BookingRoutingModule, NgZorroAntdModule, CommonModule, FormsModule],
  declarations: [BookingComponent],
  exports: [BookingComponent]
})
export class BookingModule {
}
