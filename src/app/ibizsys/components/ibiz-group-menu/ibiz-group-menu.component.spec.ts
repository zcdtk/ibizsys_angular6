import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbizGroupMenuComponent } from './ibiz-group-menu.component';

describe('IbizGroupMenuComponent', () => {
  let component: IbizGroupMenuComponent;
  let fixture: ComponentFixture<IbizGroupMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbizGroupMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbizGroupMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
