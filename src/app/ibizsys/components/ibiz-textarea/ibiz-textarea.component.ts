import { Component, Input } from '@angular/core';

import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-textarea',
    templateUrl: './ibiz-textarea.component.html',
    styleUrls: ['./ibiz-textarea.component.less']
})
export class IBizTextareaComponent extends IBizComponent {

    /**
       * 定时
       *
       * @type {*}
       * @memberof IBizTextareaComponent
       */
    public timeOut: any;

    /**
     * 条件判断只执行一次
     * 
     * @memberof IBizTextareaComponent
     */
    public flag = true;


    /**
     * 组件值设置
     * 
     * @param {*} val 
     * @memberof IBizTextareaComponent
     */
    public setComponentValue(val: any) {
        if (val) {
            this.$value = val;
            let time = setTimeout(() => {
                if (this.flag) {
                    this.flag = false;
                    let ele = document.getElementById(this.name);
                    if (ele.clientHeight < ele.scrollHeight) {
                        ele.style.height = ele.scrollHeight + 2 + 'px';
                    }
                }
            }, 1);
        } else {
            this.$value = val;
        }
    }

    /**
     * 用户字典id
     *
     * @type {*}
     * @memberof IBizTextareaComponent
     */
    @Input()
    dictId: any;

    /**
     * 用户词条数组
     *
     * @type {*}
     * @memberof IBizTextareaComponent
     */
    @Input()
    dictitems: Array<any>;

    /**
     * 下拉选选中的值
     *
     * @type {string}
     * @memberof IBizTextareaComponent
     */
    selectedValue: string = '';

    constructor() {
        super();
    }

    /**
     * 数据发生改变，触发表单项更新
     *
     * @param {string} newVal
     * @memberof IBizTextareaComponent
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
    * @param {any} event 
    * @memberof IBizTextareaComponent
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
            this.$value = '';
        }
    }

}
