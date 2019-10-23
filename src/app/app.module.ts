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

// Components
import {
  AudioPlayerComponent,
  ChartComponent,
  NavComponent,
  PageHeaderComponent,
  SearchComponent,
  ShoutboxComponent,
  SidebarComponent,
  SignUpModalComponent,
  SongLyricsModalComponent,
} from './components';

// Services
import {
  ApiService,
  AudioPlayerService,
  AuthService,
  AuthTokenInterceptor,
  ElectronService,
  HttpService,
  SanitizeService,
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

    // Components
    AudioPlayerComponent,
    ChartComponent,
    NavComponent,
    PageHeaderComponent,
    SearchComponent,
    ShoutboxComponent,
    SidebarComponent,
    SignUpModalComponent,
    SongLyricsModalComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    {provide: APP_BASE_HREF, useValue : '/' },
    // Services
    {provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true},
    ApiService,
    AudioPlayerService,
    AuthService,
    ElectronService,
    HttpService,
    SanitizeService,
  ],
  entryComponents: [
    SignUpModalComponent,
    SongLyricsModalComponent,
  ],
})
export class AppModule { }
