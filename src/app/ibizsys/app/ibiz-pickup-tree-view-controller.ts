import { EventEmitter, Output, Input } from '@angular/core';
import { IBizTreeViewController } from './ibiz-tree-view-controller';

/**
 * 选择树视图控制器（部件视图）
 * 
 * @export
 * @class IBizPickupTreeViewController
 * @extends {IBizPickupListViewController}
 */
export class IBizPickupTreeViewController extends IBizTreeViewController {

    /**
     * 是否支持多项数据选择
     * 
     * @type {boolean}
     * @memberof IBizPickupTreeViewController
     */
    @Input()
    multiselect: boolean;

    /**
     * 多数据部件加载所有数据
     * 
     * @type {EventEmitter<any>}
     * @memberof IBizPickupTreeViewController
     */
    @Output()
    allData: EventEmitter<any> = new EventEmitter();

    /**
     * 数据选中事件，向外输出处理
     * 
     * @type {EventEmitter<any>}
     * @memberof IBizPickupTreeViewController
     */
    @Output()
    selectionChange: EventEmitter<any> = new EventEmitter();

    /**
     * 数据激活事件，向外输出处理
     *
     * @type {EventEmitter<any>}
     * @memberof IBizPickupTreeViewController
     */
    @Output()
    dataActivated: EventEmitter<any> = new EventEmitter();

    /**
     * Creates an instance of IBizPickupTreeViewController.
     * 创建 IBizPickupTreeViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizPickupTreeViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 获取树部件
     * 
     * @returns {*} 
     * @memberof IBizPickupTreeViewController
     */
    public getTree(): any {
        return this.$controls.get('tree');
    }

    /**
     * 是否支持快速搜索
     * 
     * @returns {boolean} 
     * @memberof IBizPickupTreeViewController
     */
    public isEnableQuickSearch(): boolean {
        return false;
    }

    /**
     * 树部件数据选中
     * 
     * @param {Array<any>} datas 
     * @memberof IBizPickupTreeViewController
     */
    public onSelectionChange(datas: Array<any>): void {
        super.onSelectionChange(datas);
        this.selectionChange.emit(datas);
    }

    /**
     * 树部件数据激活
     *
     * @param {Array<any>} datas
     * @memberof IBizPickupTreeViewController
     */
    public onDataActivated(datas: Array<any>): void {
        super.onDataActivated(datas);
        this.dataActivated.emit(datas);
    }

    /**
     * 树部件数据加载完成
     * 
     * @param {Array<any>} datas 
     * @memberof IBizPickupTreeViewController
     */
    public onTreeLoad(datas: Array<any>): void {
        super.onTreeLoad(datas);
        const _datas: Array<any> = this.doTreeDatas(datas);
        this.allData.emit(_datas);
    }

    /**
     * 处理所有树数据
     * 
     * @private
     * @param {Array<any>} datas 
     * @returns {Array<any>} 
     * @memberof IBizPickupTreeViewController
     */
    private doTreeDatas(datas: Array<any>): Array<any> {
        // tslint:disable-next-line:prefer-const
        let _datas: Array<any> = [];
        datas.forEach(data => {
            // tslint:disable-next-line:prefer-const
            let _data: any = {};
            Object.assign(_data, data);
            if (data.items && data.items.length > 0) {
                const _items: Array<any> = [...this.doTreeDatas(data.items)];
                delete _data.items;
                _datas.push(..._items);
            }
            _datas.push(_data);
        });
        return _datas;
    }
}



