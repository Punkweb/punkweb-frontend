import { Renderer, State } from './';
import { sortBy as _sortBy, reverse as _reverse } from 'lodash';

export class StateManager {

  private _state: State;

  constructor() {}

  public update(dt: number): void {
    if (!this._state) {
      return;
    }
    try {
      this.state.update(dt);
    } catch (e) {
      console.error(e);
    }
  }

  public render(r: Renderer): void {
    if (!this._state) {
      return;
    }
    try {
      this._state.render(r);
    } catch (e) {
      console.error(e);
    }
  }

  public get state() {
    return this._state;
  }

  public set state(value: State) {
    if (this._state) {
      this._state.end();
    }
    this._state = value;
    if (value) {
      this._state.init();
    }
  }
}
