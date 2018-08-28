import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbizPictureComponent } from './ibiz-picture.component';

describe('IbizPictureComponent', () => {
  let component: IbizPictureComponent;
  let fixture: ComponentFixture<IbizPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbizPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbizPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
