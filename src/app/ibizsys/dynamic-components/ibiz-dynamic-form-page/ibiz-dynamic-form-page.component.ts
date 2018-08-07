import { Component, ViewChild, ViewContainerRef, OnInit, ComponentFactoryResolver } from '@angular/core';
import { IBizDynamicFieldBase } from './../../formitem/IBizDynamicFieldBase';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-form-page',
    template: `
    <nz-tab>
        <ng-template #nzTabHeading>
          {{config.caption}}
        </ng-template>
        <span>
          <ng-container #dynamicFormPage></ng-container>
        </span>
    </nz-tab>
  `
})
export class IBizDynamicFormPageComponent extends IBizDynamicFieldBase implements OnInit {
    @ViewChild('dynamicFormPage', { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(public resolver: ComponentFactoryResolver) {
        super({
            'resolver': resolver,
        });
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
