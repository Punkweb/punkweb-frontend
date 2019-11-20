import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ModalService } from '../../../modules/modals';
import { ApiService, AudioPlayerService, SanitizeService } from '../../../services';

@Component({
  'selector': 'app-route-artist',
  'templateUrl': './artist.route.html',
  'styleUrls': ['./artist.route.scss']
})
export class ArtistComponent implements OnInit, OnDestroy {

  public playsCanvasRef: any;

  public moment = moment;

  public artist = null;
  public totalPlaysThisWeek = 0;
  public shopUrl = null;
  public top10 = [];
  public top10Shown = [];
  public top10Loaded = false;
  public albums = [];
  public albumsLoaded = false;
  public events = [];
  public eventsLoaded = false;
  public upcomingEvents = [];
  public pastEvents = [];

  public selectedTab = 'music';
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
    private modals: ModalService,
    private api: ApiService,
    private audio: AudioPlayerService,
    private sanitize: SanitizeService
  ) { }

  public ngOnInit() {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.getArtist(params.slug).then((artist: any) => {
        this.artist = artist;
        if (this.artist.plays_this_week && this.artist.plays_this_week.length > 0) {
          this.totalPlaysThisWeek = this.artist.plays_this_week.map(
            (obj) => {
              return obj.plays;
            }
          ).reduce((a, b) => {
            return a + b;
          });
        } else {
          this.totalPlaysThisWeek = 0;
        }
        this.shopUrl = this.artist.spreadshirt_shop_slug ?
          this.sanitize.cleanSrc('https://shop.spreadshirt.com/' + this.artist.spreadshirt_shop_slug) : null;
        this.breadcrumbs[2].text = this.artist.name;
        this.getTop10Songs(this.artist.slug).then((topSongs: any) => {
          this.top10 = topSongs;
          this.top10Shown = this.top10.slice(0, 5);
        });
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
      }).catch((err) => {
        this.router.navigate(['/error']);
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

  public getTop10Songs(slug) {
    this.top10Loaded = false;
    let promise = new Promise((resolve, reject) => {
      let topSongsSub = this.api.Artist.detailRoute('get', 'top_10', slug).subscribe(
        (topSongs) => {
          this.top10Loaded = true;
          resolve(topSongs);
        },
        (err) => {
          reject(err);
        },
        () => {
          topSongsSub.unsubscribe();
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
    let playsLabels;
    let playsData;
    if (this.artist.plays_this_week && this.artist.plays_this_week.length > 0) {
      playsLabels = Array(7).fill('').map((val, idx) => {
        return moment().subtract(idx, 'days').format('YYYY-MM-DD');
      }).reverse();
      playsData = Array(7).fill(0);
      this.artist.plays_this_week.forEach((playsOnDate) => {
        playsData[playsLabels.indexOf(playsOnDate.date)] = playsOnDate.plays;
      });
    } else {
      playsLabels = [];
      playsData = [];
    }
    this.playsCanvasRef = {
      type: 'bar',
      data: {
        labels: playsLabels,
        datasets: [{
          label: 'Song Plays By Day',
          data: playsData,
          backgroundColor: '#c92a2a',
          borderColor: '#c92a2a',
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          labels: {
            fontColor: 'white'
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: 'white',
              },
              pointLabels: {
                fontColor: 'white',
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.2)'
              },
              angleLines: {
                color: 'white'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: 'white',
                stepSize: 100,
              },
              pointLabels: {
                fontColor: 'white'
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.2)'
              },
              angleLines: {
                color: 'white'
              }
            }
          ]
        }
      }
    };
  }

  public isCurrentSong(track) {
    if (!this.audio || !this.audio.playQueue || this.audio.playQueue.length < 1) {
      return;
    }
    return this.audio.playQueue[0].id === track.id;
  }

  public displaySongPlays(plays) {
    if (plays < 100) {
      return '< 100';
    } else {
      return plays;
    }
  }

  public showMoreButton() {
    return this.top10Shown.length <= 5 && this.top10.length !== 5 && this.top10Shown.length !== this.top10.length;
  }

  public showLessButton() {
    return this.top10Shown.length > 5;
  }

  public clickShowMore() {
    this.top10Shown = this.top10;
  }

  public clickShowLess() {
    this.top10Shown = this.top10.slice(0, 5);
  }

  public artistBio() {
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

  public clickMainPlay() {
    if (!this.top10) {
      return;
    }
    this.audio.playQueue = this.top10.slice(0);
  }

  public clickTop10Song(index) {
    this.audio.playQueue = this.top10.slice(index);
  }
}
