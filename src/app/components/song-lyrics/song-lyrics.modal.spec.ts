import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongLyricsModalComponent } from './song-lyrics.modal';
import { AppModule } from '../../app.module';

describe('SongLyricsModalComponent', () => {
  let component: SongLyricsModalComponent;
  let fixture: ComponentFixture<SongLyricsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongLyricsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
