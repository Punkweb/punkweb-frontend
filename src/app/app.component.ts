import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

declare let gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private routerSub: Subscription;
  private dataSub: Subscription;

  constructor(
    private router: Router,
    private title: Title,
  ) {
  }

  public ngOnInit() {
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-125324127-1', {
          'page_path': event.urlAfterRedirects,
        });
      }
    });
  }

  public ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }

  private setTitle(titleArg: string) {
    let title = 'Punkweb';
    if (titleArg) {
      title += ` | ${titleArg}`;
    }
    this.title.setTitle(title);
  }
}
