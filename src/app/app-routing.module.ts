import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BoardIndexComponent,
  BoardSubcategoryComponent,
  BoardThreadComponent,
  Error404Component,
  HomeComponent,
  LoginComponent,
} from './routes';

const routes: Routes = [
  {
    path: '',
    component: BoardIndexComponent,
  },
  {
    path: 'subcategory/:id',
    component: BoardSubcategoryComponent,
  },
  {
    path: 'thread/:id',
    component:  BoardThreadComponent,
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
