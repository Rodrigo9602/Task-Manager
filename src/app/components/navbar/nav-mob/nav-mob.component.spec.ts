import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMobComponent } from './nav-mob.component';

describe('NavMobComponent', () => {
  let component: NavMobComponent;
  let fixture: ComponentFixture<NavMobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
