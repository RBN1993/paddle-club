import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthModel} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})

export class AuthRestService {
  private baseUrl = 'http://fenw.etsisi.upm.es:10000';

  constructor(private http: HttpClient) {
  }

  login(loginForm: AuthModel) {
    const {userName, password} = loginForm;

    return this.http.get(this.baseUrl + '/users/login?' + `username=${userName}&password=${password}`,
      {observe: 'response'});
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

  storeAccessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
  }

  logout() {
    localStorage.removeItem('access_token');

  }


}
