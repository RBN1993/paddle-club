import {NgModule} from '@angular/core';

import {LoginRoutingModule} from './login-routing.module';

import {LoginComponent} from './login.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [LoginRoutingModule, NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule {
}
