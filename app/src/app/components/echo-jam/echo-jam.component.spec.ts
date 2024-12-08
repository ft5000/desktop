import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchoJamComponent } from './echo-jam.component';

describe('EchoJamComponent', () => {
  let component: EchoJamComponent;
  let fixture: ComponentFixture<EchoJamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchoJamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchoJamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
