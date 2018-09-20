import { IBizEvent } from './../ibiz-event';
import { IBizControl } from './ibiz-control';

/**
 * 树导航部件
 * 
 * @export
 * @class IBizTreeExpBar
 * @extends {IBizControl}
 */
export class IBizTreeExpBar extends IBizControl {

    /**
     * 导航树节点数据
     * 
     * @private
     * @type {*}
     * @memberof IBizTreeExpBar
     */
    private node: any;

    /**
     * 导航树对象
     * 
     * @private
     * @type {*}
     * @memberof IBizTreeExpBar
     */
    private tree: any;

    /**
     * Creates an instance of IBizTreeExpBar.
     * 创建 IBizTreeExpBar 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizTreeExpBar
     */
    constructor(opts: any = {}) {
        super(opts);

        const viewController = this.getViewController();
        if (viewController) {
            viewController.on(IBizEvent.IBizViewController_INITED).subscribe(() => {
                const tree = viewController.$controls.get(this.getName() + '_tree');
                this.tree = tree;
                if (this.tree) {
                    this.tree.on(IBizEvent.IBizTree_SELECTIONCHANGE).subscribe((args) => {
                        this.onTreeSelectionChange(args);
                    });

                    this.tree.on(IBizEvent.IBizTree_CONTEXTMENU).subscribe((args) => {
                        this.onTreeContextMenu(args);
                    });
                    this.tree.load({});
                }
            });
        }
    }

    /**
     * 获取树控件
     * 
     * @returns {*} 
     * @memberof IBizTreeExpBar
     */
    public getTree(): any {
        const viewController = this.getViewController();
        if (viewController) {
            return viewController.$controls.get(this.getName() + '_tree');
        }
        return undefined;
    }

    /**
     * 获取导航分页部件服务对象
     * 
     * @returns {*} 
     * @memberof IBizTreeExpBar
     */
    public getExpTab(): any {
        const viewController = this.getViewController();
        if (viewController) {
            return viewController.$controls.get('exptab');
        }
        return undefined;
    }

    /**
     * 获取树配置信息
     * 
     * @returns {*} 
     * @memberof IBizTreeExpBar
     */
    public getTreeCfg(): any {
        return undefined || {};
    }

    /**
     * 获取到导航嵌入
     * 
     * @returns {*} 
     * @memberof IBizTreeExpBar
     */
    public getExpFrame(): any {
        return undefined;
    }

    /**
     * 获取  PickupviewpanelService （选择视图面板部件服务对象）
     * 判断视图视图类型
     * 
     * @returns {*} 
     * @memberof IBizTreeExpBar
     */
    public getPVPanel(): any {
        const viewController = this.getViewController();
        if (viewController) {
            return viewController.$controls.get('pickupviewpanel');
        }
        return undefined;
    }

    /**
     * 节点选中变化
     * 
     * @param {Array<any>} records 
     * @returns {void} 
     * @memberof IBizTreeExpBar
     */
    public onTreeSelectionChange(records: Array<any>): void {


        if (!records || records.length === 0) {
            return;
        }

        const record: any = records[0];

        this.setTreeSelect(record);

        // 替换键值
        const nodeids: Array<any> = record.id.split(';');
        const nodetext: string = record.text;
        const nodetag: string = record.nodetag;
        const nodetag2: string = record.nodetag2;
        const nodetag3: string = record.nodetag3;
        const nodetag4: string = record.nodetag4;

        const controller = this.getViewController();
        if (this.getExpTab()) {
            const viewarg: any = { viewid: record.srfnodetype };
            const viewItem: any = controller.getExpItemView(viewarg);
            if (!viewItem) {
                this.fire(IBizEvent.IBizTreeExpBar_SELECTIONCHANGE, { viewid: record.srfnodetype, viewParam: {} });
                return;
            }

            // tslint:disable-next-line:prefer-const
            let viewParam = {};
            if (viewItem.viewparam) {
                Object.assign(viewParam, viewItem.viewparam);
            }

            for (const key in viewParam) {
                if (viewParam.hasOwnProperty(key)) {
                    let value = viewParam[key];
                    if (value) {
                        value = value.replace(new RegExp('%NODETEXT%', 'g'), nodetext);
                        if (nodetag && !Object.is(nodetag, '')) {
                            value = value.replace(new RegExp('%NODETAG%', 'g'), nodetag);
                        }
                        if (nodetag2 && !Object.is(nodetag2, '')) {
                            value = value.replace(new RegExp('%NODETAG2%', 'g'), nodetag2);
                        }
                        if (nodetag3 && !Object.is(nodetag3, '')) {
                            value = value.replace(new RegExp('%NODETAG3%', 'g'), nodetag3);
                        }
                        if (nodetag4 && !Object.is(nodetag4, '')) {
                            value = value.replace(new RegExp('%NODETAG4%', 'g'), nodetag4);
                        }
                        // 进行替换
                        for (let i = 1; i < nodeids.length; i++) {
                            value = value.replace(new RegExp('%NODEID' + ((i === 1) ? '' : i.toString()) + '%', 'g'), nodeids[i]);
                        }
                        viewParam[key] = value;
                    }
                }
            }

            this.fire(IBizEvent.IBizTreeExpBar_SELECTIONCHANGE, { viewid: record.srfnodetype, viewParam: viewParam });
            return;
        }

        if (this.getPVPanel()) {
            // tslint:disable-next-line:prefer-const
            let viewarg: any = { nodetype: record.srfnodetype };
            // tslint:disable-next-line:prefer-const
            let viewParam = controller.getNavViewParam(viewarg);
            if (!viewParam) {
                return;
            }

            for (const key in viewParam) {
                if (viewParam.hasOwnProperty(key)) {
                    let value = viewParam[key];
                    if (value) {
                        value = value.replace(new RegExp('%NODETEXT%', 'g'), nodetext);
                        if (nodetag && !Object.is(nodetag, '')) {
                            value = value.replace(new RegExp('%NODETAG%', 'g'), nodetag);
                        }
                        if (nodetag2 && !Object.is(nodetag2, '')) {
                            value = value.replace(new RegExp('%NODETAG2%', 'g'), nodetag2);
                        }
                        if (nodetag3 && !Object.is(nodetag3, '')) {
                            value = value.replace(new RegExp('%NODETAG3%', 'g'), nodetag3);
                        }
                        if (nodetag4 && !Object.is(nodetag4, '')) {
                            value = value.replace(new RegExp('%NODETAG4%', 'g'), nodetag4);
                        }
                        // 进行替换
                        for (let i = 1; i < nodeids.length; i++) {
                            value = value.replace(new RegExp('%NODEID' + ((i === 1) ? '' : i.toString()) + '%', 'g'), nodeids[i]);
                        }
                        viewParam[key] = value;
                    }
                }
            }

            this.getPVPanel().setParentData(viewParam);
            // this.fire(IBizEvent.IBizTreeExpBar_SELECTIONCHANGE, { viewid: record.srfnodetype, viewParam: viewParam });
            return;
        }

        if (this.getExpFrame()) {
            // var viewarg = { viewid: tag.srfnodetype };
            // var viewItem = controller.getExpItemView(viewarg);
            // if (viewItem == null)
            //     return;

            // var viewParam = {};
            // if (viewItem.viewparam) {
            //     $.extend(viewParam, viewItem.viewparam);
            // }


            // for (var key in viewParam) {
            //     var value = viewParam[key];
            //     if (value) {
            //         value = value.replace(new RegExp('%NODETEXT%', 'g'), nodetext);
            //         //进行替换
            //         for (var i = 1; i < nodeids.length; i++) {
            //             value = value.replace(new RegExp('%NODEID' + ((i == 1) ? '' : i.toString()) + '%', 'g'), nodeids[i]);
            //         }
            //         viewParam[key] = value;
            //     }
            // }

            // var url = $.getIBizApp().parseURL(BASEURL, viewItem.viewurl, {});
            // url += '&' + $.param({ 'srfifchild': true, 'srfparentdata': JSON.stringify(viewParam) });
            // this.getExpFrame().attr('src', url);
            // return;
        }
    }

    /**
     * 树内容菜单
     *
     * @param {Array<any>} nodes
     * @memberof IBizTreeExpBar
     */
    public onTreeContextMenu(nodes: Array<any>): void {
        this.node = {};
        if (nodes.length > 0) {
            Object.assign(this.node, nodes[0]);
            this.onTreeSelectionChange([this.node]);
        }
    }

    /**
     * 设置树选中数据
     *
     * @private
     * @param {*} [item={}]
     * @memberof IBizTreeExpBar
     */
    private setTreeSelect(item: any = {}): void {
        const viewController = this.getViewController();
        if (viewController) {
            const tree = viewController.$controls.get(this.getName() + '_tree');
            this.tree = tree;
            if (this.tree) {
                this.tree.setSelectTreeItem(item);
            }
        }
    }

    /**
     * 获取计数器名称，在发布器中重写
     *
     * @returns {string}
     * @memberof IBizTreeExpBar
     */
    public getUICounterName(): string {
        return undefined;
    }

}
