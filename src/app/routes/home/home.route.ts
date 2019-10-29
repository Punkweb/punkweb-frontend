import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService, AuthService } from '../../services';

@Component({
  selector: 'app-route-home',
  templateUrl: './home.route.html',
  styleUrls: ['./home.route.scss']
})
export class HomeComponent implements OnDestroy, OnInit {

  public user = null;
  public artists = [];

  public contactInfo = '';
  public subject = '';
  public body = '';

  public contactSuccess = null;
  public contactError = null;

  private authSub: Subscription = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
  ) { }

  public ngOnInit() {
    this.authSub = this.auth.user$.subscribe((user) => {
      if (!user) {
        return;
      }
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

  public sendDisabled() {
    return !this.contactInfo || !this.subject || !this.body;
  }

  public sendContactForm() {
    if (this.sendDisabled()) {
      return;
    }
    let promise = new Promise((resolve, reject) => {
      let contactSub = this.api.ContactForms.create({
        contact_info: this.contactInfo,
        subject: this.subject,
        body: this.body,
      }).subscribe(
        (created) => {
          this.contactInfo = '';
          this.subject = '';
          this.body = '';
          resolve(created);
        },
        (err) => {
          reject(err);
        },
        () => {
          contactSub.unsubscribe();
        },
      );
    });
    return promise.then((created) => {
      this.contactSuccess = `Thanks for reaching out.  If an email was provided we'll get back to you soon.`;
    }).catch((err) => {
      this.contactError = `There was an error submitting your contact form.  Try again later.`;
    });
  }

  public routeToSystemLynx() {
    this.router.navigate(['/music', 'artist', 'system-lynx']);
  }
}
