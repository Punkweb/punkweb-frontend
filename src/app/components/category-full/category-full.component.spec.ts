import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFullComponent } from './category-full.component';
import { AppModule } from '../../app.module';

describe('CategoryFullComponent', () => {
  let component: CategoryFullComponent;
  let fixture: ComponentFixture<CategoryFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
