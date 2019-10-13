import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  'selector': 'app-route-music',
  'templateUrl': './music.route.html',
  'styleUrls': ['./music.route.scss']
})
export class MusicComponent {

  public username: string;
  public password: string;
  public errorMessage: string;

  public breadcrumbs = [
    {
      text: 'Home',
      link: '/'
    },
    {
      text: 'Music',
      link: null
    }
  ];

  constructor(
    private router: Router,
  ) { }
}
