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
export class VisualizerModalComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('visualizerCanvas')
  public visualizerCanvas: ElementRef;

  public canvasCtx = null;

  public canvasHeight = 106;
  public canvasWidth = 320;

  public bufferLength = this.audio.bufferLength;
  public barWidth = (this.canvasWidth / this.audio.bufferLength) * 1;

  public stopRenderer = false;

  public data: any = null;

  private renderIterations = 0;

  constructor(
    private router: Router,
    private modals: ModalService,
    public audio: AudioPlayerService,
  ) { }

  public ngOnInit() {
    this.stopRenderer = false;
  }

  public ngOnDestroy() {
    this.stopRenderer = true;
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

  public clickNext() {
    this.audio.next();
    if (this.audio.playQueue.length === 0) {
      this.modals.close(null);
    }
  }

  public renderFrame() {
    if (this.stopRenderer) {
      return;
    }
    window.requestAnimationFrame(() => {
      this.renderFrame();
    });
    this.renderIterations++;
    if (this.renderIterations % 3 !== 0) {
      return;
    }
    if (this.renderIterations > 300) {
      this.renderIterations = 0;
    }
    if (!this.audio || !this.audio.audioAnalyser) {
      return;
    }
    let x = 0;
    let x1 = 0;
    this.audio.audioAnalyser.getByteFrequencyData(this.audio.dataArray);
    let barHeight;
    let r, g, b, grayscale;
    this.canvasCtx.fillStyle = '#212529';
    this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (let i1 = this.audio.bufferLength - 1; i1 >= 0; i1--) {
      barHeight = this.audio.dataArray[i1];
      r = Math.abs(barHeight -  255) + 121;
      g = Math.abs(barHeight - 255) + 80;
      b = Math.abs(barHeight - 255) + 242;
      grayscale = `rgba(${r}, ${g}, ${b}, .9)`;
      this.canvasCtx.fillStyle = grayscale;
      this.canvasCtx.fillRect(x1, this.canvasHeight - (barHeight * .4), this.barWidth, barHeight);
      x1 += this.barWidth;
    }
    for (let i = 0; i < this.audio.bufferLength; i++) {
      barHeight = this.audio.dataArray[i];
      r = Math.abs(barHeight -  255) + 121;
      g = Math.abs(barHeight - 255) + 80;
      b = Math.abs(barHeight - 255) + 242;
      grayscale = `rgba(${r}, ${g}, ${b}, .9)`;
      this.canvasCtx.fillStyle = grayscale;
      this.canvasCtx.fillRect(x, this.canvasHeight - (barHeight * .4), this.barWidth, barHeight);
      x += this.barWidth;
    }
  }
}
