import { Component } from '@angular/core';
import {NgsRevealConfig} from 'ng-scrollreveal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(config: NgsRevealConfig, private router: Router) {
    // customize default values of ng-scrollreveal directives used by this component tree
    config.duration = 500;
    config.easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
  }

  scrollToBlock(id: String, mobile: boolean= false): void {
    if (this.router.url !== '/') { this.navigateToMainPage(id); }

    if (mobile) { document.getElementById('nav-toggle').click(); }
    const element = document.querySelector('#' + id);
    if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  private navigateToMainPage(id: String): void {
    this.router.navigateByUrl('/');
  }
}
