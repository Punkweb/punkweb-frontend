import { Random, Renderer, State, SquireGame } from 'squire-ts';
import { AudioPlayerService } from '../../../services';

export class BarsState extends State {

  public rendererName = 'mandala';

  public bufferLength = this.audio.bufferLength;
  public barWidth = (this.engineCtx.size.w / this.audio.bufferLength) * 1;

  public mainR = 103;
  public mainG = 65;
  public mainB = 217;

  constructor(public engineCtx: SquireGame, public audio: AudioPlayerService) {
    super(engineCtx);
    console.log('mandala state created');
  }

  public init() {
    console.log('mandala state init');
  }

  public render(rend: Renderer) {
    if (!this.audio || !this.audio.audioAnalyser) {
      return;
    }
    let x = 0;
    let frequency, height;
    let r, g, b, grayscale;
    let center;
    for (let i = 0; i < this.bufferLength; i++) {
      frequency = this.audio.dataArray[i];
      height = frequency;
      r = Math.abs(frequency - 255) + this.mainR;
      g = Math.abs(frequency - 255) + this.mainG;
      b = Math.abs(frequency - 255) + this.mainB;
      grayscale = `rgba(${r}, ${g}, ${b}, 1)`;

      center = {
        color: grayscale,
        x: x,
        y: this.engineCtx.size.h - height,
        w: this.barWidth,
        h: height,
      };
      rend.rect(center.color, center.x, center.y, center.w, center.h);
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
