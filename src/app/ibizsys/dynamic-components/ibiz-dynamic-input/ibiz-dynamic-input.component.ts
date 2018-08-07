import { Component, OnInit } from '@angular/core';
import { IBizDynamicFieldBase } from '../../formitem/IBizDynamicFieldBase';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-input',
    template: ` <div nz-form-item [ngStyle]="{'display':form.$fields[config.name].visible?'block':'none'}" nz-col [nzMd]="12" class="ibiz-formitem left">
                    <div nz-form-label class='ibiz-formitem-label-left pull-left' style="width:130px;">
                    <label [ngClass]="{'ant-form-item-required': form.$fields[config.name].allowEmpty}">{{config.caption}}</label>
                    </div>
                    <div nz-form-control [nzValidateStatus]="form.$fields[config.name].validateStatus" style="margin-left:130px;">
                    <nz-input [nzId]="config.name" [nzType]="'text'" [name]="config.name" [(ngModel)]="form.$fields[config.name].value"
                        [nzDisabled]="form.$fields[config.name].disabled" [ngStyle]="{}">
                        <ng-template #suffix>
                        <span [ngStyle]="{'color':form.$fields[config.name].disabled ? 'rgba(0, 0, 0, 0.25) ': 'rgba(0, 0, 0, 0.65)'}"></span>
                        </ng-template>
                    </nz-input>
                        <div nz-form-explain *ngIf="form.$fields[config.name].hasError">{{form.$fields[config.name].errorInfo}}</div>
                    </div>
                </div>
                `
})
export class IBizDynamicInputComponent extends IBizDynamicFieldBase implements OnInit {

    constructor() {
        super({});
    }

    public ngOnInit() {

    }

}
