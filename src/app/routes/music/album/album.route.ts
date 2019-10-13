import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  'selector': 'app-route-album',
  'templateUrl': './album.route.html',
  'styleUrls': ['./album.route.scss']
})
export class AlbumComponent {

  public username: string;
  public password: string;
  public errorMessage: string;

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Album',
      link: null
    }
  ];

  constructor(
    private router: Router,
  ) { }
}
