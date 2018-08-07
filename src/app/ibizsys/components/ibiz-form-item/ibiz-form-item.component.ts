import { Component, TemplateRef, ContentChild, Input } from '@angular/core';

@Component({
    selector: 'app-ibiz-form-item',
    template: `<ng-container *ngTemplateOutlet="template; context: context"></ng-container>`,
    styles: []
})
export class IBizFormItemComponent {
    @ContentChild(TemplateRef)
    template: TemplateRef<any>;
    @Input()
    set field(val) {
        this.context = { '$implicit': val };
    }
    /**
     * 模板输出上下文对象
     *
     * @type {*}
     * @memberof IBizFormComponent
     */
    public context: any = {};

    constructor() { }

}
