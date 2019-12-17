import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserRestService {
  private baseUrl = 'http://fenw.etsisi.upm.es:10000';

  constructor(private http: HttpClient) {
  }

  checkUserName(userName: string) {
    return this.http.get(this.baseUrl + `/users/${userName}`,
      {observe: 'response'});
  }

  handleResponse(response) {
    switch (response.status) {
      case 200: {
        return {error: true, duplicated: true};
      }
      case 500: {
        return {error: true, serverError: true};
      }
      default:
        return null;
    }
  }


}
