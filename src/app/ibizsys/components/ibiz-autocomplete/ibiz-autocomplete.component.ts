import { Component, Input, ViewChild } from '@angular/core';
import { NzSelectComponent } from 'ng-zorro-antd';

import { IBizHttp } from 'app/ibizsys/service/IBizHttp';
import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-autocomplete',
    templateUrl: './ibiz-autocomplete.component.html',
    styleUrls: ['./ibiz-autocomplete.component.less'],
})
export class IBizAutocompleteComponent extends IBizComponent {

    /**
     * 编辑器类型
     * 
     * @type {string}
     * @memberof IBizAutocompleteComponent
     */
    @Input() editorType: string;

    /**
     * 是否强制选择
     *
     * @type {boolean}
     * @memberof IBizAutocompleteComponent
     */
    @Input() forceselection: boolean;

    /**
     * 选择部件对象
     *
     * @type {NzSelectComponent}
     * @memberof IBizAutocompleteComponent
     */
    @ViewChild('autocomplete') selectObj: NzSelectComponent;

    /**
     * 值项名称
     *
     * @type {string}
     * @memberof IBizAutocompleteComponent
     */
    @Input() valueitem: string;

    /**
     *  组件值设置
     * 
     * @param {*} val 
     * @memberof IBizAutocompleteComponent
     */
    public setComponentValue(val: any) {
        if (Object.is(val, '')) {
            this.selectObj.clearNgModel();
            this.initParams();
        } else {
            let _valueitem = this.form.findField(this.valueitem);
            if (_valueitem) {
                this._value = _valueitem.getValue();
                this.selectObj.writeValue(this._value);
            }
            this.loadData(val, this.startrow, this.limit);
            this.initDynamicItems = true;
        }
    }

    /**
     * 值获取
     *
     * @memberof IBizAutocompleteComponent
     */
    get selectedValue() {
        return this._value;
    }

    /**
     * 值设定
     *
     * @memberof IBizAutocompleteComponent
     */
    set selectedValue(val: string) {

    }

    /**
     * 数据值处理（中转）
     *
     * @private
     * @type {string}
     * @memberof IBizAutocompleteComponent
     */
    private _value: string;

    /**
     * 初始化远程数据
     *
     * @private
     * @type {boolean}
     * @memberof IBizAutocompleteComponent
     */
    private initDynamicItems: boolean = false;

    /**
     * 选项列表
     *
     * @type {Array<any>}
     * @memberof IBizAutocompleteComponent
     */
    public items: Array<any> = [];

    /**
     * 分页加载
     *
     * @type {boolean}
     * @memberof IBizAutocompleteComponent
     */
    public loading: boolean = false;

    /**
     * 分页请求数据项
     *
     * @private
     * @type {number}
     * @memberof IBizAutocompleteComponent
     */
    private _tempSize: number = 50;

    /**
     * 每页显示数量
     *
     * @private
     * @type {number}
     * @memberof IBizAutocompleteComponent
     */
    private limit: number = this._tempSize;

    /**
     * 起始行数
     *
     * @private
     * @type {number}
     * @memberof IBizAutocompleteComponent
     */
    private startrow: number = 0;

    /**
     * 总行数
     *
     * @private
     * @type {number}
     * @memberof IBizAutocompleteComponent
     */
    private totalrow: number = 0;

    /**
     * 搜索文本值
     *
     * @private
     * @type {string}
     * @memberof IBizAutocompleteComponent
     */
    private _searchText: string;

    /**
     * Creates an instance of IBizAutocompleteComponent.
     * 创建 IBizAutocompleteComponent 实例
     * 
     * @param {IBizHttp} http
     * @memberof IBizAutocompleteComponent
     */
    constructor(private http: IBizHttp) {
        super();
    }
    /**
     * 初始化参数
     *
     * @private
     * @memberof IBizAutocompleteComponent
     */
    private initParams(): void {
        this._searchText = '';
        this.startrow = 0;
        this.totalrow = 0;
        this.limit = this._tempSize;
        this.items = [];
        this.initDynamicItems = false;
    }

    /**
     * 选中option回调
     * 
     * @param {*} val 
     * @returns {void} 
     * @memberof IBizAutocompleteComponent
     */
    public optionChange(val: any): void {
        let _item: Array<any> = [];
        if (val === null) {
            _item.push({ text: '', value: '' });
        } else {
            _item = this.items.filter(item => Object.is(item.value, val));
            if (_item.length !== 1) {
                return;
            }
        }

        this._value = _item[0].value;
        if (!this.form) {
            return;
        }
        let _field = this.form.findField(this.name);
        if (_field) {
            _field.setValue(_item[0].text);
        }
        if (this.valueitem && !Object.is(this.valueitem, '')) {
            let _valueitem = this.form.findField(this.valueitem);
            if (_valueitem) {
                _valueitem.setValue(_item[0].value);
            }
        }
    }

    /**
     * 搜索变化
     *
     * @param {string} searchText
     * @memberof IBizAutocompleteComponent
     */
    public searchChange(searchText: string): void {
        this.startrow = 0;
        this.limit = this._tempSize;
        this.items = [];
        this._searchText = searchText;
        this.loadData(searchText, this.startrow, this.limit);
    }

    /**
     * 滚动到底部
     *
     * @memberof IBizAutocompleteComponent
     */
    public scrollToBottom(): void {
        if (this.totalrow === this.items.length) {
            return;
        }
        if (!this.loading) {
            this.loading = true;
            this.startrow += this.limit;
            this.loadData('', this.startrow, this.limit);
        }
    }

    /**
     * 加载数据
     *
     * @private
     * @param {string} searchText
     * @param {number} limit
     * @memberof IBizAutocompleteComponent
     */
    private loadData(searchText: string, start: number, limit: number): void {
        const param: any = {
            srfaction: 'itemfetch',
            srfreferitem: this.name,
            query: searchText,
            srfreferdata: JSON.stringify(this.form.getActiveData()),
            limit: limit,
            start: start
        };
        const url: string = `${this.form.getBackendUrl()}?SRFCTRLID=${this.form.getName()}&SRFFORMITEMID=${this.name}`;
        this.http.post(url, param).subscribe(response => {
            this.loading = false;
            if (response.ret === 0) {
                if (!response.items || !Array.isArray(response.items)) {
                    return;
                }
                let viewController = null;
                if (this.form) {
                    viewController = this.form.getViewController();
                }
                response.items.forEach(data => {
                    let _item: any = {};
                    Object.assign(_item, data);
                    const index: number = this.items.findIndex(item => Object.is(item.value, _item.value));
                    if (index === -1) {
                        let actext = _item.text;
                        let text = _item.text;

                        // 绘制ac显示内容
                        if (viewController && typeof viewController.rendererRefAcOption === 'function' && typeof viewController.rendererRefAcText === 'function') {
                            actext = viewController.rendererRefAcOption(this.name, _item);
                            text = viewController.rendererRefAcText(this.name, _item);
                        }
                        Object.assign(_item, { actext: actext, text: text });
                        this.items.push(_item);
                    }
                });
                this.totalrow = response.totalrow;
            }
        }, error => {
            this.loading = false;
            console.log(error);
        });
    }

    /**
     * 下拉菜单打开关闭回调函数
     *
     * @param {boolean} $event
     * @memberof IBizAutocompleteComponent
     */
    public openChange($event: boolean): void {
        if (!this.initDynamicItems) {
            this.initDynamicItems = true;
            this.loading = true;
            this.loadData('', this.startrow, this.limit);
        }

        if (!$event) {
            if (!this.forceselection) {
                let item: Array<any> = this.items.filter(item => Object.is(this._value, item.value));
                if (item && item.length === 1) {
                    if (!this._searchText) {
                        return;
                    }
                    if (Object.is(this._searchText, item[0].text)) {
                        return;
                    }
                }
                const data: any = { text: this._searchText, value: '' };
                this.items.push(data);
                this.selectedValue = '';
            }
        } else {
            const index: number = this.items.findIndex(item => Object.is(item.value, ''));
            if (index !== -1) {
                this.items.splice(index, 1);
            }
        }
    }

}
