import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare let gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-125324127-1', {
          'page_path': event.urlAfterRedirects,
        });
      }
    });
  }
}
