import { Renderer } from './';

export abstract class State {

  constructor(public engineCtx: any) {}

  public abstract init(): void;

  public abstract render(r: Renderer): void;

  public abstract update(dt: number): void;

  public abstract end(): void;

}
