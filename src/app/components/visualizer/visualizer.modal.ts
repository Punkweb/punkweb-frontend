import { Component, AfterViewInit, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ModalService } from '../../modules/modals';
import { AudioPlayerService } from '../../services';

@Component({
  'selector': 'app-modal-visualizer',
  'templateUrl': './visualizer.modal.html',
  'styleUrls': ['./visualizer.modal.scss']
})
export class VisualizerModalComponent implements AfterViewInit, OnInit {

  @ViewChild('visualizerCanvas')
  public visualizerCanvas: ElementRef;

  public canvasCtx = null;

  public canvasHeight = 106;
  public canvasWidth = 320;

  public bufferLength = this.audio.bufferLength;
  public barWidth = (this.canvasWidth / this.audio.bufferLength) * 1;

  public data: any = null;

  constructor(
    private router: Router,
    private modals: ModalService,
    public audio: AudioPlayerService,
  ) { }

  public ngOnInit() {
    console.log(this.data);
  }

  public ngAfterViewInit() {
    this.canvasCtx = this.visualizerCanvas.nativeElement.getContext('2d');
    this.renderFrame();
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

  public renderFrame() {
    window.requestAnimationFrame(() => {
      this.renderFrame();
    });
    if (this.audio && this.audio.audioAnalyser) {
      let x = 0;
      this.audio.audioAnalyser.getByteFrequencyData(this.audio.dataArray);
      let barHeight;
      this.canvasCtx.fillStyle = '#212529';
      this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let i = 0; i < this.audio.bufferLength; i++) {
        barHeight = this.audio.dataArray[i];
        let r = Math.abs(barHeight -  255) + 103;
        let g = Math.abs(barHeight - 255) + 65;
        let b = Math.abs(barHeight - 255) + 217;
        let grayscale = `rgb(${r}, ${g}, ${b})`;
        this.canvasCtx.fillStyle = grayscale;
        this.canvasCtx.fillRect(x, this.canvasHeight - (barHeight * .4), this.barWidth, barHeight);
        x += this.barWidth + .25;
      }
    }
  }
}
