import { IBizControl } from './ibiz-control';

/**
 * 多项选择结果集合控件服务对象
 * 
 * @export
 * @class IBizMPickupResult
 * @extends {IBizControl}
 */
export class IBizMPickupResult extends IBizControl {

    /**
     * 按钮文本--数据选中
     *
     * @type {string}
     * @memberof IBizMPickupResult
     */
    public $onRightText: string = '选中';

    /**
     * 按钮文本--取消选中
     *
     * @type {string}
     * @memberof IBizMPickupResult
     */
    public $onLeftText: string = '取消';

    /**
     * 按钮文本--全部选中
     *
     * @type {string}
     * @memberof IBizMPickupResult
     */
    public $onAllRightText: string = '全部选中';

    /**
     * 按钮文本--取消全部选中
     *
     * @type {string}
     * @memberof IBizMPickupResult
     */
    public $onAllLeftText: string = '全部取消';

    /**
     * 当前结果数据中选中数据
     * 
     * @type {Array<any>}
     * @memberof IBizMPickupResult
     */
    public $resSelecttions: Array<any> = [];

    /**
     * 多项数据结果集中所有数据
     * 
     * @type {Array<any>}
     * @memberof IBizMPickupResult
     */
    public $selections: Array<any> = [];

    /**
     * 当前表格选中数据
     *
     * @type {Array<any>}
     * @memberof IBizMPickupResult
     */
    public $curSelecttions: Array<any> = [];

    /**
     * 当前表格所有数据
     *
     * @private
     * @type {Array<any>}
     * @memberof IBizMPickupResult
     */
    private $allData: Array<any> = [];

    /**
     * Creates an instance of IBizMPickupResult.
     * 创建 IBizMPickupResult 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizMPickupResult
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 结果集数据选中
     * 
     * @param {*} [item={}] 
     * @memberof IBizMPickupResult
     */
    public resultSelect(item: any = {}): void {
        if (Object.keys(item).length === 0) {
            return;
        }

        const index: number = this.$resSelecttions.findIndex(select => Object.is(item.srfkey, select.srfkey));
        if (index === -1) {
            this.$resSelecttions.push(item);
            item.select = true;
        } else {
            this.$resSelecttions.splice(index, 1);
            item.select = false;
        }

    }

    /**
     * 结果数据选中激活
     *
     * @param {*} [item={}]
     * @returns {void}
     * @memberof IBizMPickupResult
     */
    public dataActivated(item: any = {}): void {
        if (Object.keys(item).length === 0) {
            return;
        }

        const index: number = this.$selections.findIndex(select => Object.is(item.srfkey, select.srfkey));
        this.$selections.splice(index, 1);
        const _index: number = this.$resSelecttions.findIndex(select => Object.is(item.srfkey, select.srfkey));
        if (_index !== -1) {
            this.$resSelecttions.splice(_index, 1);
        }
        item.select = false;
    }

    /**
     * 移除结果数据中已选中数据
     * 
     * @memberof IBizMPickupResult
     */
    public onLeftClick(): void {
        this.$resSelecttions.forEach((item) => {
            const index: number = this.$selections.findIndex(select => Object.is(item.srfkey, select.srfkey));
            if (index !== -1) {
                this.$selections.splice(index, 1);
            }
        });
        this.$resSelecttions = [];
    }

    /**
     * 添加表格选中数据至结果数据中
     * 
     * @memberof IBizMPickupResult
     */
    public onRightClick(): void {
        this.$curSelecttions.forEach((item) => {
            const index: number = this.$selections.findIndex(select => Object.is(item.srfkey, select.srfkey));
            if (index === -1) {
                item.select = false;
                this.$selections.push(item);
            }
        });
    }

    /**
     * 将所有表格数据添加到结果数据中
     * 
     * @memberof IBizMPickupResult
     */
    public onRightAllClick(): void {
        this.$allData.forEach((item) => {
            const index: number = this.$selections.findIndex(select => Object.is(item.srfkey, select.srfkey));
            if (index === -1) {
                item.select = false;
                this.$selections.push(item);
            }
        });
    }

    /**
     * 移除所有结果数据
     * 
     * @memberof IBizMPickupResult
     */
    public onLeftAllClick(): void {
        this.$selections = [];
        this.$resSelecttions = [];
    }

    /**
     * 获取选中值
     * 
     * @returns {Array<any>} 
     * @memberof IBizMPickupResult
     */
    public getSelections(): Array<any> {
        let sele: Array<any> = [];
        sele = [...this.$selections];
        return sele;
    }

    /**
     * 添加结果数据中的选中数据
     * 
     * @param {Array<any>} items 
     * @memberof IBizMPickupResult
     */
    public appendDatas(items: Array<any>): void {
        items.forEach(item => {
            const index: number = this.$selections.findIndex(data => Object.is(data.srfkey, item.srfkey));
            if (index === -1) {
                item.select = false;
                this.$selections.push(item);
            }
        });
    }

    /**
     * 设置设置当前选中数据
     * 
     * @param {Array<any>} data 
     * @memberof IBizMPickupResult
     */
    public setCurSelections(data: Array<any>): void {
        this.$curSelecttions = [];
        this.$curSelecttions = [...data];
    }

    /**
     * 设置当前表格所有数据
     * 
     * @param {Array<any>} data 
     * @memberof IBizMPickupResult
     */
    public setAllData(data: Array<any>): void {
        this.$curSelecttions = [];
        this.$allData = [];
        this.$allData = [...data];
    }
}
