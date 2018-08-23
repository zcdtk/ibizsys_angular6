import { Component, TemplateRef, ContentChild, Input } from '@angular/core';

@Component({
    selector: 'app-ibiz-form-item',
    templateUrl: './ibiz-form-item.component.html',
    styleUrls: ['./ibiz-form-item.component.less']
})
export class IBizFormItemComponent {

    /**
     * 
     *
     * @type {TemplateRef<any>}
     * @memberof IBizFormItemComponent
     */
    @ContentChild(TemplateRef) template: TemplateRef<any>;

    /**
     * 
     *
     * @memberof IBizFormItemComponent
     */
    @Input()
    set field(val) {
        console.log(val);
        this.context = { '$implicit': val };
    }
    /**
     * 模板输出上下文对象
     *
     * @type {*}
     * @memberof IBizFormItemComponent
     */
    public context: any = {};

    constructor() { }

}
