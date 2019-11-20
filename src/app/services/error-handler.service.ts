import { Injectable, ErrorHandler, isDevMode } from '@angular/core';
import { ApiService } from './api.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private api: ApiService,
  ) { }

  public handleError(error) {
    console.log(error);
    if (!isDevMode()) {
      let errorSub = this.api.ClientError.create({
        error_body: error.toString()
      }).subscribe(
        () => { },
        (err) => { },
        () => {
          errorSub.unsubscribe();
        }
      );
    }
  }
}
