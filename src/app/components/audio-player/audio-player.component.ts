import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioPlayerService } from '../../services';

@Component({
  'selector': 'app-audio-player',
  'templateUrl': './audio-player.component.html',
  'styleUrls': ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnDestroy, OnInit {

  constructor(
    public audio: AudioPlayerService,
  ) { }

  public ngOnInit() { }

  public ngOnDestroy() { }

  public timeFormat(time) {
    let hrs = Math.floor(time / 3600);
    let mins = Math.floor(time / 60);
    let secs = Math.floor(time - mins * 60);
    let str = '';
    if (hrs > 0) {
      str += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    str += '' + mins + ':' + (secs < 10 ? '0' : '');
    str += '' + secs;
    return str;
  }

  public clickTrackBar(e) {
    let target = e.target;
    let x = e.clientX - target.offsetLeft;
    let y = e.clientY - target.offsetTop;
    let width = target.clientWidth;
    let clickPercent = (x / width);
    let toDuration = this.audio.duration * clickPercent;
    this.audio.setTime(toDuration);
  }

  public clickVolumeBar(e) {
    let target = e.target;
    let x = e.clientX - target.offsetLeft;
    let y = e.clientY - target.offsetTop;
    let width = target.clientWidth;
    let clickPercent = (x / width);
    if (clickPercent > .95) {
      clickPercent = 1;
    } else if (clickPercent < .05) {
      clickPercent = 0;
    }
    this.audio.setVolume(clickPercent);
  }
}
