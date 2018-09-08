import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {

  constructor(
    private http: HttpClient) { }

  public getGuests() {
    return this.http.get('api/guests');
  }

  public addGuest(guest) {
    return this.http.post('api/addGuest', {guest});
  }

  public removeGuest(id: number) {
    return this.http.post('api/removeGuest', {id});
  }

  public updateGuest(guest) {
    return this.http.post('api/updateGuest', {guest});
  }

  public emailGuest(email) {
    return this.http.post('api/emailGuest', {email});
  }

  public emailAll() {
    return this.http.get('api/emailAll');
  }

  public sendSTD(guest, plusOne) {
    return this.http.post('api/sendSTD', {guest, plusOne});
  }
}
