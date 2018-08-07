import { Component, OnInit } from '@angular/core';
import { IBizDynamicFieldBase } from '../../formitem/IBizDynamicFieldBase';
import { IBizDynamicViewModalService } from '../ibiz-dynamic-view-modal.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-address-pickup',
    template: `
    <div nz-form-item [ngStyle]="{'display':form.$fields[config.name].visible?'block':'none'}" nz-col [nzMd]="12" class="ibiz-formitem left">
      <div nz-form-label class='ibiz-formitem-label-left pull-left' style="width:130px;">
        <label [ngClass]="{'ant-form-item-required': form.$fields[config.name].allowEmpty}">{{config.caption}}</label>
      </div>
      <div nz-form-control [nzValidateStatus]="form.$fields[config.name].validateStatus" style="margin-left:130px;">
        <app-ibiz-mpicker [pickupModalService]='modal' [(itemvalue)]="form.$fields[config.name].value"
          [form]="form" [name]="config.name"  [disabled]="form.$fields[config.name].disabled"></app-ibiz-mpicker>
        <div nz-form-explain *ngIf="form.$fields[config.name].hasError">{{form.$fields[config.name].errorInfo}}</div>
      </div>
    </div>
  `
})
export class IBizDynamicAddressPickupComponent extends IBizDynamicFieldBase implements OnInit {

    public modal: any;

    constructor(private modalService: IBizDynamicViewModalService) {
        super({});
    }

    public ngOnInit() {
        this.modal = this.modalService.getModalService(this.config.modalName);
        console.log(this.modal);
    }

}
