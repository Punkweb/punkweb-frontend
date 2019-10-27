import { AudioPlayerService } from '../../../services';
import { Random, Renderer, State, Squire } from '../../../squire';

export class VisualizerState extends State {

  public bufferLength = this.audio.bufferLength;
  public barWidth = (this.engineCtx.size.w / this.audio.bufferLength) * 1;

  public mainR = 107;
  public mainG = 65;
  public mainB = 217;

  constructor(public engineCtx: Squire, public audio: AudioPlayerService) {
    super(engineCtx);
  }

  public init() { }

  public render(rend: Renderer) {
    if (!this.audio || !this.audio.audioAnalyser) {
      return;
    }
    let x = 0;
    let frequency, radius;
    let r, g, b, grayscale;
    let center;
    let itemsCount;
    for (let i = 0; i < this.bufferLength; i++) {
      frequency = this.audio.dataArray[i];
      itemsCount = 32;
      radius = frequency * .55;
      r = Math.abs(radius - 255) + this.mainR;
      g = Math.abs(radius - 255) + this.mainG;
      b = Math.abs(radius - 255) + this.mainB;
      grayscale = `rgba(${r}, ${g}, ${b}, .1)`;

      center = {
        color: grayscale,
        x: this.engineCtx.size.w / 2,
        y: this.engineCtx.size.h / 2,
        r: radius
      };
      rend.circle(center.color, center.x, center.y, center.r);
      let item;
      let itemRadius;
      let itemr, itemg, itemb;
      for (let j = 0; j < itemsCount; j++) {
        itemRadius = (center.r * .1);
        item = {
          color: center.color,
          x: (center.x + center.r * Math.cos(2 * Math.PI * j / itemsCount)),
          y: (center.y + center.r * Math.sin(2 * Math.PI * j / itemsCount)),
          r: itemRadius,
        };
        rend.circle(item.color, item.x, item.y, item.r);
      }
      x += this.barWidth;
    }
  }

  public update(dt: number) {
    if (!this.audio || !this.audio.audioAnalyser) {
      return;
    }
    this.audio.audioAnalyser.getByteFrequencyData(this.audio.dataArray);
  }

  public end() { }
}
