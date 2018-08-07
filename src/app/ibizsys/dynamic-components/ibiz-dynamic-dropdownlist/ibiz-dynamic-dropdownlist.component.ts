import { Component, OnInit } from '@angular/core';
import { IBizDynamicFieldBase } from '../../formitem/IBizDynamicFieldBase';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-dropdownlist',
    template: `
  <div nz-form-item [ngStyle]="{'display':form.$fields[config.name].visible?'block':'none'}" nz-col [nzMd]="12" class="ibiz-formitem left">
    <div nz-form-label class='ibiz-formitem-label-left pull-left' style="width:130px;">
      <label [ngClass]="{'ant-form-item-required': form.$fields[config.name].allowEmpty}">{{config.caption}}</label>
    </div>
    <div nz-form-control [nzValidateStatus]="form.$fields[config.name].validateStatus" style="margin-left:130px;">
      <nz-select [nzPlaceHolder]="'请选择'" nzAllowClear [name]="config.name"
        [(ngModel)]="form.$fields[config.name].value" [nzDisabled]="form.$fields[config.name].disabled"
        [ngStyle]="{'width': selectWidht}">
        <nz-option *ngFor="let item of form.$fields[config.name].config" [nzLabel]="item.text" [nzValue]="item.value"></nz-option>
      </nz-select>
      <div nz-form-explain *ngIf="form.$fields[config.name].hasError">{{form.$fields[config.name].errorInfo}}</div>
    </div>
  </div>
  `
})
export class IBizDynamicDropdownlistComponent extends IBizDynamicFieldBase implements OnInit {

    public selectWidht: string;

    constructor() {
        super({});
    }

    public ngOnInit() {
        if (this.config.editorType) {
            if (Object.is(this.config.editorType, 'DROPDOWNLIST_100')) {
                this.selectWidht = '100px';
            } else {
                this.selectWidht = this.config.width;
            }
        }
    }

}
