import { Component, TemplateRef, ContentChild, Input } from '@angular/core';

@Component({
    selector: 'app-ibiz-form-group',
    templateUrl: './ibiz-form-group.component.html',
    styleUrls: ['./ibiz-form-group.component.less']
})
export class IBizFormGroupComponent {

    /**
     * 标题关闭状态
     *
     * @type {boolean}
     * @memberof IBizFormGroupComponent
     */
    public titleBarState: boolean;

    /**
     * 分组项控制器
     *
     * @type {*}
     * @memberof IBizFormGroupComponent
     */
    public ctrl: any;

    /**
     * 子节点内容
     *
     * @type {TemplateRef<any>}
     * @memberof IBizFormGroupComponent
     */
    @ContentChild(TemplateRef) template: TemplateRef<any>;


    /**
     * 表单分组项控制器绑定
     *
     * @memberof IBizFormGroupComponent
     */
    @Input()
    set group(val) {
        this.ctrl = val;
        const state = this.ctrl.titleBarCloseMode === 0 || this.ctrl.titleBarCloseMode === 1;
        this.titleBarState = (!this.ctrl.showCaption) || state ? true : false;
        this.context = { '$implicit': val };
    }


    /**
     * 上下文内容
     *
     * @type {*}
     * @memberof IBizFormGroupComponent
     */
    public context: any = {};

    constructor() { }

    /**
     * 搜索关闭分组内容
     *
     * @memberof IBizFormGroupComponent
     */
    public toggleCollapsed(): void {
        this.titleBarState = !this.titleBarState;
    }
}
