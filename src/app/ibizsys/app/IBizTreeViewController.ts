import { IBizMDViewController } from './IBizMDViewController';
import { IBizEvent } from '../IBizEvent';

/**
 * 树视图视图控制器
 * 
 * @export
 * @class IBizTreeViewController
 * @extends {IBizMDViewController}
 */
export class IBizTreeViewController extends IBizMDViewController {

    /**
     * 所有选中树数据
     * 
     * @type {*}
     * @memberof IBizTreeViewController
     */
    public $selectedDatas: Array<any> = [];

    /**
     * 当前选中树数据
     * 
     * @type {*}
     * @memberof IBizTreeViewController
     */
    public $selectedData: any = {};

    /**
     * Creates an instance of IBizTreeViewController.
     * 创建 IBizTreeViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizTreeViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 部件初始化
     * 
     * @memberof IBizTreeViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const tree = this.getTree();
        if (tree) {
            // 树加载完成
            tree.on(IBizEvent.IBizTree_CONTEXTMENU, (datas) => {
                this.onTreeLoad(datas);
            });
            // 数据选中
            tree.on(IBizEvent.IBizTree_SELECTIONCHANGE, (datas) => {
                this.onSelectionChange(datas);
            });
            // 数据激活
            tree.on(IBizEvent.IBizTree_DATAACTIVATED, (datas) => {
                this.onDataActivated(datas);
            });
        }
    }

    /**
     * 获取多数据部件
     * 
     * @returns {*} 
     * @memberof IBizTreeViewController
     */
    public getMDCtrl(): any {
        return this.getTree();
    }

    /**
     * 获取数部件
     * 
     * @returns {*} 
     * @memberof IBizTreeViewController
     */
    public getTree(): any {
        return undefined;
    }

    /**
     * 数据部件数据加载完成
     * 
     * @param {Array<any>} args 
     * @memberof IBizTreeViewController
     */
    public onTreeLoad(args: Array<any>): void {

    }

    /**
     * 值选中变化
     * 
     * @param {Array<any>} args 
     * @memberof IBizTreeViewController
     */
    public onSelectionChange(args: Array<any>): void {
        if (args.length > 0) {
            const record = args[0];
            const selectedData = { srfkey: record.srfkey, srfmajortext: record.srfmajortext };
            this.$selectedData = selectedData;

            this.$selectedDatas = [];
            args.forEach((item, index) => {
                const _record = item;
                const _selectedData: any = { srfkey: _record.srfkey, srfmajortext: _record.srfmajortext };
                if (index === 0) {
                    this.$selectedData = _selectedData;
                }
                this.$selectedDatas.push(_selectedData);
            });
        } else {
            this.$selectedData = {};
            this.$selectedDatas = [];
        }
        super.onSelectionChange(args);
    }

}
