import { Component, ContentChild, TemplateRef, Input } from '@angular/core';

@Component({
    selector: 'app-ibiz-form',
    template: `<form nz-form notab="false">
      <ng-container *ngTemplateOutlet="template; context: context"></ng-container>
      </form>
      `,
    styles: []
})
export class IBizFormComponent {
    @ContentChild(TemplateRef)
    template: TemplateRef<any>;
    @Input()
    set fields(val) {
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
