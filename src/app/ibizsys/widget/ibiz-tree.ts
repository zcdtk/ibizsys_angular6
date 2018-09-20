import { NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';
import { IBizEvent } from './../ibiz-event';
import { IBizControl } from './ibiz-control';

/**
 * 树部件服务对象
 * 
 * @export
 * @class IBizTree
 * @extends {IBizControl}
 */
export class IBizTree extends IBizControl {

    /**
     * 数据项节点集合
     * 
     * @type {Array<any>}
     * @memberof IBizTree
     */
    public $items: Array<any> = [];

    /**
     * 树节点数据
     *
     * @type {Array<any>}
     * @memberof IBizTree
     */
    public $nodes: Array<any> = [];

    /**
     * 默认节点
     * 
     * @private
     * @type {*}
     * @memberof IBizTree
     */
    private node: any = {};

    /**
     * 选中数据项
     *
     * @type {Array<string>}
     * @memberof IBizTree
     */
    public $selectedKeys: Array<string> = [];

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
            this.$items = [...result.items];
            this.$items.forEach((item) => {
                this.$nodes.push(new NzTreeNode({ title: item.text, key: item.srfkey, children: [] }));
            });
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

    public mouseAction(name: string, e: NzFormatEmitEvent): void {
        if (!Object.is(name, 'expand') || (!e || !e.node || !e.node.origin)) {
            return;
        }
        if (e.node.getChildren().length !== 0 || !e.node.isExpanded) {
            return;
        }
        const node = e.node.origin;
        const _treeitem = this.getTreeItem(this.$items, node.key);
        if (Object.keys(_treeitem).length === 0) {
            return;
        }
        const param: any = {
            srfnodeid: _treeitem.id ? _treeitem.id : '#', srfaction: 'fetch', srfrender: 'JSTREE',
            srfviewparam: JSON.stringify(this.getViewController().getViewParam()),
            srfctrlid: this.getName()
        };

        this.post2(param).subscribe((result) => {
            if (result.ret !== 0) {
                return;
            }
            if (!result.items || !Array.isArray(result.items)) {
                return;
            }
            if (result.items.length === 0) {
                e.node.isLeaf = true;
            } else {
                // tslint:disable-next-line:prefer-const
                let data: Array<any> = [];
                result.items.forEach((item) => {
                    data.push({ title: item.text, key: item.srfkey, children: [] });
                });
                this.addTreeChildItems(this.$items, node.key, result.items);
                e.node.addChildren(data);
            }
        }, (error) => {
            this.$iBizNotification.error('错误', error.info);
        });
    }

    /**
     * 获取数据数据节点
     *
     * @private
     * @param {Array<any>} items
     * @param {string} srfkey
     * @returns {*}
     * @memberof IBizTree
     */
    private getTreeItem(items: Array<any>, srfkey: string): any {
        // tslint:disable-next-line:prefer-const
        let _item: any = {};
        items.some(item => {
            if (Object.is(item.srfkey, srfkey)) {
                Object.assign(_item, item);
                return true;
            }
            if (item.items) {
                const subItem = this.getTreeItem(item.items, srfkey);
                if (subItem && Object.keys(subItem).length > 0) {
                    Object.assign(_item, subItem);
                    return true;
                }
            }
        });
        return _item;
    }

    /**
     * 添加子节点数据值树数据中
     *
     * @private
     * @param {Array<any>} items
     * @param {string} srfkey
     * @param {Array<any>} childItems
     * @memberof IBizTree
     */
    private addTreeChildItems(items: Array<any>, srfkey: string, childItems: Array<any>): void {
        items.some(item => {
            if (Object.is(item.srfkey, srfkey)) {
                item.items = [];
                Object.assign(item, { items: childItems });
                return true;
            }
            if (item.items) {
                this.addTreeChildItems(item.items, srfkey, childItems);
            }
        });
    }

    /**
     * 设置树选中数据节点
     *
     * @private
     * @param {*} [item={}]
     * @memberof IBizTree
     */
    public setSelectTreeItem(item: any = {}): void {
        this.$selectedKeys = [];
        this.$selectedKeys.push(item.srfkey);
    }

    /**
     * 树节点激活选中数据
     *
     * @param {*} $event
     * @memberof IBizTree
     */
    public onEvent($event: any): void {
        if ($event && Object.is($event.eventName, 'click')) {
            const record = $event.node.origin;
            const _item = this.getTreeItem(this.$items, record.key);
            this.fire(IBizEvent.IBizTree_SELECTIONCHANGE, [_item]);
        }
    }
}

