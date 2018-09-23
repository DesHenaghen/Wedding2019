import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TravelComponent implements OnInit {

  latCentre: number = 55.719947;
  lngCentre: number = -3.758888;

  latVenue: number = 55.466969;
  lngVenue: number = -4.616384;

  latHome: number = 55.773555;
  lngHome: number = -4.042126;

  latPrestwickAirport: number = 55.510191;
  lngPrestwickAirport: number = -4.611610;

  latGlasgowAirport: number = 55.868763;
  lngGlasgowAirport: number = -4.433336;

  latEdinburghAirport: number = 55.952016;
  lngEdinburghAirport: number = -3.361421;

  venueIcon = {
    url: '../../assets/images/venueMarker.png',
    scaledSize: {
      width: 40,
      height: 53
    }
  };
  airportIcon = {
    url: '../../assets/images/airportMarker.png',
    scaledSize: {
      width: 40,
      height: 53
    }
  };
  homeIcon = {
    url: '../../assets/images/homeMarker.png',
    scaledSize: {
      width: 40,
      height: 53
    }
  };

  ngOnInit() {
  }

}
