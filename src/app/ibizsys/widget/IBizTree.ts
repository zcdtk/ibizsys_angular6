import { IBizControl } from './IBizControl';
import { IBizEvent } from '../IBizEvent';

/**
 * 树部件服务对象
 * 
 * @export
 * @class IBizTree
 * @extends {IBizControl}
 */
export class IBizTree extends IBizControl {

    /**
     * 树部件是否收缩，默认展开
     * 
     * @type {boolean}
     * @memberof IBizTree
     */
    public $isCollapsed: boolean = true;

    /**
     * 数据项节点集合
     * 
     * @type {Array<any>}
     * @memberof IBizTree
     */
    public $items: Array<any> = [];

    /**
     * 默认节点
     * 
     * @private
     * @type {*}
     * @memberof IBizTree
     */
    private node: any = {};

    /**
     * 树节点操作行为处理
     * 
     * @memberof IBizTree
     */
    public options = {
        getChildren: (node: any) => {
            if (node && node.data) {
                this.node = node.data;
            }
            return new Promise((resolve, reject) => {
                this.loadChildren(resolve);
            });
        }
    };

    /**
     * Creates an instance of IBizTree.
     * 创建 IBizTree 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizTree
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 加载节点数据
     * 
     * @param {*} [treeCfg={}] 
     * @memberof IBizTree
     */
    public load(treeCfg: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let param: any = {
            srfnodeid: this.node.id ? this.node.id : '#', srfaction: 'fetch', srfrender: 'JSTREE',
            srfviewparam: JSON.stringify(this.getViewController().getViewParam()),
            srfctrlid: this.getName()
        };

        this.post(param).subscribe((result) => {
            if (result.ret !== 0) {
                this.$iBizNotification.error('错误', result.info);
                return;
            }
            this.$items = this.formatTreeData(result.items);
            this.fire(IBizEvent.IBizTree_CONTEXTMENU, this.$items);
        }, (error) => {
            this.$iBizNotification.error('错误', error.info);
        });
    }

    /**
     * 获取选择节点数据
     * 
     * @param {any} bFull true：返回的数据包含节点全部数据，false：返回的数据仅包含节点ID
     * @returns {*} 
     * @memberof IBizTree
     */
    public getSelected(bFull: boolean): any {

    }

    /**
     * 获取所有节点数据
     *
     * @returns {Array<any>}
     * @memberof IBizTree
     */
    public getNodes(): Array<any> {
        return this.$items;
    }

    /**
     * 节点重新加载
     * 
     * @param {*} [node={}] 
     * @memberof IBizTree
     */
    public reload(node: any = {}): void {

    }

    /**
     * 删除节点
     * 
     * @param {any} node 
     * @memberof IBizTree
     */
    public remove(node: any): void {

    }

    /**
     * 实体界面行为
     * 
     * @param {any} params 
     * @memberof IBizTree
     */
    public doUIAction(params: any): void {

    }

    /**
     * 格式化树数据
     * 
     * @private
     * @param {Array<any>} items 
     * @returns {Array<any>} 
     * @memberof IBizTree
     */
    private formatTreeData(items: Array<any>): Array<any> {
        // tslint:disable-next-line:prefer-const
        let data: Array<any> = [];
        items.forEach((item) => {
            // tslint:disable-next-line:prefer-const
            let tempData: any = {};
            Object.assign(tempData, item);
            tempData.name = tempData.text;
            tempData.hasChildren = true;
            data.push(tempData);

        });
        return data;
    }

    /**
     * 树节点激活加载子数据
     *
     * @private
     * @param {*} resolve
     * @memberof IBizTree
     */
    private loadChildren(resolve: any): void {
        // tslint:disable-next-line:prefer-const
        let param: any = {
            srfnodeid: this.node.id ? this.node.id : '#', srfaction: 'fetch', srfrender: 'JSTREE',
            srfviewparam: JSON.stringify(this.getViewController().getViewParam()),
            srfctrlid: this.getName()
        };

        this.post2(param).subscribe((result) => {
            if (result.ret !== 0) {
                this.$iBizNotification.error('错误', result.info);
                resolve([]);
                this.node.hasChildren = false;
                return;
            }
            const _items = [...this.formatTreeData(result.items)];
            if (_items.length === 0) {
                this.node.hasChildren = false;
            }
            resolve(_items);

        }, (error) => {
            this.$iBizNotification.error('错误', error.info);
            this.node.hasChildren = false;
            resolve([]);
        });
    }

    /**
     * 树节点激活选中数据
     * 
     * @param {*} $event 
     * @memberof IBizTree
     */
    public onEvent($event: any): void {
        if ($event && Object.is($event.eventName, 'activate')) {
            this.fire(IBizEvent.IBizTree_SELECTIONCHANGE, [$event.node.data]);
        }
        if ($event && Object.is($event.eventName, 'deactivate')) {
            this.fire(IBizEvent.IBizTree_DATAACTIVATED, [$event.node.data]);
        }
    }
}
