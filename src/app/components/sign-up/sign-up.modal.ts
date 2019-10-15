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
  public email: string;
  public password: string;
  public errorMessage: string;

  constructor(
    private modals: ModalService,
    private http: HttpService,
  ) { }

  public signUp() {
    let signUpSub = this.http.post(environment.apiUrl + '/register/', {
      username: this.username,
      email: this.email,
      password: this.password,
    }).subscribe(
      (user) => {
        gtag('event', 'created_account', {
          'event_category': 'Account Engagement',
          'event_label': `${this.email}`,
          'value': 1,
        });
        this.modals.close(user);
      },
      (err) => {
        console.log(err);
      },
      () => {
        signUpSub.unsubscribe();
      },
    );
  }
}
