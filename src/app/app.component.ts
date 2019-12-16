import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthRestService} from './core/services/auth.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLogged = false;

  constructor(private authRestService: AuthRestService) {
  }

  ngOnDestroy(): void {
    this.authRestService.loginEmitter.unsubscribe();
  }

  ngOnInit(): void {
    this.isLogged = this.authRestService.isLogged();
    this.authRestService.loginEmitter.subscribe(value => {
      this.isLogged = value;
    });
  }

  closeSession() {
    this.authRestService.logout();
  }
}
