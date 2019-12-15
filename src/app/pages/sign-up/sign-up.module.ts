import {NgModule} from '@angular/core';

import {SignUpRoutingModule} from './sign-up-routing.module';

import {SignUpComponent} from './sign-up.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [SignUpRoutingModule, NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [SignUpComponent],
  exports: [SignUpComponent]
})
export class SignUpModule {
}
