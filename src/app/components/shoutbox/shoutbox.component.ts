import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ApiService, AuthService, SanitizeService } from '../../services';
import * as moment from 'moment';

@Component({
  selector: 'app-shoutbox',
  templateUrl: './shoutbox.component.html',
  styleUrls: ['./shoutbox.component.scss']
})
export class ShoutboxComponent implements OnInit, OnDestroy {

  public moment = moment;
  public shouts = [];
  public user = null;
  public authenticated = false;
  public shoutInput = '';

  private reloadInterval = 30 * 1000;
  private authSub: Subscription = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    this.authSub = this.auth.user$.subscribe((user) => {
      this.user = user;
      this.authenticated = !!user.id;
    });
    this.getShouts().then((shouts: any) => {
      this.shouts = shouts;
      setInterval(() => {
        this.getShouts().then((shouts: any) => {
          this.shouts = shouts;
        });
      }, 30000);
    });
  }

  public ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  public getShouts() {
    let promise = new Promise((resolve, reject) => {
      let shoutsSub = this.api.Shout.paged().subscribe(
        (shouts) => {
          resolve(shouts);
        },
        (err) => {
          reject(err);
        },
        () => {
          shoutsSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public clickShout() {
    let createSub = this.api.Shout.create({
      content: this.shoutInput
    }).subscribe(
      (shout) => {
        this.shoutInput = '';
        this.getShouts().then((shouts: any) => {
          this.shouts = shouts;
        });
      },
      (err) => {},
      () => {
        createSub.unsubscribe();
      }
    );
  }
}
