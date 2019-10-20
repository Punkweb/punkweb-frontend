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
  ArtistShopComponent,
  EventComponent,
  // Board
  BoardComponent,
  BoardSubcategoryComponent,
  BoardThreadComponent,
} from './routes';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'account/settings',
    component: SettingsComponent,
  },
  {
    path: '',
    component: HomeComponent,
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
    path: 'music/artist/:slug/shop',
    component: ArtistShopComponent,
  },
  {
    path: 'music/event/:slug',
    component: EventComponent,
  },
  {
    path: 'board',
    component:  BoardComponent,
  },
  {
    path: 'board/subcategory/:id',
    component:  BoardSubcategoryComponent,
  },
  {
    path: 'board/thread/:id',
    component:  BoardThreadComponent,
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
