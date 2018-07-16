import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ApiService, SanitizeService } from '../../services';

@Component({
  selector: 'app-shoutbox',
  templateUrl: './shoutbox.component.html',
  styleUrls: ['./shoutbox.component.scss']
})
export class ShoutboxComponent implements OnInit, OnDestroy {

  public shouts = [];
  private shoutsSub: Subscription = null;

  constructor(
    private api: ApiService,
    public sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    this.shoutsSub = this.api.Shout.paged().subscribe((shouts) => {
      this.shouts = shouts;
    });
  }

  public ngOnDestroy() {
    if (this.shoutsSub) {
      this.shoutsSub.unsubscribe();
    }
  }

}
