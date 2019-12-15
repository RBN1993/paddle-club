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





}
