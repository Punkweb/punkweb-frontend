import { Component, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../modules/modals';
import { ApiService, AuthService, HttpService } from '../../services';
import { environment } from '../../../environments/environment';

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
    private router: Router,
    private modals: ModalService,
    private api: ApiService,
    private auth: AuthService,
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
        if (!isDevMode()) {
          let analyticsSub = this.api.AnalyticsEvent.create({
            category: 'account_engagement',
            action: 'account_created',
            label: `${this.username}`
          }).subscribe(
            () => {},
            () => {},
            () => {
            analyticsSub.unsubscribe();
          });
        }
        this.auth.login(this.username, this.password1).subscribe(() => {
          this.router.navigate(['/']);
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
