import { Injectable, isDevMode } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService } from './api.service';

declare var window: any;

@Injectable()
export class AudioPlayerService {

  public instance: any = null;
  public audioCtx: any = null;
  public audioSrc: any = null;
  public audioAnalyser: any = null;
  public bufferLength = null;
  public dataArray = null;
  public events = [];

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
  ) {
    if (window.AudioContext) {
      this.AudioContext = window.AudioContext;
    } else if (window.webkitAudioContext) {
      this.AudioContext = window.webkitAudioContext;
    } else {
      this.AudioContext = null;
    }
    this.audioCtx = new this.AudioContext();
  }

  public play() {
    this.instance.play();
  }

  public pause() {
    this.instance.pause();
  }

  public stop() {
    this.instance.pause();
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

  public createAudio() {
    if (!this.instance) {
      this.instance = new Audio();
      this.instance.crossOrigin = 'anonymous';
      this.instance.preload = 'metadata';
      this.bind('canplaythrough', () => {
        this.play();
      });
      this.bind('ended', () => {
        if (!isDevMode()) {
          let songFinished = this.api.AnalyticsEvent.create({
            category: 'music_engagement',
            action: 'finished_song',
            label: `${this._playQueue[0].artist_name}: ${this._playQueue[0].title}`,
            metadata: {
              song_id: this._playQueue[0].id,
              song_length: this._duration,
            },
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
    try {
      if (!this.audioSrc) {
        this.audioSrc = this.audioCtx.createMediaElementSource(this.instance);
        this.audioAnalyser = this.audioCtx.createAnalyser();
        this.audioSrc.connect(this.audioAnalyser);
        this.audioAnalyser.connect(this.audioCtx.destination);
        this.audioAnalyser.fftSize = 256;
      }
      if (this.audioAnalyser) {
        this.bufferLength = this.audioAnalyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
      }
    } catch (e) {
      console.log('Audio Analyser or Audio Source not available.');
    }
  }

  public destroyAudio() {
    if (this.instance) {
      this.pause();
      this.title.setTitle(`Punkweb`);
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
