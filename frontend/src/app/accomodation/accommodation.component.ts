import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalService} from '../services';

export interface RoomDetails {
  room: String,
  standardPrice: String,
  breakfastPrice: String
}

@Component({
  selector: 'app-accomodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccommodationComponent implements OnInit {

  public columnsToDisplay = ['room', 'standardPrice', 'breakfastPrice'];

  public roomRates: RoomDetails[] = [
    {room: 'Standard Double/Twin Room within Western \n' +
      'House Courtyard', standardPrice: '£85', breakfastPrice: '£100'},
    {room: 'Standard Family Room within Western House ' +
      'Courtyard - Sleeps 3', standardPrice: '£105', breakfastPrice: '£127.50'},
    {room: 'Standard Family Room within Western House ' +
      'Courtyard - Sleeps 4', standardPrice: '£125', breakfastPrice: '£155'},
    {room: 'Executive Double/Twin Room within Western ' +
      'House (Based on 2 guests sharing)', standardPrice: '£150', breakfastPrice: '£165'},
    {room: 'Executive Double/Twin Room within Western ' +
      'House (Based on 2 guests sharing)', standardPrice: '£165', breakfastPrice: '£180'},
    {room: 'Executive Junior Suite within Western House' +
      ' (Based on 2 guests sharing)', standardPrice: '£175', breakfastPrice: '£190'}
    ];

  constructor(
    private modalService: ModalService) { }

  ngOnInit() {
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}
