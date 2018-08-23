import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbizFormComponent } from './ibiz-form.component';

describe('IbizFormComponent', () => {
  let component: IbizFormComponent;
  let fixture: ComponentFixture<IbizFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbizFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbizFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
