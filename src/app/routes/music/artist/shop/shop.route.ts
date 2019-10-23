import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { ApiService, SanitizeService } from '../../../../services';

@Component({
  'selector': 'app-route-artist-shop',
  'templateUrl': './shop.route.html',
  'styleUrls': ['./shop.route.scss']
})
export class ArtistShopComponent implements OnInit, OnDestroy {

  public artist = null;
  public shopUrl = null;

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Music',
      link: '/music',
    },
    {
      text: 'Artist',
      link: null
    },
    {
      text: 'Shop',
      link: null
    }
  ];

  private paramsSub: Subscription = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private sanitize: SanitizeService
  ) { }

  public ngOnInit() {
    this.paramsSub = this.route.params.subscribe((params) => {
      console.log(params);
      this.getArtist(params.slug).then((artist: any) => {
        this.artist = artist;
        this.shopUrl = this.sanitize.cleanSrc('https://shop.spreadshirt.com/' + this.artist.spreadshirt_shop_slug);
        this.breadcrumbs[2].text = this.artist.name;
        this.breadcrumbs[2].link = '/music/artist/' + this.artist.slug;
      });
    });
  }

  public ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  public getArtist(slug) {
    let promise = new Promise((resolve, reject) => {
      let artistSub = this.api.Artist.read(slug).subscribe(
        (artist) => {
          resolve(artist);
        },
        (err) => {
          reject(err);
        },
        () => {
          artistSub.unsubscribe();
        },
      );
    });
    return promise;
  }
}
