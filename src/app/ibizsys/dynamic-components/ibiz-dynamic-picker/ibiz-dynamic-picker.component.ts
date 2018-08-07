import { Component, OnInit } from '@angular/core';
import { IBizDynamicFieldBase } from '../../formitem/IBizDynamicFieldBase';
import { IBizDynamicViewModalService } from '../ibiz-dynamic-view-modal.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-picker',
    template: `
    <div nz-form-item [ngStyle]="{'display':form.$fields[config.name].visible?'block':'none'}" nz-col [nzMd]="12" class="ibiz-formitem left">
      <div nz-form-label class='ibiz-formitem-label-left pull-left' style="width:130px;">
        <label [ngClass]="{'ant-form-item-required': form.$fields[config.name].allowEmpty}">{{config.caption}}</label>
      </div>
      <div nz-form-control [nzValidateStatus]="form.$fields[config.name].validateStatus" style="margin-left:130px;">
        <app-ibiz-picker [pickupModalService]='modal' [(itemvalue)]="form.$fields[config.name].value"
          [form]="form" valueitem="pswfid" [name]="config.name" [editortype]="pickerType" [disabled]="form.$fields[config.name].disabled"></app-ibiz-picker>
        <div nz-form-explain *ngIf="form.$fields[config.name].hasError">{{form.$fields[config.name].errorInfo}}</div>
      </div>
    </div>
  `
})
export class IBizDynamicPickerComponent extends IBizDynamicFieldBase implements OnInit {

    public modal: any;

    public pickerType: string;

    constructor(private modalService: IBizDynamicViewModalService) {
        super({});
    }

    public ngOnInit() {
        this.modal = this.modalService.getModalService(this.config.modalName);
        if (this.config.editorType) {
            switch (this.config.editorType) {
                case 'PICKEREX_NOAC_LINK':
                case 'PICKEREX_NOAC':
                    this.pickerType = 'picker';
                    return;
                case 'PICKEREX_NOBUTTON':
                    this.pickerType = 'ac';
                    return;
                case 'PICKEREX_TRIGGER_LINK':
                case 'PICKEREX_TRIGGER':
                    this.pickerType = 'picker_list';
                    return;
                case 'PICKER':
                case 'PICKEREX_LINK':
                default:
                    this.pickerType = 'picker_ac';
            }
        }
    }

}
