import { Component, AfterViewInit, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { debounce } from 'lodash';
import { AudioPlayerService } from '../../../services';
import { Squire, State } from '../../../squire';
import { MandalaState } from './mandala.state';
import { FlowerOfLifeState } from './flower-of-life.state';
import { BarsState } from './bars.state';

@Component({
  'selector': 'app-route-visualizer',
  'templateUrl': './visualizer.route.html',
  'styleUrls': ['./visualizer.route.scss']
})
export class VisualizerComponent implements AfterViewInit, OnDestroy, OnInit {

  public data: any = null;

  private visualizerMobile: Squire = null;
  private visualizerDesktop: Squire = null;
  private currentState: State = null;

  public innerWidth = 0;

  constructor(
    private router: Router,
    public audio: AudioPlayerService,
  ) {
    this.onResize = debounce(this.onResize, 150, {leading: false, trailing: true});
  }

  public ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 768) {
      this.initDesktop();
    } else {
      this.initMobile();
    }
  }

  public ngOnDestroy() {
    this.destroyMobile();
    this.destroyDesktop();
  }

  public ngAfterViewInit() { }

  public initMobile() {
    console.log('init Mobile');
    try {
      this.visualizerMobile = new Squire('visualizerMobile');
    } finally {
      this.currentState = new MandalaState(this.visualizerMobile, this.audio);
      this.visualizerMobile.stateManager.state = this.currentState;
      this.visualizerMobile.run();
    }
  }

  public destroyMobile() {
    if (this.visualizerMobile) {
      this.visualizerMobile.stop();
      this.visualizerMobile = null;
    }
  }

  public initDesktop() {
    console.log('init Desktop');
    try {
      this.visualizerDesktop = new Squire('visualizerDesktop');
    } finally {
      this.currentState = new MandalaState(this.visualizerDesktop, this.audio);
      this.visualizerDesktop.stateManager.state = this.currentState;
      this.visualizerDesktop.run();
    }
  }

  public destroyDesktop() {
    if (this.visualizerDesktop) {
      this.visualizerDesktop.stop();
      this.visualizerDesktop = null;
    }
  }

  public formatRendererName() {
    let anystate = <any> this.currentState;
    return anystate.rendererName.replace(/-/g, ' ');
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 768) {
      this.destroyMobile();
      this.destroyDesktop();
      this.initDesktop();
    } else {
      this.destroyMobile();
      this.destroyDesktop();
      this.initMobile();
    }
  }

  public clickBack() {
    window.history.back();
  }
}
