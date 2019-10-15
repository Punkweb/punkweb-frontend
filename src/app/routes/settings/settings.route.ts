import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from '../../services';

@Component({
  selector: 'app-route-settings',
  templateUrl: './settings.route.html',
  styleUrls: ['./settings.route.scss']
})
export class SettingsComponent implements OnDestroy, OnInit {

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Settings',
      link: '/settings',
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
