import { Component } from '@angular/core';
import { ModalService } from '../../modules/modals';
import { HttpService } from '../../services';
import { environment } from '../../../environments/environment';

declare var gtag: any;

@Component({
  'selector': 'app-modal-sign-up',
  'templateUrl': './sign-up.modal.html',
  'styleUrls': ['./sign-up.modal.scss']
})
export class SignUpModalComponent {

  public username: string;
  public password1: string;
  public password2: string;
  public errorMessage: string;

  constructor(
    private modals: ModalService,
    private http: HttpService,
  ) { }

  public passwordsDontMatch() {
    return (!this.password1 || !this.password2) || (this.password1 !== this.password2);
  }

  public signUp() {
    let signUpSub = this.http.post(environment.apiUrl + '/register/', {
      username: this.username,
      password: this.password1,
    }).subscribe(
      (user) => {
        gtag('event', 'created_account', {
          'event_category': 'Account Engagement',
          'event_label': `${this.username}`,
          'value': 1,
        });
        this.modals.close(user);
      },
      (err) => {
        console.log(err);
        if (err.error.username) {
          this.errorMessage = err.error.username[0];
        } else if (err.error.password) {
          this.errorMessage = err.error.password[0];
        } else {
          this.errorMessage = err.message;
        }
      },
      () => {
        signUpSub.unsubscribe();
      },
    );
  }
}
