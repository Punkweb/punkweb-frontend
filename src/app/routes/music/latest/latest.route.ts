import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from '../../../services';

@Component({
  selector: 'app-route-latest',
  templateUrl: './latest.route.html',
  styleUrls: ['./latest.route.scss']
})
export class LatestComponent implements OnDestroy, OnInit {

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Music',
      link: '/music',
    },
    {
      text: 'Artist',
      link: '/music/artist',
    },
    {
      text: 'Event',
      link: null,
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) { }

  public ngOnInit() { }

  public ngOnDestroy() { }
}
