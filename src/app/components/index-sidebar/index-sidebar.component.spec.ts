import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSidebarComponent } from './index-sidebar.component';
import { AppModule } from '../../app.module';

describe('IndexSidebarComponent', () => {
  let component: IndexSidebarComponent;
  let fixture: ComponentFixture<IndexSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
