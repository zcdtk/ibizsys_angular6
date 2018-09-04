import { Component, OnInit, Input } from '@angular/core';
import { IBizNotification } from 'app/ibizsys/service/IBizNotification';
import { IBizHttp } from './../../service/IBizHttp';

@Component({
    selector: 'app-ibiz-picker',
    templateUrl: './ibiz-picker.component.html',
    styleUrls: ['./ibiz-picker.component.less']
})
export class IBizPickerComponent {

    /**
       * ac数组对象
       * 
       * @type {Array<any>}
       * @memberof IBizPickerComponent
       */
    public items: Array<any> = [];

    /**
     * 选中值主键
     * 
     * @type {string}
     * @memberof IBizPickerComponent
     */
    public selectValue: string;

    /**
     * 选中值文本
     * 
     * @type {string}
     * @memberof IBizPickerComponent
     */
    public selectText: string;

    /**
     * 控件样式对象
     * 
     * @type {boolean}
     * @memberof IBizPickerComponent
     */
    public state: boolean;

    /**
     * 表单项值
     * 
     * @type {string}
     * @memberof IBizPickerComponent
     */
    @Input() valueitem: string;

    /**
     * 组件名称
     * 
     * @type {string}
     * @memberof IBizPickerComponent
     */
    @Input() name: string;

    /**
     * 代码表url
     * 
     * @type {string}
     * @memberof IBizPickerComponent
     */
    @Input() codelisturl: string;

    /**
     * 编辑器类型
     * 
     * @type {string}
     * @memberof IBizPickerComponent
     */
    @Input() editortype: string;

    /**
     * 是否启用
     * 
     * @type {boolean}
     * @memberof IBizPickerComponent
     */
    @Input() disabled: boolean;

    /**
     * 选择编辑器样式
     *
     * @type {*}
     * @memberof IBizPickerComponent
     */
    @Input() styleCss: any;

    /**
     * 选择模态框服务对象
     * 
     * @type {*}
     * @memberof IBizPickerComponent
     */
    @Input() pickupModalService: any;

    /**
     * 表单部件对象
     * 
     * @type {*}
     * @memberof IBizPickerComponent
     */
    @Input() form: any;

    /**
     * 表格部件对象，行编辑使用
     *
     * @type {*}
     * @memberof IBizPickerComponent
     */
    @Input() grid: any;

    /**
     * 表格行数据，行编辑使用
     *
     * @type {*}
     * @memberof IBizPickerComponent
     */
    @Input() data: any;

    /**
     * 该控件对象的所有配置数据
     *
     * @type {*}
     * @memberof IBizPickerComponent
     */
    @Input() itemParam: any;

    /**
     * 分页加载
     *
     * @type {boolean}
     * @memberof IBizPickerComponent
     */
    public loading: boolean = false;

    /**
     * 分页请求数据项
     *
     * @private
     * @type {number}
     * @memberof IBizPickerComponent
     */
    private _tempSize: number = 50;

    /**
     * 每页显示数量
     *
     * @private
     * @type {number}
     * @memberof IBizPickerComponent
     */
    private limit: number = this._tempSize;

    /**
     * 起始行数
     *
     * @private
     * @type {number}
     * @memberof IBizPickerComponent
     */
    private startrow: number = 0;

    /**
     * 总行数
     *
     * @private
     * @type {number}
     * @memberof IBizPickerComponent
     */
    private totalrow: number = 0;

    /**
     * 组件值
     *
     * @memberof IBizPickerComponent
     */
    @Input()
    set itemvalue(val) {
        if (Object.is(val, '')) {
            this.initParams();
        }
        this.selectText = val;
        if (this.form) {
            if (!Object.is(this.valueitem, '')) {
                const field = this.form.findField(this.valueitem);
                if (field) {
                    this.selectValue = field.getValue();
                }
            } else {
                this.selectValue = val;
            }
        }

        if (this.grid) {
            if (!Object.is(this.valueitem, '') && this.data.hasOwnProperty(this.valueitem)) {
                this.selectValue = this.data[this.valueitem];
            } else {
                this.selectValue = val;
            }
        }

        if (this.selectValue) {
            this.items.push({ text: this.selectText, value: this.selectValue });
        }
    }

    /**
     * Creates an instance of IBizPickerComponent.
     * 创建 IBizPickerComponent 实例
     * 
     * @param {IBizHttp} $http 
     * @memberof IBizPickerComponent
     */
    constructor(public $http: IBizHttp, public iBizNotification: IBizNotification) { }

    /**
     * 选中值发生改变
     * 
     * @param {string} val 
     * @memberof IBizPickerComponent
     */
    public onValueChange(val: string): void {
        let text = '';
        let value = '';
        if (!this.selectValue) {
            this.items = [];
        } else {
            let arr = this.items.filter((item) => Object.is(item.value, val));
            if (arr.length > 0) {
                text = arr[0].text;
                value = arr[0].value;
            }
        }
        if (this.form) {
            let valueField = this.form.findField(this.valueitem);
            if (valueField) {
                valueField.setValue(value);
            }
            let itemField = this.form.findField(this.name);
            if (itemField) {
                itemField.setValue(text);
            }
        }
        if (this.grid) {
            this.grid.colValueChange(this.name, text, this.data);
            if (!Object.is(this.valueitem, '') && this.data.hasOwnProperty(this.valueitem)) {
                this.grid.colValueChange(this.valueitem, value, this.data);
            }
        }
    }

    /**
     * ac展开
     * 
     * @param {any} e 
     * @memberof IBizPickerComponent
     */
    public onOpenChange(isopen): void {
        if (isopen) {
            this.loadData(this.selectText);
        }
        if (!isopen) {
            this.startrow = 0;
            this.limit = this._tempSize;
            this.loading = false;
        }
    }

    /**
     * 搜索数据集
     * 
     * @param {string} text 
     * @memberof IBizPickerComponent
     */
    public searchItems(text: string): void {
        this.startrow = 0;
        this.limit = this._tempSize;
        this.loadData(text);
    }

    /**
     * 加载数据
     * 
     * @param {string} text 
     * @returns {void} 
     * @memberof IBizPickerComponent
     */
    public loadData(text: string): void {
        if (Object.is(this.editortype, 'picker')) {
            return;
        }
        if (!text) {
            text = '';
        }
        if (!this.loading) {
            this.items = [];
        }
        const param: any = { srfaction: 'itemfetch', query: text, start: this.startrow, limit: this.limit, srfreferitem: this.name, srfreferdata: JSON.stringify(this.form.getActiveData()) };
        let bcancel = this.fillPickupCondition(param);
        if (!bcancel) {
            this.iBizNotification.warning('异常', '条件不满足');
            return;
        }
        let _url: string = '';
        let srfctrlid: string = '';
        if (this.form) {
            _url = this.form.getBackendUrl();
            srfctrlid = this.form.getName();
        } else if (this.grid) {
            _url = this.grid.getBackendUrl();
            srfctrlid = this.grid.getName();
        }

        const url: string = `${_url}?SRFCTRLID=${srfctrlid}&SRFFORMITEMID=${this.name}`;
        this.$http.post(url, param).subscribe(response => {
            if (response.ret === 0) {
                let datas = [];
                if (!response.items || !Array.isArray(response.items)) {
                    return;
                }
                let viewController = null;
                if (this.form) {
                    viewController = this.form.getViewController();
                }
                if (this.grid) {
                    viewController = this.grid.getViewController();
                }
                response.items.forEach(item => {
                    let actext = item.text;
                    let text = item.text;

                    // 绘制ac显示内容
                    if (viewController && typeof viewController.rendererRefAcOption === 'function' && typeof viewController.rendererRefAcText === 'function') {
                        actext = viewController.rendererRefAcOption(this.name, item);
                        text = viewController.rendererRefAcText(this.name, item);
                    }
                    this.items.push(Object.assign({}, item, { actext: actext, text: text }));
                });

                this.totalrow = response.totalrow;
                this.loading = false;
            }
        }, error => {
            console.log('请求失败！');
        });
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
        opt.viewParam = {};

        let viewController: any;
        if (this.form) {
            viewController = this.form.getViewController();
            let _srfkey = this.form.findField('srfkey');
            if (_srfkey) {
                Object.assign(opt.viewParam, { srfkey: _srfkey.getValue() });
            }
        }

        if (this.grid) {
            viewController = this.grid.getViewController();
        }

        if (this.data && Object.keys(this.data).length > 0) {
            Object.assign(opt.viewParam, { srfkey: this.data['srfkey'] });
        }

        if (viewController) {
            Object.assign(opt.viewParam, viewController.getViewParam());
            Object.assign(opt, { modalZIndex: viewController.modalZIndex });
        }

        const bcancel: boolean = this.fillPickupCondition(opt.viewParam);
        if (!bcancel) {
            this.iBizNotification.warning('异常', '条件不满足');
            return;
        }
        this.pickupModalService.openModal(opt).subscribe((result) => {
            if (result && Object.is(result.ret, 'OK')) {
                let item: any = {};
                if (result.selection) {
                    Object.assign(item, result.selection[0]);
                }
                this.state = true;

                if (this.form) {
                    let valueField = this.form.findField(this.valueitem);
                    if (valueField) {
                        valueField.setValue(item.srfkey);
                    }
                    let itemField = this.form.findField(this.name);
                    if (itemField) {
                        itemField.setValue(item.srfmajortext);
                    }
                }

                if (this.grid) {
                    this.grid.colValueChange(this.name, item.srfmajortext, this.data);
                    if (!Object.is(this.valueitem, '') && this.data.hasOwnProperty(this.valueitem)) {
                        this.grid.colValueChange(this.valueitem, item.srfkey, this.data);
                    }
                }
            }
        });

    }

    /**
     * 填充条件
     *
     * @private
     * @param {*} arg
     * @returns {boolean}
     * @memberof IBizPickerComponent
     */
    private fillPickupCondition(arg: any): boolean {
        if (this.form) {
            if (this.itemParam && this.itemParam.fetchcond) {
                let fetchparam = {};
                let fetchCond = this.itemParam.fetchcond;
                if (fetchCond) {
                    for (let cond in fetchCond) {
                        let field = this.form.findField(fetchCond[cond]);
                        if (!field) {
                            this.iBizNotification.error('操作失败', '未能找到当前表单项' + fetchCond[cond] + '，无法继续操作');
                            return false;
                        }
                        let value = field.getValue();
                        if (!value == null || Object.is(value, '')) {
                            return false;
                        }
                        fetchparam[cond] = value;
                    }
                }
                Object.assign(arg, { srffetchcond: JSON.stringify(fetchparam) });
            }
            if (this.itemParam && this.itemParam.temprs) {
                // if (form.tempMode) {
                // 	arg.srftempmode = true;
                // }
            }
            Object.assign(arg, { srfreferitem: this.name });
            Object.assign(arg, { srfreferdata: JSON.stringify(this.form.getActiveData()) });
            return true;
        } else if (this.grid) {
            if (!this.data) {
                this.iBizNotification.error('操作失败', '未能找到当前数据，无法继续操作');
                return false;
            }
            if (this.itemParam && this.itemParam.fetchcond) {
                let fetchparam = {};
                let fetchCond = this.itemParam.fetchcond;
                if (fetchCond) {
                    for (let cond in fetchCond) {
                        let value = this.data[fetchCond[cond]];
                        if (!value) {
                            this.iBizNotification.error('操作失败', '未能找到当前表格数据项' + fetchCond[cond] + '，无法继续操作');
                            return false;
                        }
                        fetchparam[cond] = value;
                    }
                }
                Object.assign(arg, { srffetchcond: JSON.stringify(fetchparam) });
            }
            Object.assign(arg, { srfreferitem: this.name });
            Object.assign(arg, { srfreferdata: JSON.stringify(this.data) });
            return true;
        } else {
            this.iBizNotification.error('操作失败', '部件对象异常');
            return false;
        }
    }

    /**
     * 初始化参数
     *
     * @private
     * @memberof IBizPickerComponent
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
     * @memberof IBizPickerComponent
     */
    public scrollToBottom(): void {
        if (this.totalrow === this.items.length) {
            return;
        }
        if (!this.loading) {
            this.loading = true;
            this.startrow += this.limit;
            this.loadData(this.selectText);
        }
    }

}
