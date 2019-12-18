import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthRestService} from './auth.service';
import {BookingModel} from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})

export class BookingRestService {
  private baseUrl = 'http://fenw.etsisi.upm.es:10000';

  constructor(private http: HttpClient, private authService: AuthRestService) {
  }

  private getHeaders() {
    const accessToken = this.authService.provideToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', accessToken);
    return headers;
  }

  getBookingsByUser() {
    const headers = this.getHeaders();
    return this.http.get(this.baseUrl + '/reservations', {headers});
  }

  getBookingList(time: number) {
    const headers = this.getHeaders();
    return this.http.get(this.baseUrl + '/reservations/' + time, {headers});
  }

  postNewBooking(newBooking: BookingModel) {
    const headers = this.getHeaders();

    return this.http.post(this.baseUrl + '/reservations', newBooking, {headers});
  }


}
