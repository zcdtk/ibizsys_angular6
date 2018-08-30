import { Component, OnInit, Input } from '@angular/core';

import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-checkbox',
    templateUrl: './ibiz-checkbox.component.html',
    styleUrls: ['./ibiz-checkbox.component.less']
})
export class IBizCheckboxComponent extends IBizComponent {

    /**
       * 全部数据对象集合
       * 
       * @type {any[]}
       * @memberof IBizCheckboxComponent
       */
    public items: any[] = [];

    /**
     * 选中的数据对象集合
     *
     * @private
     * @type {Array<any>}
     * @memberof IBizCheckboxComponent
     */
    private checkedValues: Array<any> = [];

    /**
     * 代码表
     *
     * @memberof IBizCheckboxComponent
     */
    @Input()
    set codelist(items: Array<any>) {
        this.items = [];
        if (!items) {
            return;
        }
        items.forEach(item => {
            Object.assign(item, { disabled: this.disabled ? true : item.disabled });
            item.label = item.text;
            this.checkedValues.forEach(val => {
                if (Object.is(val, item.value)) {
                    item.checked = true;
                }
            });
            this.items.push(item);
        });
    }

    /**
     * 表单项值
     *
     * @memberof IBizCheckboxComponent
     */
    @Input()
    set itemvalue(value: string) {
        this.handleData(this.checkedValues, value);
    }

    /**
     * 模式的类型
     *
     * @type {string}
     * @memberof IBizCheckboxComponent
     */
    @Input()
    orMode: string;

    /**
     * 数据存储分隔符
     *
     * @type {string}
     * @memberof IBizCheckboxComponent
     */
    @Input()
    valueSeparator: string;

    constructor() {
        super();
    }

    /**
     * 数据选中发生改变
     * 
     * @memberof IBizCheckboxComponent
     */
    public onValueChange(): void {
        if (!this.orMode || Object.is(this.orMode, '')) {
            this.orMode = 'str';
        }
        if (!this.valueSeparator || Object.is(this.valueSeparator, '')) {
            this.valueSeparator = ';';
        }
        let _value: string = '';
        if (Object.is(this.orMode, 'num')) {
            let temp: number = 0;
            this.items.forEach(item => {
                if (item.checked) {
                    temp = temp | parseInt(item.value, 10);
                    let _index: number = this.checkedValues.findIndex(value => Object.is(value, item.value));
                    if (_index !== -1) {
                        this.checkedValues.push(item.value);
                    }
                }
            });
            _value = temp !== 0 ? temp.toString() : '';

        } else if (Object.is(this.orMode, 'str')) {
            let selectVal: string = '';
            this.items.forEach(item => {
                if (item.checked) {
                    selectVal += this.valueSeparator + item.value;
                }
            });
            if (!Object.is(selectVal, '')) {
                selectVal = selectVal.substring(1);
            }
            _value = selectVal;
        }

        if (this.form) {
            const itemField = this.form.findField(this.name);
            if (itemField) {
                itemField.setValue(_value);
            }
        }
    }

    /**
     * 值初始化
     *
     * @private
     * @param {Array<any>} oldValue
     * @param {string} newValue
     * @returns
     * @memberof IBizCheckboxComponent
     */
    private handleData(oldValue: Array<any>, newValue: string) {
        if (!newValue) {
            return;
        }

        if (!this.orMode || Object.is(this.orMode, '')) {
            this.orMode = 'str';
        }
        if (!this.valueSeparator || Object.is(this.valueSeparator, '')) {
            this.valueSeparator = ';';
        }
        this.items.forEach(item => {
            item.checked = false;
        });
        if (Object.is(this.orMode, 'num')) {
            const nVal: number = parseInt(newValue, 10);
            this.items.forEach(item => {
                const inputValue: number = parseInt(item.value, 10);
                if ((nVal & inputValue) === inputValue) {
                    item.checked = true;
                    this.checkedValues.push(item);
                }
            });
        } else if (Object.is(this.orMode, 'str')) {
            this.checkedValues = [];
            const values: Array<any> = newValue.split(this.valueSeparator);
            values.forEach(value => {
                const index: number = this.items.findIndex(item => Object.is(item.value, value));
                if (index !== -1) {
                    this.items[index].checked = true;
                    this.checkedValues.push(value);
                }
            });

            
        }
    }

}
