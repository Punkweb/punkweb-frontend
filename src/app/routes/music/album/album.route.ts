import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { ModalService } from '../../../modules/modals';
import { ApiService, AudioPlayerService } from '../../../services';
import { SongLyricsModalComponent } from '../../../components';

@Component({
  'selector': 'app-route-album',
  'templateUrl': './album.route.html',
  'styleUrls': ['./album.route.scss']
})
export class AlbumComponent implements OnInit, OnDestroy {

  public moment = moment;

  public album = null;
  public releaseDate = null;
  public artist = null;
  public tracks = [];

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Music',
      link: '/music'
    },
    {
      text: 'Artist',
      link: '/music/artist/'
    },
    {
      text: 'Album',
      link: null
    }
  ];

  private paramsSub: Subscription = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modals: ModalService,
    public audio: AudioPlayerService,
    private api: ApiService,
  ) { }

  public ngOnInit() {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.getAlbum(params.slug).then((album: any) => {
        this.album = album;
        this.releaseDate = moment(album.release_date);
        this.breadcrumbs[3].text = this.album.title;
        this.getArtist(this.album.artist_slug).then((artist: any) => {
          this.artist = artist;
          this.breadcrumbs[2].text = this.artist.name;
          this.breadcrumbs[2].link = '/music/artist/' + this.artist.slug;
        });
        this.getTracks(this.album.id).then((tracks: any) => {
          this.tracks = tracks;
        });
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

  public getAlbum(slug) {
    let promise = new Promise((resolve, reject) => {
      let albumSub = this.api.Album.read(slug).subscribe(
        (album) => {
          resolve(album);
        },
        (err) => {
          reject(err);
        },
        () => {
          albumSub.unsubscribe();
        },
      );
    });
    return promise;
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

  public getTracks(albumId) {
    let promise = new Promise((resolve, reject) => {
      let tracksSub = this.api.Audio.list({
        album_id: albumId
      }).subscribe(
        (tracks) => {
          resolve(tracks);
        },
        (err) => {
          reject(err);
        },
        () => {
          tracksSub.unsubscribe();
        },
      );
    });
    return promise;
  }

  public routeToArtist(artist) {
    this.router.navigate(['/music', 'artist', artist.slug]);
  }

  public isCurrentSong(track) {
    if (!this.audio || !this.audio.playQueue || this.audio.playQueue.length < 1) {
      return;
    }
    return this.audio.playQueue[0].id === track.id;
  }

  public clickSong(index) {
    this.audio.playQueue = this.tracks.slice(index);
    this.router.navigate(['/music', 'visualizer']);
  }

  public clickSongLyrics(song) {
    this.modals.open(SongLyricsModalComponent, {
      data: {
        song,
      },
      position: {
        top: '2rem'
      },
      width: '640px',
    });
  }

  public totalDuration() {
    let reduced = this.tracks.map((obj) => obj.duration).reduce((a, b) => a + b);
    return this.displayMins(reduced);
  }

  public display(seconds) {
    const format = val => `0${Math.floor(val)}`.slice(-2);
    const minutes = seconds / 60;
    return [minutes, seconds % 60].map(format).join(':');
  }

  public displayMins(seconds) {
    const minutes = Math.floor(seconds / 60);
    return minutes;
  }
}
