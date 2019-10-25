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
      // this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      for (let i = 0; i < this.audio.bufferLength; i++) {
        barHeight = this.audio.dataArray[i];
        this.canvasCtx.fillStyle = '#6741d9';
        this.canvasCtx.fillRect(x, this.canvasHeight - (barHeight * .4), this.barWidth, barHeight);
        x += this.barWidth + .25;
      }
    }
  }
}
