import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { ApiService, AuthService, SanitizeService } from '../../../services';

@Component({
  selector: 'app-route-board-user',
  templateUrl: './user.route.html',
  styleUrls: ['./user.route.scss']
})
export class BoardUserComponent implements OnDestroy, OnInit {

  public moment = moment;

  public breadcrumbs = [
    {
      text: 'Members',
      link: '/users'
    },
    {
      text: '',
      link: null
    },
  ];
  public userId = null;
  public user = null;
  public posts = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
    public sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params.id;
      this.getUser(this.userId).then((user) => {
        this.user = user;
        this.breadcrumbs[1].text = this.user.username;
      }).catch((err) => {
        this.router.navigate(['/error']);
      });
    });
  }

  public ngOnDestroy() { }

  public getUser(id) {
    let promise = new Promise((resolve, reject) => {
      let userSub = this.api.User.read(this.userId).subscribe(
        (user) => {
          resolve(user);
        },
        (err) => {
          reject(err);
        },
        () => {
          userSub.unsubscribe();
        }
      );
    });
    return promise;
  }
}
