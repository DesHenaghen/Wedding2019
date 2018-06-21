import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-save-the-date',
  templateUrl: './save-the-date.component.html',
  styleUrls: ['./save-the-date.component.css'],
  animations: [
    trigger('activeCard', [
      state('true', style({})),
      state('false',   style({
        transform: 'rotateY(-180deg)'
      })),
      transition('true => false', animate('100ms ease-in')),
      transition('false => true', animate('100ms ease-out'))
    ])
  ]
})
export class SaveTheDateComponent implements OnInit {

  constructor() { }

  public activeCard = true;

  ngOnInit() {
  }

  public toggleActiveCard() {
    this.activeCard = !this.activeCard;
  }

}
