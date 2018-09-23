import { Component, OnInit } from '@angular/core';
declare var simplyCountdown: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    const d = new Date('2019-06-16T12:00:00-00:00');

    console.log(d);

    simplyCountdown('.simply-countdown-one', {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hours: d.getHours()
    });
  }


  scrollToBlock(id: String, mobile: boolean= false): void {
    if (mobile) { document.getElementById('nav-toggle').click(); }
    const element = document.querySelector('#' + id);
    if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

}
