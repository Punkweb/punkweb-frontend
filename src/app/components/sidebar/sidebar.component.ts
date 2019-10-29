import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modules/modals';
import { SignUpModalComponent } from '../sign-up/sign-up.modal';
import { AuthService } from '../../services';

@Component({
  'selector': 'app-sidebar',
  'templateUrl': './sidebar.component.html',
  'styleUrls': ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy, OnInit {

  public user = null;
  public authenticated = false;
  public superuser = false;

  private authSub: Subscription = null;

  constructor(
    private router: Router,
    private modals: ModalService,
    private auth: AuthService,
  ) { }

  public ngOnInit() {
    this.authSub = this.auth.user$.subscribe((user) => {
      if (!user) {
        return;
      }
      this.user = user;
      this.authenticated = !!user.id;
      this.superuser = user.is_superuser;
    });
  }

  public ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  public signOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  public openSignUpModal() {
    this.modals.open(SignUpModalComponent, {
      position: {
        top: '2rem'
      },
      width: '320px'
    });
  }
}
