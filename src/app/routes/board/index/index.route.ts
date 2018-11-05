import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ModalService, ConfirmModalComponent } from '../../../modules/modals';
import { ApiService, AuthService } from '../../../services';

@Component({
  selector: 'app-route-board-index',
  templateUrl: './index.route.html',
  styleUrls: ['./index.route.scss']
})
export class BoardIndexComponent implements OnDestroy, OnInit {

  public user = null;
  public categories = [];

  private authSub: Subscription = null;

  constructor(
    private modals: ModalService,
    private api: ApiService,
    private auth: AuthService,
  ) { }

  public ngOnInit() {
    this.authSub = this.auth.user$.subscribe((user) => {
      this.user = user;
    });
    this.api.Category.paged().subscribe((categories) => {
      this.categories = categories;
    });
  }

  public ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  public openModal() {
    this.modals.open(ConfirmModalComponent, {
      position: {
        top: '20vh',
      },
      width: '360px'
    }).subscribe((res) => {
      console.log(res);
    });
  }
}
