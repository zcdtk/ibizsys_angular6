import { Input, Output, EventEmitter } from '@angular/core';
import { IBizGridViewController } from './ibiz-grid-view-controller';

/**
 * 选择表格视图控制器（部件视图）
 * 
 * @export
 * @class IBizPickupGridViewController
 * @extends {IBizGridViewController}
 */
export class IBizPickupGridViewController extends IBizGridViewController {

    /**
     * 父数据
     *
     * @memberof IBizPickupGridViewController
     */
    @Input()
    set parentData(parentData: any) {
        if (parentData) {
            this.setParentData(parentData);
            this.onRefresh();
        }
    }

    /**
     * 是否支持多项数据选择
     * 
     * @type {boolean}
     * @memberof IBizPickupGridViewController
     */
    @Input()
    multiselect: boolean;

    /**
     * 当前选择数据
     * 
     * @type {*}
     * @memberof IBizPickupGridViewController
     */
    @Input()
    currentValue: any;

    /**
     * 删除数据
     * 
     * @type {*}
     * @memberof IBizPickupGridViewController
     */
    @Input()
    deleteData: any;

    /**
     * 数据选中事件，向外输出处理
     * 
     * @type {EventEmitter<any>}
     * @memberof IBizPickupGridViewController
     */
    @Output()
    selectionChange: EventEmitter<any> = new EventEmitter();

    /**
     * 行数据激活事件，向外输出处理
     *
     * @type {EventEmitter<any>}
     * @memberof IBizPickupGridViewController
     */
    @Output()
    dataActivated: EventEmitter<any> = new EventEmitter();

    /**
     * 多数据部件加载所有数据
     * 
     * @type {EventEmitter<any>}
     * @memberof IBizPickupGridViewController
     */
    @Output()
    allData: EventEmitter<any> = new EventEmitter();

    /**
     * Creates an instance of IBizPickupGridViewController.
     * 创建 IBizPickupGridViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizPickupGridViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 部件初始化完成
     * 
     * @param {*} opt 
     * @memberof IBizPickupGridViewController
     */
    public onStoreLoad(opt: any): void {
        super.onStoreLoad(opt);

        if (this.multiselect && Array.isArray(opt)) {
            this.allData.emit(opt);
        }
    }

    /**
     * 视图部件初始化完成
     * 
     * @memberof IBizPickupGridViewController
     */
    public onInited(): void {
        super.onInited();
        const grid: any = this.getGrid();
        if (grid) {
            grid.setMultiSelect(this.multiselect);
        }
    }

    /**
     * 获取多数据对象
     * 
     * @returns {*} 
     * @memberof IBizGridViewController
     */
    public getMDCtrl(): any {
        return this.$controls.get('grid');
    }

    /**
     * 数据选择事件触发，提交选中数据
     * 
     * @param {Array<any>} selection 
     * @memberof IBizPickupGridViewController
     */
    public onSelectionChange(selection: Array<any>): void {
        this.selectionChange.emit(selection);
    }

    /**
     * 数据被激活<最典型的情况就是行双击>
     *
     * @param {*} [data={}]
     * @returns {void}
     * @memberof IBizPickupGridViewController
     */
    public onDataActivated(data: any = {}): void {
        super.onDataActivated(data);
        if (Object.keys(data).length === 0) {
            return;
        }
        this.dataActivated.emit([data]);
    }
}



