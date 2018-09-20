import { Input } from '@angular/core';
import { IBizGridViewController } from './ibiz-grid-view-controller';

/**
 * 表格视图控制器（部件视图）
 *
 * @export
 * @class IBizGridView9Controller
 * @extends {IBizGridViewController}
 */
export class IBizGridView9Controller extends IBizGridViewController {

    /**
     * 表单活动数据
     * 
     * @type {*}
     * @memberof IBizGridView9Controller
     */
    @Input() activeData: any;

    /**
     * 父数据模型
     * 
     * @type {*}
     * @memberof IBizGridView9Controller
     */
    @Input() parentmode: any;

    /**
     * 父数据主键
     * 
     * @type {string}
     * @memberof IBizGridView9Controller
     */
    @Input() srfparentkey: string;

    /**
     * 刷新表格设置
     * 
     * @memberof IBizGridView9Controller
     */
    @Input()
    set refreshGrid(count) {
        if (count > 0) {
            if (this.parentmode && this.parentmode.srfparenttype && Object.is(this.parentmode.srfparenttype, 'CUSTOM')) {
                this.addViewParam({ srfreferdata: JSON.stringify(this.activeData) });
                this.addViewParam({ srfparentkey: this.srfparentkey });
                this.onRefresh();
                return;
            }
            if (!this.srfparentkey || Object.is(this.srfparentkey, '')) {
                return;
            }
            if (!this.activeData || Object.is(this.activeData, '') || Object.keys(this.activeData).length === 0) {
                return;
            }

            this.addViewParam({ srfreferdata: JSON.stringify(this.activeData) });
            this.addViewParam({ srfparentkey: this.srfparentkey });
            this.onRefresh();
        }
    }


    /**
     * 选中行数据
     * 
     * @type {*}
     * @memberof IBizGridView9Controller
     */
    public $selectItem: any = {};

    /**
     * Creates an instance of IBizGridView9Controller.
     * 创建 IBizGridView9Controller 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizGridView9Controller
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 视图初始化，处理视图父数据，清除其他参数
     * 
     * @memberof IBizGridView9Controller
     */
    public onInited(): void {
        super.onInited();
        if (this.parentmode && !Object.is(this.parentmode, '') && typeof this.parentmode === 'object') {
            this.addViewParam(this.parentmode);
        }

        if (this.$viewParam && this.$viewParam.srfkey) {
            delete this.$viewParam.srfkey;
        }
    }

    /**
     * 视图部件加载,不提供预加载方法
     * 
     * @param {*} [opt={}] 
     * @memberof IBizGridView9Controller
     */
    public load(opt: any = {}): void {

    }

    /**
     * 部件加载完成
     * 
     * @param {Array<any>} args 
     * @memberof IBizGridView9Controller
     */
    public onStoreLoad(args: Array<any>): void {
        super.onStoreLoad(args);

        if (args.length > 0) {
            setTimeout(() => {
                this.$selectItem = {};
                Object.assign(this.$selectItem, { srfparentkey: args[args.length - 1].srfkey });
            }, 1);
        }
    }

    /**
     * 选中值变化
     * 
     * @param {Array<any>} args 
     * @memberof IBizGridView9Controller
     */
    public onSelectionChange(args: Array<any>): void {
        if (args.length > 0) {
            this.$selectItem = {};
            Object.assign(this.$selectItem, { srfparentkey: args[args.length - 1].srfkey });
        }
        super.onSelectionChange(args);
    }
}
