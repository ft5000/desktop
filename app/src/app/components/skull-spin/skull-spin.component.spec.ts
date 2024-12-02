import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkullSpinComponent } from './skull-spin.component';

describe('SkullSpinComponent', () => {
  let component: SkullSpinComponent;
  let fixture: ComponentFixture<SkullSpinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkullSpinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkullSpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
