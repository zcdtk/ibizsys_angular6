import { Component, OnInit } from '@angular/core';
import { IBizDynamicFieldBase } from '../../formitem/IBizDynamicFieldBase';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-password',
    template: `
  <div nz-form-item [ngStyle]="{'display':form.$fields[config.name].visible?'block':'none'}" nz-col [nzMd]="12" class="ibiz-formitem left">
    <div nz-form-label class='ibiz-formitem-label-left pull-left' style="width:130px;">
      <label [ngClass]="{'ant-form-item-required': form.$fields[config.name].allowEmpty}">{{config.caption}}</label>
    </div>
    <div nz-form-control [nzValidateStatus]="form.$fields[config.name].validateStatus" style="margin-left:130px;">
      <app-ibiz-password [name]="config.name" [(itemvalue)]="form.$fields[config.name].value" [disabled]="form.$fields[config.name].disabled" [form]="form"></app-ibiz-password>
      <div nz-form-explain *ngIf="form.$fields[config.name].hasError">{{form.$fields[config.name].errorInfo}}</div>
    </div>
  </div>
  `
})
export class IBizDynamicPasswordComponent extends IBizDynamicFieldBase implements OnInit {

    constructor() {
        super({});
    }

    public ngOnInit() {

    }

}
