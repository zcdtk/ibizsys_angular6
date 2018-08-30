import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbizDrpanelComponent } from './ibiz-drpanel.component';

describe('IbizDrpanelComponent', () => {
  let component: IbizDrpanelComponent;
  let fixture: ComponentFixture<IbizDrpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbizDrpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbizDrpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
