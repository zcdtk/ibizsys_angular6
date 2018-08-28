import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbizFileUploadComponent } from './ibiz-file-upload.component';

describe('IbizFileUploadComponent', () => {
  let component: IbizFileUploadComponent;
  let fixture: ComponentFixture<IbizFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbizFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbizFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
