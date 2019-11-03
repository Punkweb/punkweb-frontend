import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from '../../../services';

@Component({
  selector: 'app-route-event',
  templateUrl: './event.route.html',
  styleUrls: ['./event.route.scss']
})
export class EventComponent implements OnDestroy, OnInit {

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
      link: null,
    },
    {
      text: 'Event',
      link: null,
    }
  ];

  public event = null;
  public eventLoaded = false;

  private paramsSub = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) { }

  public ngOnInit() {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.getEvent(params.slug).then((event: any) => {
        event.event_date = moment(event.event_date);
        this.event = event;
        this.breadcrumbs[2].text = this.event.artist_name;
        this.breadcrumbs[2].link = '/music/artist/' + this.event.artist_slug;
      });
    });
  }

  public ngOnDestroy() { }

  public getEvent(slug) {
    this.eventLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let eventSub = this.api.ArtistEvent.read(slug).subscribe(
        (event) => {
          this.eventLoaded = true;
          resolve(event);
        },
        (err) => {
          reject(err);
        },
        () => {
          eventSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public routeToArtist(artist_slug) {
    this.router.navigate(['/music', 'artist', artist_slug]);
  }
}
