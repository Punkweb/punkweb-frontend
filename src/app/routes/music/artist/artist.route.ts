import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  'selector': 'app-route-artist',
  'templateUrl': './artist.route.html',
  'styleUrls': ['./artist.route.scss']
})
export class ArtistComponent {

  public username: string;
  public password: string;
  public errorMessage: string;

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Artist',
      link: null
    }
  ];

  constructor(
    private router: Router,
  ) { }
}
