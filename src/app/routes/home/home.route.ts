import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ApiService, AuthService } from '../../services';

@Component({
  selector: 'app-route-home',
  templateUrl: './home.route.html',
  styleUrls: ['./home.route.scss']
})
export class HomeComponent implements OnDestroy, OnInit {

  public user = null;
  public artists = [];

  private authSub: Subscription = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
  ) { }

  public ngOnInit() {
    this.authSub = this.auth.user$.subscribe((user) => {
      this.user = user;
    });
    let artistsSub = this.api.Artist.list().subscribe(
      (artists) => {
        this.artists = artists;
      },
      (err) => {},
      () => {
        artistsSub.unsubscribe();
      },
    );
  }

  public ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
