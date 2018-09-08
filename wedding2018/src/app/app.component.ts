import { Component } from '@angular/core';
import {NgsRevealConfig} from 'ng-scrollreveal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(config: NgsRevealConfig) {
    // customize default values of ng-scrollreveal directives used by this component tree
    config.duration = 500;
    config.easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
  }

  scrollToBlock(id: String): void {
    const element = document.querySelector('#' + id);
    if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
}
