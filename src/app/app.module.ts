import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { CodeMirrorModule } from './modules/codemirror/codemirror.module';
import { ModalsModule } from './modules/modals/modals.module';
import { PopoverModule } from './modules/popover/popover.module';

// Main app
import { AppComponent } from './app.component';

// Routes
import {
  BoardIndexComponent,
  Error404Component,
  HomeComponent,
  LoginComponent,
} from './routes';

// Components
import {
  CategoryFullComponent,
  NavComponent,
  PageHeaderComponent,
  ShoutboxComponent,
  SidebarComponent,
  SignUpModalComponent,
} from './components';

// Services
import {
  ApiService,
  AuthService,
  AuthTokenInterceptor,
  ElectronService,
  HttpService,
  SanitizeService,
  WebsocketService,
} from './services';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    AppRoutingModule,
    CalendarModule,
    CodeMirrorModule,
    ModalsModule,
    PopoverModule,
  ],
  declarations: [
    AppComponent,
    // Routes
    BoardIndexComponent,
    Error404Component,
    HomeComponent,
    LoginComponent,
    // Components
    CategoryFullComponent,
    NavComponent,
    PageHeaderComponent,
    ShoutboxComponent,
    SidebarComponent,
    SignUpModalComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: APP_BASE_HREF, useValue : '/' },
    // Services
    {provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true},
    ApiService,
    AuthService,
    ElectronService,
    HttpService,
    SanitizeService,
    WebsocketService,
  ],
  entryComponents: [
    SignUpModalComponent,
  ],
})
export class AppModule { }
