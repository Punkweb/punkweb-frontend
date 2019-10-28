import { AudioPlayerService } from '../../../services';
import { Random, Renderer, State, Squire } from '../../../squire';

export class MandalaState extends State {

  public rendererName = 'mandala';

  private albumImage = null;

  public bufferLength = this.audio.bufferLength;
  public barWidth = (this.engineCtx.size.w / this.audio.bufferLength) * 1;

  public mainR = 103;
  public mainG = 65;
  public mainB = 217;

  constructor(public engineCtx: Squire, public audio: AudioPlayerService) {
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
    // if (this.audio.playQueue && this.audio.playQueue.length > 0) {
    //   this.albumImage = new Image(400, 400);
    //   this.albumImage.src = this.audio.playQueue[0].album_thumbnail_lrg;
    //   rend.image(
    //     this.albumImage, // img
    //     0, 0, 400, 400, // src
    //     (this.engineCtx.size.w / 2) - 160, (this.engineCtx.size.h / 2) - 160, 320, 320 // dest
    //   );
    // }
    let x = 0;
    let frequency, radius;
    let r, g, b, grayscale;
    let center;
    let itemsCount;
    for (let i = 0; i < this.bufferLength; i++) {
      frequency = this.audio.dataArray[i];
      itemsCount = 32;
      radius = frequency * .55;
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
