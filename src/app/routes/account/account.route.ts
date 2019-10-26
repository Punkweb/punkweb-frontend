import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService, ApiService } from '../../services';

@Component({
  selector: 'app-route-account',
  templateUrl: './account.route.html',
  styleUrls: ['./account.route.scss']
})
export class AccountComponent implements OnDestroy, OnInit {

  public user = null;

  public userSub = null;

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Account',
      link: null,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
  ) { }

  public ngOnInit() {
    this.auth.user$.subscribe(
      (user) => {
        if (!user) {
          return;
        }
        this.user = user;
        this.getManagedArtists(this.user).then((artists) => {
          console.log(artists);
        });
        console.log(this.user);
      },
      (err) => {
        this.router.navigate(['/error']);
      },
      () => {},
    );
  }

  public ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  public getManagedArtists(user) {
    let promise = new Promise((resolve, reject) => {
      let artists = [];
      for (let i = 0; i < user.manager_for.length; i++) {
        this.api.Artist.read(user.manager_for[i]).subscribe(
          (artist) => {
            artists.push(artist);
          },
          (err) => {
            console.log('Failed to fetch artist:', user.manager_for[i]);
          },
          () => {
            if (i === (user.manager_for.length - 1)) {
              resolve(artists);
            }
          },
        );
      }
    });
    return promise;
  }
}
