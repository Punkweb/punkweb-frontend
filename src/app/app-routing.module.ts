import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  Error404Component,
  HomeComponent,
  LoginComponent,
  SettingsComponent,
  // Music
  MusicComponent,
  AlbumComponent,
  ArtistComponent,
  EventComponent,
  LatestComponent,
} from './routes';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'music',
    component: MusicComponent,
  },
  {
    path: 'music/album/:slug',
    component: AlbumComponent,
  },
  {
    path: 'music/artist/:slug',
    component: ArtistComponent,
  },
  {
    path: 'music/event/:slug',
    component: EventComponent,
  },
  {
    path: 'music/latest',
    component: LatestComponent,
  },
  {
    path: '**',
    component: Error404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
