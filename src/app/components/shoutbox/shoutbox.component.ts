import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService, SanitizeService } from '../../services';

@Component({
  'selector': 'app-shoutbox',
  'templateUrl': './shoutbox.component.html',
  'styleUrls': ['./shoutbox.component.scss']
})
export class ShoutboxComponent implements OnDestroy, OnInit {

  public shoutInput = '';
  public createError = null;

  public shouts = [];
  public shoutsLoaded = false;

  constructor(
    private api: ApiService,
    private sanitize: SanitizeService,
  ) {}

  public ngOnInit() {
    this.getShouts(true).then((shouts: any) => {
      this.shouts = shouts.map((shout) => {
        return shout;
      });
    });
  }

  public ngOnDestroy() {}

  public getShouts(spinner) {
    if (spinner) {
      this.shoutsLoaded = false;
    }
    let promise = new Promise((resolve, reject) => {
      let shoutsSub = this.api.BoardShouts.list().subscribe(
        (shouts) => {
          if (spinner) {
            this.shoutsLoaded = true;
          }
          shouts = shouts.map((shout) => {
            shout.created = moment(shout.created);
            shout.modified = moment(shout.modified);
            shout.rendered_username = this.sanitized(shout.rendered_username);
            shout._content_rendered = this.sanitized(shout._content_rendered);
            return shout;
          });
          resolve(shouts);
        },
        (err) => {
          reject(err);
        },
        () => {
          shoutsSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public sendShout() {
    this.createError = null;
    let promise = new Promise((resolve, reject) => {
      let createSub = this.api.BoardShouts.create({
        content: this.shoutInput,
      }).subscribe(
        (shout) => {
          resolve(shout);
        },
        (err) => {
          reject(err);
        },
        () => {
          createSub.unsubscribe();
        },
      );
    });
    promise.then(() => {
      this.getShouts(false).then((shouts: any) => {
        this.shouts = shouts;
      });
    }).catch((err) => {
      if (err.error.notAllowed) {
        this.createError = err.error.notAllowed;
      } else {
        this.createError = 'Error sending shout';
      }
      console.log(err);
    });
  }

  public sanitized(str) {
    return this.sanitize.cleanHtml(str);
  }
}
