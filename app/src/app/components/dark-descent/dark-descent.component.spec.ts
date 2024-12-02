import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkDescentComponent } from './dark-descent.component';

describe('DarkDescentComponent', () => {
  let component: DarkDescentComponent;
  let fixture: ComponentFixture<DarkDescentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkDescentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkDescentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
