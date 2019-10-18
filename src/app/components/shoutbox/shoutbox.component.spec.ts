import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoutboxComponent } from './shoutbox.component';
import { AppModule } from '../../app.module';

describe('ShoutboxComponent', () => {
  let component: ShoutboxComponent;
  let fixture: ComponentFixture<ShoutboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoutboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
