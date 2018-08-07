import { Component, ViewChild, ViewContainerRef, OnInit, ComponentFactoryResolver } from '@angular/core';
import { IBizDynamicFieldBase } from '../../formitem/IBizDynamicFieldBase';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-form-group',
    template: `
    <app-ibiz-form-group [visible]="form.$fields[config.name].visible" [ngStyle]="{}" nz-col [nzMd]="24" [text]="config.caption" [form]="form"
    [groupname]="config.name" firstChild="pswfid" [showheader]="true" [isShowMore]="false" [isShowNew]="false">
      <div class="ibiz-content">
        <ng-container #dynamicFormGroup></ng-container>
      </div>
    </app-ibiz-form-group>
  `
})
export class IBizDynamicFormGroupComponent extends IBizDynamicFieldBase implements OnInit {
    @ViewChild('dynamicFormGroup', { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(public resolver: ComponentFactoryResolver) {
        super({ 'resolver': resolver });
    }

    public ngOnInit() {
        const childItems: any[] = this.config.items;
        if (childItems) {
            childItems.forEach(
                (item: any) => {
                    if (Object.keys(item).length > 0) {
                        item.visible = true;
                        this.createChildComponent(item);
                    }
                }
            );
        }
    }

}
