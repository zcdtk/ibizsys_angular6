import { Input, Output, EventEmitter } from '@angular/core';
import { IBizMDViewController } from './IBizMDViewController';
import { IBizEvent } from '../IBizEvent';

/**
 * 索引关系数据选择视图（部件视图）
 * 
 * @export
 * @class IBizDataViewController
 * @extends {IBizMDViewController}
 */
export class IBizDataViewController extends IBizMDViewController {

    /**
     * 是否支持多选
     * 
     * @type {boolean}
     * @memberof IBizDataViewController
     */
    @Input()
    multiselect: boolean;

    /**
     * 当前选中值
     * 
     * @type {*}
     * @memberof IBizDataViewController
     */
    @Input()
    currentValue: any;

    /**
     * 删除数据
     * 
     * @type {*}
     * @memberof IBizDataViewController
     */
    @Input()
    deleteData: any;

    /**
     * 数据选中事件，向外输出处理
     *
     * @type {EventEmitter<any>}
     * @memberof IBizDataViewController
     */
    @Output()
    selectionChange: EventEmitter<any> = new EventEmitter();

    /**
     * 行数据激活事件，向外输出处理
     * 
     * @type {EventEmitter<any>}
     * @memberof IBizDataViewController
     */
    @Output()
    dataActivated: EventEmitter<any> = new EventEmitter();

    /**
     * Creates an instance of IBizDataViewController.
     * 创建 IBizDataViewController 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizDataViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 部件初始化
     * 
     * @memberof IBizDataViewController
     */
    public onInitComponents(): void {

        const dataViewControl: any = this.getMDCtrl();
        if (dataViewControl) {
            // 数据视图部件行激活
            dataViewControl.on(IBizEvent.IBizDataView_DATAACTIVATED).subscribe((data) => {
                this.onDataActivated(data);
            });
            // 数据视图部件行选中
            dataViewControl.on(IBizEvent.IBizDataView_SELECTIONCHANGE).subscribe((data) => {
                this.onSelectionChange(data);
            });
        }
    }

    /**
     * 部件加载
     * 
     * @memberof IBizDataViewController
     */
    public onLoad(): void {
        const dataViewControl = this.getMDCtrl();
        if (dataViewControl) {
            dataViewControl.load();
        }
    }

    /**
     * 部件数据激活
     * 
     * @param {*} data 
     * @memberof IBizDataViewController
     */
    public onDataActivated(data: Array<any>): void {
        super.onDataActivated(data);
        this.dataActivated.emit(data);
    }

    /**
     * 部件数据行选中
     * 
     * @param {*} data 
     * @memberof IBizDataViewController
     */
    public onSelectionChange(data: Array<any>): void {
        super.onSelectionChange(data);
        this.selectionChange.emit(data);
    }

    /**
     * 获取部件
     * 
     * @returns {*} 
     * @memberof IBizDataViewController
     */
    public getMDCtrl(): any {
        return this.getDataView();
    }

    /**
     * 获取数据视图部件
     * 
     * @returns {*} 
     * @memberof IBizDataViewController
     */
    public getDataView(): any {
        return this.$controls.get('dataview');
    }
}
