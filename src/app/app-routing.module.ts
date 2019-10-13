import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  Error404Component,
  HomeComponent,
  LoginComponent,
  MusicComponent,
  AlbumComponent,
  ArtistComponent,
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
    path: '**',
    component: Error404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
