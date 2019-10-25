import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AudioPlayerService } from '../../services';

@Component({
  'selector': 'app-audio-player',
  'templateUrl': './audio-player.component.html',
  'styleUrls': ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('visualizerCanvas')
  public visualizerCanvas: ElementRef;

  public canvasCtx = null;

  public canvasHeight = 90;
  public canvasWidth = 316;

  public visualizerHidden = true;

  constructor(
    public audio: AudioPlayerService,
  ) { }

  public ngOnInit() { }

  public ngAfterViewInit() {
    this.canvasCtx = this.visualizerCanvas.nativeElement.getContext('2d');
    this.renderFrame();
  }

  public ngOnDestroy() { }

  public renderFrame() {
    // window.requestAnimationFrame(() => {
    //   this.renderFrame();
    // });
    // if (this.audio && this.audio.audioAnalyser) {
    //   let x = 0;
    //   this.audio.audioAnalyser.getByteFrequencyData(this.audio.dataArray);
    //   let barWidth = (this.canvasWidth / this.audio.bufferLength) * 1;
    //   let barHeight;
    //   this.canvasCtx.fillStyle = '#212529';
    //   this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    //   for (let i = 0; i < this.audio.bufferLength; i++) {
    //     barHeight = this.audio.dataArray[i];
    //     this.canvasCtx.fillStyle = '#6741d9';
    //     this.canvasCtx.fillRect(x, this.canvasHeight - (barHeight / 3), barWidth, barHeight);
    //     x += barWidth;
    //   }
    // }
  }

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
