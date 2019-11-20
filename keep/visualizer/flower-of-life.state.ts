import { AudioPlayerService } from '../../../services';
import { Random, Renderer, State, Squire } from '../../../squire';

export class FlowerOfLifeState extends State {

  public rendererName = 'flower-of-life';

  public bufferLength = this.audio.bufferLength;
  public barWidth = (this.engineCtx.size.w / this.audio.bufferLength) * 1;

  public mainR = 103;
  public mainG = 65;
  public mainB = 217;

  constructor(public engineCtx: Squire, public audio: AudioPlayerService) {
    super(engineCtx);
    console.log('flower of state created');
  }

  public init() {
    console.log('flower of life state init');
  }

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
      itemsCount = 7;
      radius = frequency * .3;
      r = Math.abs(frequency - 255) + this.mainR;
      g = Math.abs(frequency - 255) + this.mainG;
      b = Math.abs(frequency - 255) + this.mainB;
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
        itemRadius = (center.r);
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
