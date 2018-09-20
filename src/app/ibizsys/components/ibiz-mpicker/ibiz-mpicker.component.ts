import { Component, OnInit, Input } from '@angular/core';
import { IBizHttp } from 'ibizsys';
import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-mpicker',
    templateUrl: './ibiz-mpicker.component.html',
    styleUrls: ['./ibiz-mpicker.component.less']
})
export class IBizMpickerComponent extends IBizComponent {

    /**
       * 选中的数据对象集合
       * 
       * @type {Array<any>}
       * @memberof IBizMPickerComponent
       */
    public selectItems: Array<any> = [];

    /**
     * 选中的数据对象主键集合
     * 
     * @type {Array<any>}
     * @memberof IBizMPickerComponent
     */
    public selectValues: Array<any> = [];

    /**
     * 所有数据对象集合
     * 
     * @type {Array<any>}
     * @memberof IBizMPickerComponent
     */
    public items: Array<any> = [];

    /**
     * 拦截状态标识
     * 
     * @private
     * @type {boolean}
     * @memberof IBizMPickerComponent
     */
    private flag: boolean = true;

    /**
     * 组件选择模态框服务对象
     * 
     * @type {*}
     * @memberof IBizMPickerComponent
     */
    @Input() pickupModalService: any;

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
     * @memberof IBizMPickerComponent
     */
    private _tempSize: number = 50;

    /**
     * 每页显示数量
     *
     * @private
     * @type {number}
     * @memberof IBizMPickerComponent
     */
    private limit: number = this._tempSize;

    /**
     * 起始行数
     *
     * @private
     * @type {number}
     * @memberof IBizMPickerComponent
     */
    private startrow: number = 0;

    /**
     * 总行数
     *
     * @private
     * @type {number}
     * @memberof IBizMPickerComponent
     */
    private totalrow: number = 0;

    /**
     * 中间变量
     * 
     * @type {string}
     * @memberof IBizMPickerComponent
     */
    public _value: string = '';

    /**
     * Creates an instance of IBizMPickerComponent.
     * 创建 IBizMPickerComponent 对象
     * 
     * @param {IBizHttp} $http 
     * @memberof IBizMPickerComponent
     */
    constructor(public $http: IBizHttp) {
        super();
    }

    /**
     * 组件值设置
     * 
     * @param {*} val 
     * @memberof IBizMpickerComponent
     */
    public setComponentValue(val: any) {
        if (Object.is(val, '')) {
            this.initParams();
        }
        if (val && !Object.is(val, '') && this.flag) {
            if (typeof val === 'string') {
                try {
                    this.selectItems = JSON.parse(val);
                } catch (error) {
                    console.log('string to json error');
                }
            } else {
                this.selectItems = val;

                setTimeout(() => {
                    let itemField = this.form.findField(this.name);
                    if (itemField) {
                        itemField.setValue(JSON.stringify(this.selectItems));
                    }
                });

            }
            this.items = [];
            this.items = [...this.selectItems];
            this.selectValues = [];
            if (!Array.isArray(this.selectItems)) {
                return;
            }
            this.selectItems.forEach((item) => {
                this.selectValues.push(item.srfkey);
            });
        } else {
            this.flag = true;
        }
    }

    /**
     * 选中值发生改变
     * 
     * @param {string} val 
     * @memberof IBizPickerComponent
     */
    public onValueChange(e: any[]) {
        this.selectItems = [];
        this.items.forEach((item) => {
            if (e.indexOf(item.srfkey) >= 0) {
                this.selectItems.push(item);
            }
        });
        this.flag = false;

        let itemField = this.form.findField(this.name);
        if (itemField) {
            itemField.setValue(JSON.stringify(this.selectItems));
        }
    }

    /**
     * 搜索数据集
     * 
     * @param {string} text 
     * @memberof IBizPickerComponent
     */
    public searchItems(text: string): void {
        this._value = text;
        this.startrow = 0;
        this.limit = this._tempSize;
        this.loadData(text);

    }

    /**
     * ac展开
     * 
     * @param {any} e 
     * @memberof IBizPickerComponent
     */
    public onOpenChange(isopen): void {
        if (isopen) {
            this.loadData('');
        }
        if (!isopen) {
            this.startrow = 0;
            this.limit = this._tempSize;
            this.loading = false;
        }
    }

    /**
     * 打开选择模态框
     * 
     * @memberof IBizPickerComponent
     */
    public openPickupView(): void {
        if (!this.pickupModalService) {
            return;
        }
        if (this.disabled) {
            return;
        }

        let opt: any = {};

        if (this.form) {
            const viewController = this.form.getViewController();
            opt.viewParam = {};
            if (viewController) {
                Object.assign(opt.viewParam, viewController.getViewParam());
                opt.modalZIndex = viewController.modalZIndex;
            }
            opt.viewParam.srfreferdata = JSON.stringify(this.form.getActiveData());
        }

        opt.viewParam.selectedData = [...this.selectItems];

        this.pickupModalService.openModal(opt).subscribe((result) => {
            if (result && Object.is(result.ret, 'OK')) {
                this.selectItems = [];
                if (Array.isArray(result.data)) {
                    result.data.forEach((data) => {
                        this.selectItems.push({ srfkey: data.srfkey, srfmajortext: data.srfmajortext });
                    });
                }
                let itemField = this.form.findField(this.name);
                if (itemField) {
                    itemField.setValue(JSON.stringify(this.selectItems));
                }
            }
        });
    }

    /**
     * 初始化参数
     *
     * @private
     * @memberof IBizMPickerComponent
     */
    private initParams(): void {
        this.startrow = 0;
        this.totalrow = 0;
        this.limit = this._tempSize;
    }

    /**
     * 滚动到底部
     *
     * @returns {void}
     * @memberof IBizMPickerComponent
     */
    public scrollToBottom(): void {
        if (this.totalrow === this.items.length) {
            return;
        }
        if (!this.loading) {
            this.loading = true;
            this.startrow += this.limit;
            this.loadData(this._value);
        }
    }

    /**
     * 数据加载
     *
     * @param {string} text
     * @returns {void}
     * @memberof IBizMPickerComponent
     */
    public loadData(text: string): void {
        if (!this.form) {
            return;
        }
        const param: any = { srfaction: 'itemfetch', srfreferitem: this.name, start: this.startrow, limit: this.limit, query: text, srfreferdata: JSON.stringify(this.form.getActiveData()) };
        const url: string = `${this.form.getBackendUrl()}?SRFCTRLID=${this.form.getName()}&SRFFORMITEMID=${this.name}`;
        this.$http.post(url, param).subscribe(response => {
            if (response.ret === 0 && response.items) {
                if (!Array.isArray(response.items)) {
                    return;
                }
                if (!this.loading) {
                    this.items = [];
                }
                let viewController = null;
                if (this.form) {
                    viewController = this.form.getViewController();
                }
                response.items.forEach((item) => {
                    const index = this.items.findIndex(_item => Object.is(_item.srfkey, item.value));
                    if (index !== -1) {
                        return;
                    }
                    let copyItem: any = {};
                    Object.assign(copyItem, item);
                    let actext = item.text;
                    let srfmajortext = item.text;

                    // 绘制ac显示内容
                    if (viewController && typeof viewController.rendererRefAcOption === 'function' && typeof viewController.rendererRefAcText === 'function') {
                        actext = viewController.rendererRefAcOption(this.name, copyItem);
                        srfmajortext = viewController.rendererRefAcText(this.name, copyItem);
                    }

                    this.items.push({ srfkey: item.value, actext: actext, srfmajortext: srfmajortext });
                });
                this.totalrow = response.totalrow;
                this.loading = false;
            }
        }, error => {
            console.log('请求数据失败！');
        });
    }

}
