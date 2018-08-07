import { Component, OnInit } from '@angular/core';
import { IBizDynamicFieldBase } from '../../formitem/IBizDynamicFieldBase';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-data-pickerex',
    template: `
  <div nz-form-item [ngStyle]="{'display':form.$fields[config.name].visible?'block':'none'}" nz-col [nzMd]="12" class="ibiz-formitem left">
    <div nz-form-label class='ibiz-formitem-label-left pull-left' style="width:130px;">
      <label [ngClass]="{'ant-form-item-required': form.$fields[config.name].allowEmpty}">{{config.caption}}</label>
    </div>
    <div nz-form-control [nzValidateStatus]="form.$fields[config.name].validateStatus" style="margin-left:130px;">
      <app-ibiz-datepicker placeholder="请选择" [form]="form" [disabled]="form.$fields[config.name].disabled"
        [itemvalue]="form.$fields[config.name].value"  [name]="config.name" [datefmt]="datefmt" ></app-ibiz-datepicker>
      <div nz-form-explain *ngIf="form.$fields[config.name].hasError">{{form.$fields[config.name].errorInfo}}</div>
    </div>
  </div>
  `
})
export class IBizDynamicDataPickerexComponent extends IBizDynamicFieldBase implements OnInit {

    public datefmt = '';

    constructor() {
        super({});
    }

    public ngOnInit() {
        if (this.config.editorType) {
            switch (this.config.editorType) {
                case 'DATEPICKEREX_MINUTE':
                    this.datefmt = 'mm';
                    return;
                case 'DATEPICKEREX_SECOND':
                    this.datefmt = 'ss';
                    return;
                case 'DATEPICKEREX_NODAY':
                    this.datefmt = 'HH:mm:ss';
                    return;
                case 'DATEPICKEREX_NODAY_NOSECOND':
                    this.datefmt = 'HH:mm';
                    return;
                case 'DATEPICKEREX_HOUR':
                    this.datefmt = 'HH';
                    return;
                case 'DATEPICKEREX_NOTIME':
                case 'DATEPICKEREX':
                case 'DATEPICKER':
                default:
                    this.datefmt = (this.config.datefmt) ? this.config.datefmt : '';
            }
        }
    }

}
