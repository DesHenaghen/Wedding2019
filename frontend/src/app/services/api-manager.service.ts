import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Guest} from "../models/guest";
import {PlusOne} from "../models/plusOne";

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {

  constructor(
    private http: HttpClient) { }

  public getGuests() {
    return this.http.get('api/guests');
  }

  public addGuest(guest: Guest) {
    return this.http.post('api/addGuest', {guest});
  }

  public removeGuest(id: number) {
    return this.http.post('api/removeGuest', {id});
  }

  public updateGuest(guest: Guest) {
    return this.http.post('api/updateGuest', {guest});
  }

  public emailGuest(email: String) {
    return this.http.post('api/emailGuest', {email});
  }

  public emailAll() {
    return this.http.get('api/emailAll');
  }

  public sendSTD(guest: Guest, plusOne: PlusOne) {
    return this.http.post('api/sendSTD', {guest, plusOne});
  }

  public guestExists(name: any) {
    return this.http.post('api/guestExists', {guest: name});
  }
}
