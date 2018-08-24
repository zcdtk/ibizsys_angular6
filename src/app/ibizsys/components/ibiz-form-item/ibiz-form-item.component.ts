import { Component, TemplateRef, ContentChild, Input } from '@angular/core';

@Component({
    selector: 'app-ibiz-form-item',
    templateUrl: './ibiz-form-item.component.html',
    styleUrls: ['./ibiz-form-item.component.less']
})
export class IBizFormItemComponent {

    /**
     * 表达那控制器对象
     *
     * @type {*}
     * @memberof IBizFormItemComponent
     */
    public ctrl: any;

    /**
     * 子节点内容
     *
     * @type {TemplateRef<any>}
     * @memberof IBizFormItemComponent
     */
    @ContentChild(TemplateRef) template: TemplateRef<any>;

    /**
     * 表单项控制器绑定
     *
     * @memberof IBizFormItemComponent
     */
    @Input()
    set field(val) {
        this.ctrl = val;
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
