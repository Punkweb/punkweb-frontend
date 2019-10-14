import { Component } from '@angular/core';
import { HttpService } from '../../services';
import { environment } from '../../../environments/environment';

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
    private http: HttpService,
  ) { }

  public signUp() {
    let signUpSub = this.http.post(environment.apiUrl + '/register/', {
      username: this.username,
      email: this.email,
      password: this.password,
    }).subscribe(
      (user) => {
        console.log(user);
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
