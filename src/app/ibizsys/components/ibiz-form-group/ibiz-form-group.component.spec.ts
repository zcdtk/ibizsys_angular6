import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbizFormGroupComponent } from './ibiz-form-group.component';

describe('IbizFormGroupComponent', () => {
  let component: IbizFormGroupComponent;
  let fixture: ComponentFixture<IbizFormGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbizFormGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbizFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
