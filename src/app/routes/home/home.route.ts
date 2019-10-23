import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Meta } from '@angular/platform-browser';
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

  public contactInfo = '';
  public subject = '';
  public body = '';

  public contactSuccess = null;
  public contactError = null;

  private authSub: Subscription = null;

  constructor(
    private meta: Meta,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
  ) {
    this.meta.addTags([
      { property: 'og:title', content: 'Punkweb' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://www.punkweb.net' },
      { property: 'og:image', content: 'http://www.punkweb.net/assets/img/mic-and-interface.jpg' },
      { property: 'og:image:secure_url', content: 'https://www.punkweb.net/assets/img/mic-and-interface.jpg' },
      { property: 'og:image:width', content: '480' },
      { property: 'og:image:height', content: '270' },
      { property: 'og:description', content: 'A music release platform for amatuer musicians and producers', },
      { name: 'twitter:card', content: 'summary', },
      { name: 'twitter:title', content: 'Punkweb', },
      { name: 'twitter:description', content: 'A music release platform for amatuer musicians and producers', },
      { name: 'twitter:image', content: 'https://www.punkweb.net/assets/img/mic-and-interface.jpg', },
    ]);
  }

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
