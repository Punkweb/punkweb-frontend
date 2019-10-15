import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()
export class AudioPlayerService {

  public instance: any;
  public audioSrc: any;
  public audioCtx: any;
  public events = [];

  private AudioContext = null;
  private _playQueue = [];
  private _currentTime = 0;
  private _duration = 0;
  private _trackPercent = 0;

  constructor() {
    if (window.AudioContext) {
      this.AudioContext = window.AudioContext;
    } else if (window.webkitAudioContext) {
      this.AudioContext = window.webkitAudioContext;
    } else {
      this.AudioContext = null;
    }
    this.createAudio();
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

  public load(url) {
    this.destroyAudio();
    this.createAudio();
    this.instance.pause();
    this.instance.src = url;
    this.instance.load();
  }

  public createAudio() {
    if (!this.instance) {
      this.instance = new Audio();
      this.instance.autoplay = true;
      this.instance.preload = 'metadata';
      this.bind('ended', () => {
        if (this._playQueue.length > 0) {
          this._playQueue.shift();
          this.load(this._playQueue[0].file);
        }
      });
      this.bind('timeupdate', () => {
        this._currentTime = this.instance.currentTime;
        this._duration = this.instance.duration;
        this._trackPercent = ((this._currentTime / this._duration)  * 100);
      });
    }
    if (!this.audioCtx) {
      this.audioCtx = new this.AudioContext();
    }
    if (!this.audioSrc) {
      this.audioSrc = this.audioCtx.createMediaElementSource(this.instance);
    }
  }

  public destroyAudio() {
    if (this.instance) {
      this.pause();
      for (let i = 0; i < this.events.length; i++) {
        this.instance.removeEventListener(this.events[i].name, this.events[i].callback);
        this.events.splice(i, 1);
      }
      try {
        this.instance.src = '';
      } finally {
        this.instance = null;
      }
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