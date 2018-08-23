import { Component, TemplateRef, ContentChild, Input } from '@angular/core';

@Component({
    selector: 'app-ibiz-form',
    templateUrl: './ibiz-form.component.html',
    styleUrls: ['./ibiz-form.component.less']
})
export class IBizFormComponent {

    /**
     * 
     *
     * @type {TemplateRef<any>}
     * @memberof IBizFormComponent
     */
    @ContentChild(TemplateRef) template: TemplateRef<any>;

    /**
     * 
     *
     * @memberof IBizFormComponent
     */
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
