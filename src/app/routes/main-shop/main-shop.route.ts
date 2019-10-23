import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from '../../services';

@Component({
  selector: 'app-route-main-shop',
  templateUrl: './main-shop.route.html',
  styleUrls: ['./main-shop.route.scss']
})
export class MainShopComponent implements OnDestroy, OnInit {

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Punkweb Shop',
      link: null,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) { }

  public ngOnInit() { }

  public ngOnDestroy() { }
}
