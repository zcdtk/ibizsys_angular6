import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzSelectComponent } from 'ng-zorro-antd';

import { IBizComponent } from '../ibiz-component';
import { IBizHttp } from './../../service/IBizHttp';

@Component({
    selector: 'app-ibiz-select',
    templateUrl: './ibiz-select.component.html'
})
export class IBizSelectComponent extends IBizComponent implements OnInit {

    /**
    * 代码表
    *
    * @type {Array<any>}
    * @memberof IBizSelectComponent
    */
    @Input() codelist: Array<any>;

    /**
     * 代码表类型
     *
     * @type {string}
     * @memberof IBizSelectComponent
     */
    @Input() codelisttype: string;

    /**
     * 动态代码表数据请求url
     *
     * @type {string}
     * @memberof IBizSelectComponent
     */
    @Input() url: string;

    /**
     * 动态代码表文本值
     *
     * @type {string}
     * @memberof IBizSelectComponent
     */
    @Input() text: string;

    /**
     * nzselect组件对象
     *
     * @type {NzSelectComponent}
     * @memberof IBizSelectComponent
     */
    @ViewChild('selectObj') selectObj: NzSelectComponent;

    /**
     * 组件值
     * 
     * @memberof IBizPickerComponent
     */
    @Input()
    set itemvalue(val) {
        if (!Object.is(val, '')) {
            this.$value = val;
            this.selectObj.writeValue(val);
        } else {
            this.selectObj.clearNgModel();
        }
    }

    /**
     * Creates an instance of IBizSelectComponent.
     * 创建 IBizSelectComponent 实例
     * 
     * @param {IBizHttp} iBizHttp
     * @memberof IBizSelectComponent
     */
    constructor(private iBizHttp: IBizHttp) {
        super();
    }

    /**
     * Angular生命周期，部件初始化
     *
     * @memberof IBizSelectComponent
     */
    ngOnInit(): void {
        super.ngOnInit();
        if (this.grid && Object.is(this.codelisttype, 'DYNAMIC')) {
            this.codelist = [{ realtext: this.data[this.text], text: this.data[this.text], value: this.data[this.name] }];
        }
    }

    /**
     * 选中值发生改变
     *
     * @memberof IBizSelectComponent
     */
    public onValueChanged(): void {
        this.$value = this.$value ? this.$value : '';
        if (this.form) {
            const itemField = this.form.findField(this.name);
            if (itemField) {
                itemField.setValue(this.$value);
            }
        }
        if (this.grid) {
            this.grid.colValueChange(this.name, this.$value, this.data);
            if (Object.is(this.codelisttype, 'DYNAMIC')) {
                const code: Array<any> = this.codelist.filter(item => Object.is(item.value, this.$value));
                const text: string = (code && code.length === 1) ? code[0].text : '';
                this.grid.colValueChange(this.text, text, this.data);
            }
        }
    }

    /**
     * 加载动态代码表
     *
     * @private
     * @returns {void}
     * @memberof IBizSelectComponent
     */
    private loadDynamicCodeList(): void {
        if (!this.grid || !Object.is(this.codelisttype, 'DYNAMIC')) {
            return;
        }
        this.codelist = [];
        this.iBizHttp.post(this.url).subscribe((success) => {
            if (success.ret === 0) {
                [...this.codelist] = success.items;
            }
        }, (error) => {
            console.log(error);
        });
    }

    /**
     * 打开下拉列表
     *
     * @param {*} $event
     * @returns {void}
     * @memberof IBizSelectComponent
     */
    public openChange($event: any): void {
        if (!$event) {
            return;
        }
        this.loadDynamicCodeList();
    }

}
