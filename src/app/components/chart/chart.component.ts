import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

declare let Chart: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvasElement')
  public canvasElement: ElementRef;

  public chartRef: any;
  public _data: any = {};

  constructor() { }

  public ngAfterViewInit() {
    const canvasCtx = this.canvasElement.nativeElement.getContext('2d');
    this.chartRef = new Chart(canvasCtx, this.data);
  }

  public ngOnDestroy() { }

  @Input()
  public get data() {
    return this._data;
  }

  public set data(value) {
    this._data = value;
    if (this.chartRef) {
      this.chartRef.update();
    }
  }
}
