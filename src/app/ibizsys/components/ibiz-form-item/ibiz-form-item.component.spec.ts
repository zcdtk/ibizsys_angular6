import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbizFormItemComponent } from './ibiz-form-item.component';

describe('IbizFormItemComponent', () => {
  let component: IbizFormItemComponent;
  let fixture: ComponentFixture<IbizFormItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbizFormItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbizFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
