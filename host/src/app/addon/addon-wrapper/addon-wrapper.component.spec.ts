import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonWrapperComponent } from './addon-wrapper.component';

describe('AddonWrapperComponent', () => {
  let component: AddonWrapperComponent;
  let fixture: ComponentFixture<AddonWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
