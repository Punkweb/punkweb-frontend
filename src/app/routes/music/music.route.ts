import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ApiService } from '../../services';

@Component({
  selector: 'app-route-music',
  templateUrl: './music.route.html',
  styleUrls: ['./music.route.scss']
})
export class MusicComponent implements OnDestroy, OnInit {

  public latestReleases = [];
  public latestReleasesLoaded = false;
  public artists = [];
  public artistsLoaded = false;
  public eventsThisWeek = [];
  public eventsLoaded = false;

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Music',
      link: null
    }
  ];

  constructor(
    private router: Router,
    private api: ApiService,
  ) { }

  public ngOnInit() {
    this.getLatestReleases().then((latestReleases: any) => {
      this.latestReleases = latestReleases.map((album) => {
        album.release_date = moment(album.release_date);
        return album;
      });
    });
    this.getArtists().then((artists: any) => {
      this.artists = artists;
    });
    this.getEventsThisWeek().then((events: any) => {
      this.eventsThisWeek = events.map((event) => {
        event.event_date = moment(event.event_date);
        return event;
      });
    });
  }

  public ngOnDestroy() { }

  public getLatestReleases() {
    this.latestReleasesLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let latestReleasesSub = this.api.Album.listRoute('get', 'latest_releases', {}, {}).subscribe(
        (latestReleases) => {
          this.latestReleasesLoaded = true;
          resolve(latestReleases);
        },
        (err) => {
          reject(err);
        },
        () => {
          latestReleasesSub.unsubscribe();
        }
      );
    });
    return promise;
  }

  public getArtists() {
    this.artistsLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let artistsSub = this.api.Artist.list().subscribe(
        (artists) => {
          this.artistsLoaded = true;
          resolve(artists);
        },
        (err) => {
          reject(err);
        },
        () => {
          artistsSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public getEventsThisWeek() {
    this.eventsLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let eventsSub = this.api.ArtistEvent.listRoute('get', 'this_week', {}, {}).subscribe(
        (events) => {
          this.eventsLoaded = true;
          resolve(events);
        },
        (err) => {
          reject(err);
        },
        () => {
          eventsSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public routeToArtist(artist) {
    this.router.navigate(['/music', 'artist', artist.slug]);
  }

  public routeToAlbum(album) {
    this.router.navigate(['/music', 'album', album.slug]);
  }
}
