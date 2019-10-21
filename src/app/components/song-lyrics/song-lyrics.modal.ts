import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ModalService } from '../../modules/modals';
import { SanitizeService } from '../../services';

@Component({
  'selector': 'app-modal-song-lyrics',
  'templateUrl': './song-lyrics.modal.html',
  'styleUrls': ['./song-lyrics.modal.scss']
})
export class SongLyricsModalComponent implements OnInit {

  public data: any = null;

  public lyricsSanitized = null;
  public releaseYear = null;

  constructor(
    private router: Router,
    private modals: ModalService,
    private sanitize: SanitizeService,
  ) { }

  public ngOnInit() {
    console.log(this.data);
    this.lyricsSanitized = this.sanitizedLyrics(this.data.song);
    this.releaseYear = moment(this.data.song.album_release_date).format('YYYY');
  }

  public sanitizedLyrics(song) {
    return this.sanitize.cleanHtml(song._bbcode_lyrics_rendered);
  }
}
