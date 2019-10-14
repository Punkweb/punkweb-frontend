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

  public get playQueue() {
    return this._playQueue;
  }

  public set playQueue(value) {
    this._playQueue = value;
    this.load(this._playQueue[0].file);
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

  public currentTime() {
    return this.instance.currentTime;
  }

  public duration() {
    return this.instance.duration;
  }

  public isMuted() {
    return this.instance.muted;
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
      this.events.forEach((event, i) => {
        this.instance.removeEventListener(event.name, event.callback);
        this.events.splice(i, 1);
      });
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
