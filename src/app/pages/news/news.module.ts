import {NgModule} from '@angular/core';

import {NewsRoutingModule} from './news-routing.module';

import {NewsComponent} from './news.component';


@NgModule({
  imports: [NewsRoutingModule],
  declarations: [NewsComponent],
  exports: [NewsComponent]
})
export class NewsModule {
}
