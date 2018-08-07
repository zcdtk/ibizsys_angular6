import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { IBizDynamicFieldBase } from '../../formitem/IBizDynamicFieldBase';
import { IBizFieldComponentService } from '../ibiz-field-component.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-dynamic-form',
    template: `<div nz-row [nzGutter]="24" [ngClass]="{'ibiz-modal-view': dynamicView.isModal()}">
      <div nz-col [nzMd]="24">
          <nz-card [nzBordered]="false">
              <form nz-form notab="false">
                <nz-tabset>
                  <ng-container #dynamicForm></ng-container>
                </nz-tabset>
              </form>
          </nz-card>
      </div>
    </div>`
})
export class IBizDynamicFormComponent extends IBizDynamicFieldBase implements OnInit {
    @ViewChild('dynamicForm', { read: ViewContainerRef })
    container: ViewContainerRef;

    constructor(public resolver: ComponentFactoryResolver, public fieldService: IBizFieldComponentService) {
        super({
            'resolver': resolver,
            'fieldService': fieldService,
        });
    }

    public ngOnInit() {
        if (this.form && this.dynamicView) {
            this.config.forEach((item: any) => {
                if (Object.keys(item).length > 0) {
                    this.createChildComponent(item);
                }
            }
            );
        }
    }

}
