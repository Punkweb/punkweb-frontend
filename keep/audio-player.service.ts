import { Injectable, isDevMode } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

declare var window: any;

@Injectable()
export class AudioPlayerService {

  public user = null;

  public instance: any = null;
  public audioCtx: any = null;
  public audioSrc: any = null;
  public audioAnalyser: any = null;
  public bufferLength = null;
  public dataArray = null;
  public events = [];
  public playTimeouts = [];

  public history = [];

  private AudioContext = null;
  private _playQueue = [];
  private _currentTime = 0;
  private _duration = 0;
  private _trackPercent = 0;

  constructor(
    private title: Title,
    private meta: Meta,
    private api: ApiService,
    private auth: AuthService,
  ) {
    if (window.AudioContext) {
      this.AudioContext = window.AudioContext;
    } else if (window.webkitAudioContext) {
      this.AudioContext = window.webkitAudioContext;
    } else {
      this.AudioContext = null;
    }
    this.auth.user$.subscribe((user) => {
      if (!user) {
        return;
      }
      this.user = user;
    });
    // this.createAudio();
  }

  public play() {
    this.instance.play();
    if (!isDevMode()) {
      this.addPlayTimeout(this._playQueue[0]);
    }
  }

  public pause() {
    this.instance.pause();
    if (!isDevMode()) {
      this.clearPlayTimeouts();
    }
  }

  public stop() {
    this.instance.pause();
    if (!isDevMode()) {
      this.clearPlayTimeouts();
    }
  }

  public mute() {
    this.instance.muted = true;
  }

  public setTime(time: number) {
    this.instance.currentTime = time;
  }

  public setVolume(volume: number) {
    this.instance.volume = volume;
  }

  public isMuted() {
    return this.instance.muted;
  }

  public get playQueue() {
    return this._playQueue;
  }

  public set playQueue(value) {
    this._playQueue = value;
    this.load(this._playQueue[0].file);
  }

  public get currentTime() {
    return this._currentTime;
  }

  public get duration() {
    return this._duration;
  }

  public get trackPercent() {
    return this._trackPercent;
  }

  public get paused() {
    return this.instance.paused;
  }

  public get volume() {
    return this.instance.volume;
  }

  public back() {
    if (this.history.length < 1) {
      return;
    }
    this.playQueue.unshift(this.history.pop());
    this.load(this._playQueue[0].file);
  }

  public next() {
    this.history.push(this._playQueue[0]);
    this._playQueue.shift();
    if (this._playQueue.length > 0) {
      this.load(this._playQueue[0].file);
    } else {
      this.destroyAudio();
    }
  }

  public load(url) {
    this.createAudio();
    this.instance.src = url;
    this.instance.load();
    this.title.setTitle(`Punkweb | ${this._playQueue[0].title}`);
  }

  public addPlayTimeout(song: any) {
    let timeout = setTimeout(() => {
      let metadata: any = {
        song_id: song.id,
        song_length: song.duration,
        user_id: null,
        user_is_staff: false,
      };
      if (this.user) {
        metadata.user_id = this.user.id;
        if (this.user.is_staff || this.user.is_superuser) {
          metadata.user_is_staff = true;
        }
      }
      let analyticsSub = this.api.AnalyticsEvent.create({
        category: 'music_engagement',
        action: '30_second_song_play',
        label: `${song.artist_name}: ${song.title}`,
        metadata: metadata,
      }).subscribe(
        () => {},
        () => {},
        () => {
          analyticsSub.unsubscribe();
      });
    }, song.duration < 31 ? song.duration * 1000 : 30000);
    this.playTimeouts.push(timeout);
  }

  public clearPlayTimeouts() {
    this.playTimeouts.forEach((id) => {
      clearTimeout(id);
    });
  }

  public createAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new this.AudioContext();
    } else {
      this.audioCtx.resume();
    }
    if (!this.instance) {
      this.instance = new Audio();
      this.instance.crossOrigin = 'anonymous';
      this.instance.preload = 'metadata';
      this.bind('canplaythrough', () => {
        this.play();
        if (!isDevMode()) {
          this.clearPlayTimeouts();
          this.addPlayTimeout(this._playQueue[0]);
        }
      });
      this.bind('ended', () => {
        if (!isDevMode()) {
          let metadata: any = {
            song_id: this._playQueue[0].id,
            song_length: this._duration,
            user_id: null,
            user_is_staff: false,
          };
          if (this.user) {
            metadata.user_id = this.user.id;
            if (this.user.is_staff || this.user.is_superuser) {
              metadata.user_is_staff = true;
            }
          }
          let songFinished = this.api.AnalyticsEvent.create({
            category: 'music_engagement',
            action: 'finished_song',
            label: `${this._playQueue[0].artist_name}: ${this._playQueue[0].title}`,
            metadata: metadata,
          }).subscribe(
            () => {},
            () => {},
            () => {
            songFinished.unsubscribe();
          });
        }
        this.history.push(this.playQueue[0]);
        this._playQueue.shift();
        if (this._playQueue.length > 0) {
          this.load(this._playQueue[0].file);
        } else {
          this.destroyAudio();
        }
      });
      this.bind('timeupdate', () => {
        if (!this.instance) {
          return;
        }
        this._currentTime = this.instance.currentTime;
        this._duration = this.instance.duration;
        this._trackPercent = ((this._currentTime / this._duration)  * 100);
      });
    }
    if (!this.audioSrc) {
      try {
        this.audioSrc = this.audioCtx.createMediaElementSource(this.instance);
      } catch (e) {
        this.audioSrc = null;
        console.log('Failed to init audio source');
      }
      try {
        this.audioSrc.connect(this.audioCtx.destination);
      } catch (e) {
        console.log('Failed to connect audio source');
      }
      // try {
      //   this.audioAnalyser = this.audioCtx.createAnalyser();
      // } catch (e) {
      //   this.audioAnalyser = null;
      //   console.log('No audio analyser');
      // }
      // if (this.audioAnalyser) {
      //   try {
      //     this.bufferLength = this.audioAnalyser.frequencyBinCount;
      //     this.dataArray = new Uint8Array(this.bufferLength);
      //     this.audioSrc.connect(this.audioAnalyser);
      //     this.audioAnalyser.fftSize = 32;
      //   } catch (e) {
      //     console.log('Failed to init audio analyser');
      //   }
      // }
    }
  }

  public destroyAudio() {
    if (this.instance) {
      this.pause();
      this.title.setTitle(`Punkweb`);
      this.clearPlayTimeouts();
    }
  }

  public bind(eventName, eventCallback) {
    this.events.push({
      name: eventName,
      callback: eventCallback,
    });
    this.instance.addEventListener(eventName, eventCallback);
  }
}
