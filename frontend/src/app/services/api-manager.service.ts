import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Guest} from "../models/guest";
import {PlusOne} from "../models/plusOne";
import {MenuChoice} from "../models";

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

  public emailGuestRSVPResponse(email: String) {
    return this.http.post('api/emailGuestRSVPResponse', {email});
  }

  public emailAll() {
    return this.http.get('api/emailAll');
  }

  public sendSTD(guest: Guest, plusOne: PlusOne) {
    return this.http.post('api/sendSTD', {guest, plusOne});
  }

  public guestExists(guest: Guest) {
    return this.http.post('api/guestExists', {guest});
  }

  public emailGuestSTDResponse(email: String) {
    return this.http.post('api/emailGuestSTDResponse', {email});
  }

  public getGuest(id: any) {
    return this.http.get('api/guest', {params: {id}});
  }

  public getPlusOne(id: any) {
    return this.http.get('api/plusOne', {params: {id}});
  }

  public sendInvite(url: string, name: string, email: string, ceremony: boolean) {
    return this.http.post('api/sendInvite', {url, name, email, ceremony})
  }

  public sendYahooInvite(url: string, name: string, email: string, ceremony: boolean) {
    return this.http.post('api/sendYahooInvite', {url, name, email, ceremony})
  }

  public submitInviteResponse(guest: any, attending: number, menuChoice: MenuChoice) {
    return this.http.post('api/submitInviteResponse', {guest, attending, menuChoice});
  }
}
