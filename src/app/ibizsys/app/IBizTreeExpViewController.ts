import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { IBizMainViewController } from './IBizMainViewController';
import { IBizExpTab } from '../widget/IBizExpTab';
import { IBizEvent } from '../IBizEvent';

/**
 * 树导航视图控制器
 * 
 * @export
 * @class IBizTreeExpViewController
 * @extends {IBizMainViewController}
 */
export class IBizTreeExpViewController extends IBizMainViewController {

    /**
     * 
     * 
     * @type {string}
     * @memberof IBizTreeExpViewController
     */
    public $treeReloadMode: string = '';

    /**
     * 导航分页对象
     * 
     * @type {IBizExpTabService}
     * @memberof IBizTreeExpViewController
     */
    public exptab: IBizExpTab;

    /**
     * 导航路由事件
     *
     * @private
     * @type {*}
     * @memberof IBizTreeExpViewController
     */
    private $expRouteRvents: any;

    /**
     * Creates an instance of IBizTreeExpViewController.
     * 创建 IBizTreeExpViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizTreeExpViewController
     */
    constructor(opts: any = {}) {
        super(opts);

        this.exptab = new IBizExpTab({
            name: 'exptab',
            nzModalService: opts.nzModalService,
            nzModalRef: opts.nzModalRef,
            viewController: this,
            url: opts.url,
            iBizNotification: this.$iBizNotification,
        });
        this.$controls.set('exptab', this.exptab);
    }

    /**
     * 部件初始化
     * 
     * @memberof IBizTreeExpViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const treeExpBar = this.getTreeExpBar();
        if (treeExpBar) {
            treeExpBar.on(IBizEvent.IBizTreeExpBar_SELECTIONCHANGE).subscribe((data) => {
                this.treeExpBarSelectionChange(data);
            });
        }

        this.$expRouteRvents = this.$router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe((evt: NavigationEnd) => {
            const _treeExpBar = this.getTreeExpBar();
            if ((!_treeExpBar) || (!this.isInited()) || (Object.keys(this.$activatedRouteData).length === 0)) {
                return;
            }

            const childRouteData: any = this.$iBizApp.getActivatedRouteDatas(this.$activatedRouteData.index + 1);
            if (Object.keys(childRouteData).length > 0) {
                return;
            } else {
                const _tree = _treeExpBar.getTree();
                if (!_tree) {
                    return;
                }
                const nodes: Array<any> = _tree.getNodes();
                if (nodes.length === 0) {
                    return;
                }
                _treeExpBar.onTreeContextMenu(nodes);
            }
        });
    }

    /**
     * 视图销毁
     *
     * @memberof IBizTreeExpViewController
     */
    public onDestroy(): void {
        super.onDestroy();
        if (this.$expRouteRvents) {
            this.$expRouteRvents.unsubscribe();
        }
    }

    /**
     * 获取导航部件服务对象
     * 
     * @returns {*} 
     * @memberof IBizTreeExpViewController
     */
    public getTreeExpBar(): any {
        return this.$controls.get('treeexpbar');
    }

    /**
     * 获取导航分页部件服务对象
     * 
     * @returns {*} 
     * @memberof IBizTreeExpViewController
     */
    public getExpTab(): any {
        return this.$controls.get('exptab');
    }

    /**
     * 
     * 
     * @param {*} [uiaction={}] 
     * @param {*} [params={}] 
     * @returns {void} 
     * @memberof IBizTreeExpViewController
     */
    public doDEUIAction(uiaction: any = {}, params: any = {}): void {

        this.$treeReloadMode = '';
        if (Object.is(uiaction.tag, 'Remove')) {
            this.doRemove(params);
            return;
        }
        if (Object.is(uiaction.tag, 'Refresh')) {
            this.doTreeRefresh(params);
            return;
        }
        if (Object.is(uiaction.tag, 'New')) {
            this.doNew(params);
            return;
        }
        if (Object.is(uiaction.tag, 'EDITDATA')) {
            this.doEdit(params);
            return;
        }
        if (Object.is(uiaction.tag, 'Copy')) {
            this.doCopy(params);
            return;
        }
        super.doDEUIAction(uiaction, params);
    }

    /**
     * 新建操作
     * 
     * @param {any} params 
     * @memberof IBizTreeExpViewController
     */
    public doNew(params): void {

        this.onNewData(params);
    }

    /**
     * 拷贝操作
     * 
     * @param {any} params 
     * @memberof IBizTreeExpViewController
     */
    public doCopy(params): void {

        const arg = {
            data: params,
            srfcopymode: true
        };
        this.onEditData(arg);
    }

    /**
     * 编辑操作
     * 
     * @param {*} params 
     * @returns {void} 
     * @memberof IBizTreeExpViewController
     */
    public doEdit(params: any): void {

        // 获取要编辑的数据集合
        if (params && params.srfkey) {
            // tslint:disable-next-line:prefer-const
            let arg = { data: params };
            this.onEditData(arg);
            return;
        }
    }

    /**
     * 查看操作
     * 
     * @param {any} params 
     * @memberof IBizTreeExpViewController
     */
    public doView(params): void {
        this.doEdit(params);
    }

    /**
     * 删除操作
     * 
     * @param {*} params 
     * @memberof IBizTreeExpViewController
     */
    public doRemove(params: any): void {
        this.onRemove(params);
    }

    /**
     * 刷新操作
     * 
     * @param {*} params 
     * @memberof IBizTreeExpViewController
     */
    public doTreeRefresh(params: any): void {
        this.onTreeRefresh(params);
    }

    /**
     * 新建数据
     * 
     * @param {*} arg 
     * @returns {void} 
     * @memberof IBizTreeExpViewController
     */
    public onNewData(arg: any): void {

        this.$treeReloadMode = IBizEvent.TreeExpViewControllerBase_REFRESHMODE_CURRENTNODE;
        // tslint:disable-next-line:prefer-const
        let loadParam: any = {};
        if (this.getViewParam()) {
            Object.assign(loadParam, this.getViewParam());
        }
        if (this.getParentMode()) {
            Object.assign(loadParam, this.getParentMode());
        }
        if (this.getParentData()) {
            Object.assign(loadParam, this.getParentData());
        }
        if (this.isEnableBatchAdd()) {
            this.doNewDataBatch(loadParam);
            return;
        }
        if (this.doNewDataWizard(loadParam)) {
            return;
        }

        // tslint:disable-next-line:prefer-const
        let newMode = this.getNewMode(arg);
        if (newMode) {
            loadParam.srfnewmode = newMode;
        }
        this.doNewDataNormal(loadParam, arg);
    }

    /**
     * 批量新建
     * 
     * @param {*} arg 
     * @returns {boolean} 
     * @memberof IBizTreeExpViewController
     */
    public doNewDataBatch(arg: any): boolean {
        return false;
    }

    /**
     * 批量新建关闭
     * 
     * @param {*} win 
     * @returns {void} 
     * @memberof IBizTreeExpViewController
     */
    public onMPickupWindowClose(win: any): void {
    }

    /**
     * 批量添加数据
     * 
     * @param {*} selectedDatas 
     * @returns {string} 
     * @memberof IBizTreeExpViewController
     */
    public addDataBatch(selectedDatas: any): string {
        return '';
    }

    /**
     * 向导新建数据
     * 
     * @param {*} arg 
     * @returns {boolean} 
     * @memberof IBizTreeExpViewController
     */
    public doNewDataWizard(arg: any): boolean {
        return false;
    }

    /**
     * 向导新建数据窗口关闭
     * 
     * @param {any} win 
     * @param {any} eOpts 
     * @returns {void} 
     * @memberof IBizTreeExpViewController
     */
    public onNewDataWizardWindowClose(win, eOpts): void {
        return;
    }

    /**
     * 常规新建数据
     * 
     * @param {any} arg 
     * @param {any} params 
     * @returns {boolean} 
     * @memberof IBizTreeExpViewController
     */
    public doNewDataNormal(arg, params): boolean {

        // tslint:disable-next-line:prefer-const
        let view = this.getNewDataView(arg);
        if (view == null) {
            return false;
        }
        if (params && view.viewparam && view.viewparam.srfparenttype) {
            // tslint:disable-next-line:prefer-const
            let parentType = view.viewparam.srfparenttype;
            if (Object.is(parentType, 'DER1N')) {
                view.viewparam.srfparentkey = params.srfkey;
            }
        }
        return this.openDataView(view);
    }

    /**
     * 编辑数据
     * 
     * @param {any} arg 
     * @memberof IBizTreeExpViewController
     */
    public onEditData(arg): void {

        this.$treeReloadMode = IBizEvent.TreeExpViewControllerBase_REFRESHMODE_PARENTNODE;
        // tslint:disable-next-line:prefer-const
        let loadParam: any = {};
        if (this.getViewParam()) {
            Object.assign(loadParam, this.getViewParam());
        }
        if (this.getParentMode()) {
            Object.assign(loadParam, this.getParentMode());
        }
        if (this.getParentData()) {
            Object.assign(loadParam, this.getParentData());
        }
        if (arg.srfcopymode) {
            Object.assign(loadParam, {
                srfsourcekey: arg.data.srfkey
            });
        } else {
            Object.assign(loadParam, { srfkey: arg.data.srfkey });
        }

        // tslint:disable-next-line:prefer-const
        let editMode = this.getEditMode(arg.data);
        if (editMode) {
            loadParam.srfeditmode = editMode;
        }
        if (arg.data.srfmstag) {
            loadParam.srfeditmode2 = arg.data.srfmstag;
        }

        this.doEditDataNormal(loadParam);
    }

    /**
     * 执行常规编辑数据
     * 
     * @param {any} arg 
     * @returns {boolean} 
     * @memberof IBizTreeExpViewController
     */
    public doEditDataNormal(arg): boolean {

        // tslint:disable-next-line:prefer-const
        let view = this.getEditDataView(arg);
        if (view == null) {
            return false;
        }
        return this.openDataView(view);
    }

    /**
     * 打开数据视图
     * 
     * @param {any} view 
     * @returns {boolean} 
     * @memberof IBizTreeExpViewController
     */
    public openDataView(view): boolean {
        return true;
    }

    /**
     * 
     * 
     * @param {any} params 
     * @returns {void} 
     * @memberof IBizTreeExpViewController
     */
    public onRemove(params): void {
    }

    /**
     * 界面操作树节点刷新
     * 
     * @param {any} params 
     * @memberof IBizTreeExpViewController
     */
    public onTreeRefresh(params): void {
    }

    /**
     * 视图刷新操作
     * 
     * @returns {void} 
     * @memberof IBizTreeExpViewController
     */
    public onRefresh(): void {

        let node;
        if (Object.is(this.$treeReloadMode, IBizEvent.TreeExpViewControllerBase_REFRESHMODE_NONE)) {
            return;
        } else if (Object.is(this.$treeReloadMode, IBizEvent.TreeExpViewControllerBase_REFRESHMODE_CURRENTNODE)) {
            // tslint:disable-next-line:prefer-const
            let nodes = this.getSelected(true);
            if (nodes && nodes.length > 0) {
                node = nodes[0];
            }
        } else if (Object.is(this.$treeReloadMode, IBizEvent.TreeExpViewControllerBase_REFRESHMODE_PARENTNODE)) {
            // tslint:disable-next-line:prefer-const
            let nodes = this.getSelected(true);
            if (nodes && nodes.length > 0) {
                node = nodes[0].parent;
            }
        }

        // 刷新树节点
        // this.getTreeExpBar().getTree().reload(node);
    }

    /**
     * 
     * 
     * @param {any} bFull 
     * @returns {*} 
     * @memberof IBizTreeExpViewController
     */
    public getSelected(bFull): any {

        // tslint:disable-next-line:prefer-const
        let nodes = this.getTreeExpBar().getTree().getSelected(bFull);
        return nodes;
    }

    /**
     * 获取新建模式
     * 
     * @param {*} data 
     * @returns {string} 
     * @memberof IBizTreeExpViewController
     */
    public getNewMode(data: any): string {
        return 'NEWDATA@' + data.srfnodetype.toUpperCase();
    }

    /**
     * 获取编辑模式
     * 
     * @param {*} data 
     * @returns {string} 
     * @memberof IBizTreeExpViewController
     */
    public getEditMode(data: any): string {
        return 'EDITDATA@' + data.srfnodetype.toUpperCase();
    }

    /**
     * 获取编辑视图
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizTreeExpViewController
     */
    public getEditDataView(arg): any {

        return this.getEditDataView(arg);
    }

    /**
     * 获取新建视图
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizTreeExpViewController
     */
    public getNewDataView(arg): any {

        return this.getNewDataView(arg);
    }

    /**
     * 获取新建向导视图
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizTreeExpViewController
     */
    public getNewDataWizardView(arg): any {
        return null;
    }

    /**
     * 获取多选视图
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizTreeExpViewController
     */
    public getMPickupView(arg): any {
        return null;
    }

    /**
     * 
     * 
     * @param {any} arg 
     * @memberof IBizTreeExpViewController
     */
    public doBackendUIAction(arg): void {
    }

    /**
     * 
     * 
     * @returns {boolean} 
     * @memberof IBizTreeExpViewController
     */
    public isEnableBatchAdd(): boolean {
        return false;
    }

    /**
     * 
     * 
     * @returns {boolean} 
     * @memberof IBizTreeExpViewController
     */
    public isBatchAddOnly(): boolean {
        return false;
    }

    /**
     * 
     * 
     * @param {*} [uiaction={}] 
     * @param {*} [params={}] 
     * @returns {*} 
     * @memberof IBizTreeExpViewController
     */
    public getBackendUIActionParam(uiaction: any = {}, params: any = {}): any {

        if (Object.is(uiaction.actiontarget, 'SINGLEKEY') || Object.is(uiaction.actiontarget, 'MULTIKEY')) {
            const node = null;

            const keys = params.srfkey;
            const dataInfo = params.srfmajortext;
            const nodeType = params.srfnodetype;
            return { srfkeys: keys, srfkey: keys, dataInfo: dataInfo, srfnodetype: nodeType };
        }
        return {};
    }

    /**
     * 树导航部件选中变化
     * 
     * @param {*} [data={}] 
     * @memberof IBizTreeExpViewController
     */
    public treeExpBarSelectionChange(data: any = {}): void {
        if (!data || Object.keys(data).length === 0 || !data.viewid) {
            return;
        }
        const routeString: string = data.viewid;
        if (!this.hasChildRoute(routeString.toLocaleLowerCase())) {
            return;
        }
        // tslint:disable-next-line:prefer-const
        let viewParam: any = data.viewParam;
        Object.assign(viewParam, { refreshView: true });
        this.openView(routeString.toLocaleLowerCase(), viewParam);
    }

    /**
     * 是否子路由
     *
     * @private
     * @param {string} link
     * @returns {boolean}
     * @memberof IBizTreeExpViewController
     */
    private hasChildRoute(link: string): boolean {
        // tslint:disable-next-line:no-inferrable-types
        let hasChildRoute: boolean = true;
        if (this.$activatedRoute && this.$activatedRoute.routeConfig && this.$activatedRoute.routeConfig.children !== null) {
            const child: Array<any> = this.$activatedRoute.routeConfig.children.filter(item => Object.is(item.path, link.toLocaleLowerCase()));
            if (child.length === 0) {
                hasChildRoute = false;
            }
        }
        return hasChildRoute;
    }

}


