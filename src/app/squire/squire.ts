import { Dimension2d, Point2d } from './utils';
import { Renderer } from './renderer';
import { StateManager } from './state-manager';

export class Squire {

  public size: Dimension2d;
  public center: Point2d;
  public stateManager: StateManager;
  public canvas: any;
  private ctx: any;
  private renderer: Renderer;
  private lastTickTime = Date.now();

  private stopCalled = false;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.size = new Dimension2d(this.canvas.width, this.canvas.height);
    this.center = new Point2d(this.size.w / 2, this.size.h / 2);
    this.renderer = new Renderer(this.ctx);
    this.stateManager = new StateManager();
  }

  public run(): void {
    if (this.stopCalled) {
      return;
    }
    requestAnimationFrame(() => {
      this.run();
    });
    this.renderer.clear(0, 0, this.size.w, this.size.h);

    let now = Date.now();
    let dt = (now - this.lastTickTime) / 1000;
    this.lastTickTime = now;

    this.stateManager.update(dt);
    this.stateManager.render(this.renderer);
  }

  public stop() {
    this.canvas = null;
    this.ctx = null;
    this.size = null;
    this.center = null;
    this.renderer = null;
    this.lastTickTime = null;
    this.stateManager.state = null;
    this.stateManager = null;
    this.stopCalled = true;
  }
}
