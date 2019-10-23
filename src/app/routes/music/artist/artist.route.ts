import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { ApiService, SanitizeService } from '../../../services';

@Component({
  'selector': 'app-route-artist',
  'templateUrl': './artist.route.html',
  'styleUrls': ['./artist.route.scss']
})
export class ArtistComponent implements OnInit, OnDestroy {

  public playsCanvasRef: any;

  public moment = moment;

  public artist = null;
  public albums = [];
  public albumsLoaded = false;
  public events = [];
  public eventsLoaded = false;
  public upcomingEvents = [];
  public pastEvents = [];

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
      this.getArtist(params.slug).then((artist: any) => {
        this.artist = artist;
        this.breadcrumbs[2].text = this.artist.name;
        this.getArtistAlbums(this.artist.id).then((albums: any) => {
          this.albums = albums.map((album) => {
            album.release_date = moment(album.release_date);
            return album;
          });
        });
        this.getArtistEvents(this.artist.id).then((events: any) => {
          this.events = events.map((event) => {
            event.event_date = moment(event.event_date);
            return event;
          });
          this.upcomingEvents = events.filter((event) => {
            return moment().isBefore(moment(event.event_date));
          });
          this.pastEvents = events.filter((event) => {
            return moment().isAfter(moment(event.event_date));
          });
        });
        this.initCanvas();
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

  public getArtistAlbums(artistId) {
    this.albumsLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let albumsSub = this.api.Album.list({
        artist_id: artistId
      }).subscribe(
        (events) => {
          this.albumsLoaded = true;
          resolve(events);
        },
        (err) => {
          reject(err);
        },
        () => {
          albumsSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public getArtistEvents(artistId) {
    this.eventsLoaded = false;
    let promise = new Promise((resolve, reject) => {
      let eventsSub = this.api.ArtistEvent.list({
        artist_id: artistId
      }).subscribe(
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

  public initCanvas() {
    let playsLabels = this.artist.plays_this_week.slice(0).reverse().map((date) => {
      return date.date;
    });
    let playsData = this.artist.plays_this_week.slice(0).reverse().map((date) => {
      return date.plays;
    });
    this.playsCanvasRef = {
      type: 'bar',
      data: {
        labels: playsLabels,
        datasets: [{
          label: 'Song Plays By Day',
          data: playsData,
          backgroundColor: '#6741d9',
          borderColor: '#6741d9',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            }
          }]
        }
      }
    };
  }

  public artistBio(artist) {
    return this.sanitize.cleanHtml(this.artist._bio_rendered);
  }

  public routeToAlbum(album) {
    this.router.navigate(['/music', 'album', album.slug]);
  }

  public routeToEvent(event) {
    this.router.navigate(['/music', 'event', event.slug]);
  }

  public routeToShop() {
    this.router.navigate(['/music', 'artist', this.artist.slug, 'shop']);
  }
}
