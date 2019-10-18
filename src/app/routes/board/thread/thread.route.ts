import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService, SanitizeService } from '../../../services';

@Component({
  selector: 'app-route-thread',
  templateUrl: './thread.route.html',
  styleUrls: ['./thread.route.scss']
})
export class BoardThreadComponent implements OnDestroy, OnInit {

  public threadLoaded = false;

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Board',
      link: '/board',
    },
    {
      text: 'Subcategory',
      link: null,
    },
    {
      text: 'Thread',
      link: null,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
    });
  }

  public ngOnDestroy() { }
}
