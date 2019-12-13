import {NgModule} from '@angular/core';

import {FacilitiesRoutingModule} from './facilities-routing.module';

import {FacilitiesComponent} from './facilities.component';
import {NzCardModule} from 'ng-zorro-antd';


@NgModule({
  imports: [FacilitiesRoutingModule, NzCardModule],
  declarations: [FacilitiesComponent],
  exports: [FacilitiesComponent]
})
export class FacilitiesModule {
}
