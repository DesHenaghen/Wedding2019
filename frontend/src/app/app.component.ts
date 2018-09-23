import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router) {
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
