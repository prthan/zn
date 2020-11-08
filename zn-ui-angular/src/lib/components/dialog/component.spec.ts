import { ComponentFixture, TestBed } from '@angular/core/testing';

import { znDialogComponent } from './component';

describe('znDialogComponent', () => {
  let component: znDialogComponent;
  let fixture: ComponentFixture<znDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ znDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(znDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
