import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DairyManagementComponent } from './dairy-management.component';

describe('DairyManagementComponent', () => {
  let component: DairyManagementComponent;
  let fixture: ComponentFixture<DairyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DairyManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DairyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
