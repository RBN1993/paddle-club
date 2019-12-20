import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AuthModel} from '../models/auth.model';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})


export class AuthRestService implements CanActivate {
  private baseUrl = 'http://fenw.etsisi.upm.es:10000';
  @Output() loginEmitter = new EventEmitter();

  constructor(private http: HttpClient, private router: Router) {
  }

  login(loginForm: AuthModel) {
    const {userName, password} = loginForm;

    return this.http.get(this.baseUrl + '/users/login?' + `username=${userName}&password=${password}`,
      {observe: 'response'});
  }

  redirectAfterLogin(route) {
    const goTo = route.queryParams.returnUrl;
    if (goTo) {
      this.router.navigate([goTo]);
    } else {
      this.router.navigate(['/']);
    }
  }

  makeLoginTextError(error) {
    switch (error.status) {
      case 400:
        return 'No se han enviado el usuario o la contraseña';

      case 401:
        return 'El usuario o la contraseña son incorrectos';

      case 500:
        return 'El servidor no se encuentra disponible';

      default:
        return 'Ha ocurrido un error';
    }
  }

  storeAccessToken(res: HttpResponse<any>) {
    const accessToken = res.headers.get('Authorization')
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.loginEmitter.emit(false);
  }

  isLogged() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return !!token;
  }

  provideToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    switch (state.url) {
      case '/booking': {
        if (this.isLogged()) {
          return true;
        } else {
          this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
          return false;
        }
      }
      case '/login':
      case '/sign-up': {
        if (this.isLogged()) {
          this.router.navigate(['/welcome']);
          return false;
        } else {
          return true;
        }
      }
      default:
        return true;
    }
  }

}
