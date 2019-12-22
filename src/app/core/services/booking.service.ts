import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {AuthRestService} from './auth.service';
import {BookingModel} from '../models/booking.model';
import { Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BookingRestService {
  private baseUrl = environment.url_api;

  constructor(private http: HttpClient, private authService: AuthRestService, private router: Router) {
  }

  private makeHeaders() {
    const accessToken = this.authService.provideToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', accessToken);
    return headers;
  }

  getBookingsByUser() {
    const headers = this.makeHeaders();
    return this.http.get(this.baseUrl + '/reservations', {headers, observe: 'response'})
      ;
  }

  getBookingList(time: number) {
    const headers = this.makeHeaders();
    return this.http.get(this.baseUrl + '/reservations/' + time, {headers, observe: 'response'});
  }

  postNewBooking(newBooking: BookingModel) {
    const headers = this.makeHeaders();

    return this.http.post(this.baseUrl + '/reservations', newBooking, {headers, observe: 'response'});
  }

  removeBooking(rsvId: number) {
    const headers = this.makeHeaders();
    return this.http.delete(this.baseUrl + '/reservations/' + rsvId, {headers});
  }

  /*
   * This methos returns other status number because of ant-design result component needs
   */
  makeBookingTextError(error) {
    switch (error.status) {
      case 400:
        return {description: 'Pista u hora seleccionados no válidos', status: '404'};

      case 401:
        return {description: 'Intente volver a iniciar sesión', status: '403'};

      case 409:
        return {description: 'Ya ha alcanzado el máximo número de reservas', status: '403'};

      case 500:
        return {description: 'El servidor no se encuentra disponible', status: '500'};

      default:
        return {description: 'Ha ocurrido un error', status: '500'};
    }
  }

  processResponse(res: HttpResponse<any>): [BookingModel] {
    const goTo = '/booking';
    console.log({goTo});
    switch (res.status) {
      case 200: {
        this.authService.storeAccessToken(res);
        return res.body;
      }
      default: {
        this.authService.logout();
        this.router.navigate(['/login'], {queryParams: {returnUrl: goTo}});
        return;
      }
    }
  }
}
