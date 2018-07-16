import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BoardIndexComponent,
  Error404Component,
  HomeComponent,
  LoginComponent,
} from './routes';

const routes: Routes = [
  {
    path: '',
    component: BoardIndexComponent,
    pathMatch: 'full',
  },
  {
    path: 'sg',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
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
