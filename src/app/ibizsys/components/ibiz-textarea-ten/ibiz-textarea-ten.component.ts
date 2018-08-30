import { Component, Input } from '@angular/core';

import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-textarea-ten',
    templateUrl: './ibiz-textarea-ten.component.html'
})
export class IBizTextareaTenComponent extends IBizComponent {

    /**
     * 定时
     *
     * @type {*}
     * @memberof IBizTextareaComponent
     */
    public timeOut: any;

    /**
     * 用户字典id
     *
     * @type {string}
     * @memberof IBizTextarea10Component
     */
    @Input()
    dictId: string;

    /**
     * 用户词条数组
     *
     * @type {*}
     * @memberof IBizTextarea10Component
     */
    @Input()
    dictitems: any;

    /**
     * 下拉选选中的值
     *
     * @type {string}
     * @memberof IBizTextarea10Component
     */
    public selectedValue: string = '';

    /**
     * 组件值设置
     *
     * @param {*} val
     * @memberof IBizComponent
     */
    public setComponentValue(val: any) {
        if (val) {
            this.$value = val;
        } else {
            this.$value = '';
        }
    }

    constructor() {
        super();
    }

    /**
     * 数据发生改变，触发表单项更新
     *
     * @param {string} newVal
     * @memberof IBizTextarea10Component
     */
    public valueChange(newVal: string): void {
        if (this.form) {
            if (this.timeOut) {
                clearTimeout(this.timeOut);
                this.timeOut = undefined;
            }
            this.timeOut = setTimeout(() => {
                if (this.name && !Object.is(this.name, '')) {
                    let itemField = this.form.findField(this.name);
                    if (itemField) {
                        itemField.setValue(newVal);
                    }
                }
            }, 300);
        }
    }

    /**
     * 下拉选择回调
     *
     * @param {*} value
     * @memberof IBizTextarea10Component
     */
    public setValue(value: any): void {
        if (this.dictitems) {
            this.dictitems.some((item) => {
                if (value && Object.is(item.text, value)) {
                    this.valueChange(item.value);
                    return true;
                }
            });
        }
        if (!value) {
            this.value = '';
        }
    }


}
