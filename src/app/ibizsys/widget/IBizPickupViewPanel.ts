import { IBizViewPanel } from './IBizViewPanel';
import { IBizEvent } from '../IBizEvent';

/**
 * 拾取数据视图面板
 * 
 * @export
 * @class IBizPickupViewPanel
 * @extends {IBizViewPanel}
 */
export class IBizPickupViewPanel extends IBizViewPanel {

    /**
     * 父数据
     *
     * @type {*}
     * @memberof IBizPickupViewPanel
     */
    public $parentData: any = {};

    /**
     * 选中数据
     *
     * @type {Array<any>}
     * @memberof IBizPickupViewPanel
     */
    public $selections: Array<any> = [];

    /**
     * 所有数据
     *
     * @type {Array<any>}
     * @memberof IBizPickupViewPanel
     */
    public $allData: Array<any> = [];

    /**
     * Creates an instance of IBizPickupViewPanel.
     * 创建 IBizPickupViewPanel 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizPickupViewPanel
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 获取所有数据
     *
     * @returns {Array<any>}
     * @memberof IBizPickupViewPanel
     */
    public getAllData(): Array<any> {
        return this.$allData;
    }

    /**
     * 获取所有选中数据
     *
     * @returns {Array<any>}
     * @memberof IBizPickupViewPanel
     */
    public getSelections(): Array<any> {
        return this.$selections;
    }

    /**
     * 数据选中
     *
     * @param {Array<any>} $event
     * @memberof IBizPickupViewPanel
     */
    public onSelectionChange($event: Array<any>): void {
        this.$selections = $event;
        this.fire(IBizEvent.IBizPickupViewPanel_SELECTIONCHANGE, this.$selections);
    }

    /**
     * 数据激活
     *
     * @param {Array<any>} $event
     * @memberof IBizPickupViewPanel
     */
    public onDataActivated($event: Array<any>): void {
        this.$selections = $event;
        this.fire(IBizEvent.IBizPickupViewPanel_DATAACTIVATED, this.$selections);
    }

    /**
     * 全部数据
     *
     * @param {Array<any>} $event
     * @memberof IBizPickupViewPanel
     */
    public onAllData($event: Array<any>): void {
        this.$allData = $event;
        this.fire(IBizEvent.IBizPickupViewPanel_ALLDATA, this.$allData);
    }

    /**
     * 设置父数据
     *
     * @param {*} [parentData={}]
     * @memberof IBizPickupViewPanel
     */
    public setParentData(parentData: any = {}): void {
        this.$parentData = parentData;
    }

    /**
     * 刷新面板
     *
     * @memberof IBizPickupViewPanel
     */
    public refreshViewPanel(): void {
    }
}
