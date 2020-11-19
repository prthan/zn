import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSurfaceComponent } from './view-surface.component';

describe('ViewSurfaceComponent', () => {
  let component: ViewSurfaceComponent;
  let fixture: ComponentFixture<ViewSurfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSurfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
