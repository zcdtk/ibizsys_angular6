import { IBizMainViewController } from './IBizMainViewController';
import { IBizEvent } from '../IBizEvent';

/**
 * 多项数据视图控制器
 * 
 * @export
 * @class IBizMDViewController
 * @extends {IBizMainViewController}
 */
export class IBizMDViewController extends IBizMainViewController {

    /**
     * 当前数据主键
     * 
     * @type {string}
     * @memberof IBizMDViewController
     */
    public $currentDataKey: string = '';

    /**
     * 是否支持多选
     * 
     * @type {boolean}
     * @memberof IBizMDViewController
     */
    public $multiSelect: boolean = false;

    /**
     * 快速搜索值
     * 
     * @type {string}
     * @memberof IBizMDViewController
     */
    public $searchValue: string;

    /**
     * 父数据改变
     * 
     * @type {boolean}
     * @memberof IBizMDViewController
     */
    public $parentDataChanged: boolean = false;

    /**
     * 表格是否支持行编辑
     * 
     * @type {boolean}
     * @memberof IBizMDViewController
     */
    public $isInGridRowEdit: boolean = false;

    /**
     * 实体支持快速搜索属性
     * 
     * @type {Array<any>}
     * @memberof IBizMDViewController
     */
    public $quickSearchEntityDEFields: Array<any> = [];

    /**
     * 快速搜索提示信息
     * 
     * @type {string}
     * @memberof IBizMDViewController
     */
    public $quickSearchTipInfo: string = '';

    /**
     * Creates an instance of IBizMDViewController.
     * 创建 IBizMDViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizMDViewController
     */
    constructor(opts: any = {}) {
        super(opts);
        this.regQuickSearchDEFields();
    }

    /**
     * 初始化部件对象
     * 
     * @memberof IBizMDViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();

        this.$parentDataChanged = false;

        const mdctrl: any = this.getMDCtrl();
        if (mdctrl) {
            // 多数据部件选中
            mdctrl.on(IBizEvent.IBizMDControl_SELECTIONCHANGE).subscribe((args) => {
                this.onSelectionChange(args);
            });
            // 多数据部件加载之前
            mdctrl.on(IBizEvent.IBizMDControl_BEFORELOAD).subscribe((args) => {
                this.onStoreBeforeLoad(args);
            });
            // 多数据部件加载完成
            mdctrl.on(IBizEvent.IBizMDControl_LOADED).subscribe((args) => {
                this.onStoreLoad(args);
            });
            // 多数据部件状态改变
            mdctrl.on(IBizEvent.IBizMDControl_CHANGEEDITSTATE).subscribe((args) => {
                this.onGridRowEditChange(undefined, args, undefined);
            });
            // 多数据界面行为
            mdctrl.on(IBizEvent.IBizMDControl_UIACTION).subscribe((args) => {
                if (args.tag) {
                    this.doUIAction(args.tag, args.data);
                }
            });

            if (this.isEnableQuickSearch()) {
                const columns: any = mdctrl.getColumns();
                const columns_name: Array<any> = Object.keys(columns);
                let _quickFields: Array<any> = [];
                columns_name.forEach(name => {
                    const index: number = this.$quickSearchEntityDEFields.findIndex(item => Object.is(item.name, name));
                    if (index !== -1) {
                        _quickFields.push(columns[name].caption);
                    }
                });

                this.$quickSearchTipInfo = _quickFields.join('/');
            }
        }

        const searchform: any = this.getSearchForm();
        if (searchform) {
            // 搜索表单加载完成
            searchform.on(IBizEvent.IBizForm_FORMLOADED, (form) => {
                this.onSearchFormSearched(this.isLoadDefault());
            });
            // 搜索表单搜索触发，手动触发
            searchform.on(IBizEvent.IBizSearchForm_FORMSEARCHED, (args) => {
                this.onSearchFormSearched(true);
            });
            // 搜索表单重置
            searchform.on(IBizEvent.IBizSearchForm_FORMRESETED, (args) => {
                this.onSearchFormReseted();
            });
            // 搜索表单值变化
            searchform.on(IBizEvent.IBizForm_FORMFIELDCHANGED, (args) => {
                if (args == null) {
                    return;
                }
                this.onSearchFormFieldChanged(args.fieldname, args.data, args.oldvalue);
            });
            searchform.setOpen(!this.isEnableQuickSearch());
        }
    }


    /**
     * 多数据视图加载，加载部件
     * 
     * @memberof IBizMDViewController
     */
    public onLoad(): void {
        super.onLoad();
        if (this.getSearchForm()) {
            let viewparams: any = {};
            Object.assign(viewparams, this.getViewParam());
            this.getSearchForm().autoLoad(viewparams);
        } else if (this.isLoadDefault()) {
            this.load();
        }
    }

    /**
     * 加载多视图部件
     * 
     * @param {*} [opt={}] 
     * @memberof IBizMDViewController
     */
    public load(opt: any = {}): void {
        if (this.getMDCtrl()) {
            this.getMDCtrl().load(opt);
        }
    }

    /**
     * 执行快速搜索
     * 
     * @param {*} $event 
     * @memberof IBizMDViewController
     */
    public onQuickSearch($event: any): void {
        if (!$event || $event.keyCode !== 13) {
            return;
        }

        if (this.isEnableQuickSearch()) {
            this.onSearchFormSearched(true);
        }
    }

    /**
     * 搜索按钮执行搜索
     *
     * @memberof IBizMDViewController
     */
    public btnSearch(): void {
        if (this.isEnableQuickSearch()) {
            this.onSearchFormSearched(true);
        }
    }

    /**
     * 清空快速搜索值
     * 
     * @memberof IBizMDViewController
     */
    public clearQuickSearchValue(): void {
        this.$searchValue = undefined;
        this.onRefresh();
    }

    /**
     * 搜索表单打开
     * 
     * @returns {void} 
     * @memberof IBizMDViewController
     */
    public openSearchForm(): void {
        if (!this.isEnableQuickSearch()) {
            return;
        }
        const searchForm = this.getSearchForm();
        if (searchForm) {
            searchForm.setOpen(!searchForm.$opened);
        }
    }

    /**
     * 获取搜索表单对象
     * 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getSearchForm(): any {
        return undefined;
    }

    /**
     * 获取所有多项数据
     * 
     * @returns {Array<any>} 
     * @memberof IBizMDViewController
     */
    public getAllData(): Array<any> {

        if (this.getMDCtrl()) {
            return this.getMDCtrl().getAllData();
        }
        return [];
    }

    /**
     * 搜索表单属性值发生变化
     *
     * @param {string} fieldname
     * @memberof IBizMDViewController
     */
    public onSearchFormFieldChanged(fieldname: string): void {

    }

    /**
     * 表单项值检测
     *
     * @param {string} fieldname
     * @param {string} value
     * @memberof IBizMDViewController
     */
    public onSearchFormFieldValueCheck(fieldname: string, value: string): void {

    }

    /**
     * 数据加载之前
     *
     * @param {*} [args={}]
     * @memberof IBizMDViewController
     */
    public onStoreBeforeLoad(args: any = {}): void {

        let fetchParam: any = {};
        if (this.getViewParam() && Object.keys(this.getViewParam()).length > 0) {
            Object.assign(fetchParam, this.getViewParam());
        }
        if (this.getParentMode() && Object.keys(this.getParentMode()).length > 0) {
            Object.assign(fetchParam, this.getParentMode());
        }
        if (this.getParentData() && Object.keys(this.getParentData()).length > 0) {
            Object.assign(fetchParam, this.getParentData());
        }
        if ((this.getSearchForm() && this.getSearchCond() && this.getSearchForm().isOpen()) || !this.isEnableQuickSearch()) {
            Object.assign(fetchParam, this.getSearchCond());
        }
        // //是否有自定义查询
        // if (this.searchform && this.searchform.isCustomSearch()) {
        // 	Object.assign(fetchParam, this.searchform.getCustomSearchVal());
        // }

        // 获取快速搜索里的搜索参数
        if (this.isEnableQuickSearch() && this.$searchValue !== undefined) {
            Object.assign(fetchParam, { 'query': this.$searchValue });
        }
        Object.assign(args, fetchParam);
    }

    /**
     * 数据加载完成
     * 
     * @param {any} sender 
     * @param {any} args 
     * @param {any} e 
     * @memberof IBizMDViewController
     */
    public onStoreLoad(args): void {

        let lastActive = null;
        if (this.$currentDataKey != null && !Object.is(this.$currentDataKey, '') && args && args.items) {

            args.items.forEach(element => {
                if (Object.is(element.srfkey, this.$currentDataKey)) {
                    lastActive = element;
                    return false;
                }
            });
        }
        if (lastActive) {
            this.getMDCtrl().setSelection(lastActive);
            this.calcToolbarItemState(true, lastActive.srfdataaccaction);
        } else {
            this.$currentDataKey = null;
            // this.fireEvent(MDViewControllerBase.SELECTIONCHANGE, this, []);
            this.fire(IBizEvent.IBizMDViewController_SELECTIONCHANGE, []);
            this.calcToolbarItemState(false);
        }
        this.$parentDataChanged = false;

        this.reloadUICounters();
    }

    /**
     * 数据被激活<最典型的情况就是行双击>
     * 
     * @param {*} [record={}] 行记录
     * @returns {void} 
     * @memberof IBizMDViewController
     */
    public onDataActivated(record: any = {}): void {

        if (!record || !record.srfkey) {
            return;
        }
        this.fire(IBizEvent.IBizMDViewController_DATAACTIVATED, [record]);
        this.$currentDataKey = record.srfkey;

        this.calcToolbarItemState(true, record.srfdataaccaction);
        this.onEditData({ data: record });
    }

    /**
     * 行选择变化
     * 
     * @param {Array<any>} selected 
     * @memberof IBizMDViewController
     */
    public onSelectionChange(selected: Array<any>): void {

        if (selected == null || selected.length === 0) {
            this.$currentDataKey = null;
        } else {
            this.$currentDataKey = selected[0].srfkey;
        }
        this.fire(IBizEvent.IBizMDViewController_SELECTIONCHANGE, selected[0]);
        this.calcToolbarItemState(this.$currentDataKey != null, (this.$currentDataKey != null) ? selected[0].srfdataaccaction : null);
    }

    /**
     * 改变工具栏启用编辑按钮信息
     * 
     * @param {any} sender 
     * @param {any} args 
     * @param {any} e 
     * @memberof IBizMDViewController
     */
    public onGridRowEditChange(sender): void {
    }

    /**
     * 计算工具栏项状态-<例如 根据是否有选中数据,设置 工具栏按钮是否可点击>
     * 
     * @param {boolean} hasdata 是否有数据
     * @param {*} [dataaccaction] 
     * @memberof IBizMDViewController
     */
    public calcToolbarItemState(hasdata: boolean, dataaccaction?: any): void {
        super.calcToolbarItemState(hasdata, dataaccaction);
        const toolbar = this.getToolBar();
        if (!toolbar) {
            return;
        }

        if (Object.keys(toolbar.getItems()).length > 0) {
            const name_arr: Array<any> = Object.keys(toolbar.getItems());
            const btn_items = toolbar.getItems();
            name_arr.forEach((name) => {
                let item: any = btn_items[name];
                if (Object.is(item.tag, 'NewRow')) {
                    toolbar.setItemDisabled(name, false);
                }
            });
        }
    }

    /**
     * 实体数据发生变化
     *
     * @param {*} [dataaccaction={}]
     * @memberof IBizMDViewController
     */
    public onDataAccActionChange(dataaccaction: any = {}): void {
        const toolBar = this.getToolBar();
        if (!toolbar) {
            return;
        }
        toolBar.updateAccAction(Object.assign({}, this.$dataaccaction, dataaccaction));

        // if (this.getToolbar())
        //     this.getToolbar().updateAccAction(dataaccaction);
        // if (this.mintoolbar)
        //     this.mintoolbar.updateAccAction(dataaccaction);
        // if (this.floattoolbar)
        //     this.floattoolbar.updateAccAction(dataaccaction);
    }

    /**
     * 新建数据
     * 
     * @returns {void} 
     * @memberof IBizMDViewController
     */
    public onNewData(): void {

        let loadParam = {};
        if (this.getViewParam()) {
            Object.assign(loadParam, this.getViewParam());
        }
        if (this.getParentMode()) {
            Object.assign(loadParam, this.getParentMode());
        }
        if (this.getParentData()) {
            Object.assign(loadParam, this.getParentData());
        }
        if (this.isEnableRowEdit() && (this.getMDCtrl() && this.getMDCtrl().getOpenEdit())) {
            this.doNewRow(loadParam);
            return;
        }
        if (this.isEnableBatchAdd()) {
            this.doNewDataBatch(loadParam);
            return;
        }
        if (this.doNewDataWizard(loadParam)) {
            return;
        }
        this.doNewDataNormal(loadParam);
    }

    /**
     * 批量新建
     *
     * @param {*} [arg={}]
     * @returns {boolean}
     * @memberof IBizMDViewController
     */
    public doNewDataBatch(arg: any = {}): boolean {
        const mpickupview = this.getMPickupView(arg);
        if (mpickupview && !Object.is(mpickupview.className, '')) {
            this.openModal(mpickupview).subscribe((data) => {
                console.log(data);
                if (data && Object.is(data.ret, 'OK')) {
                    this.onMPickupWindowClose(data.selection);
                }
            });
            return true;
        }
        return false;
    }

    /**
     * 批量新建关闭
     *
     * @param {Array<any>} selection
     * @returns {void}
     * @memberof IBizMDViewController
     */
    public onMPickupWindowClose(selection: Array<any>): void {
        if (selection) {
            this.addDataBatch(selection);
        }
        return;
    }

    /**
     * 批量添加数据
     *
     * @param {Array<any>} selectedDatas
     * @memberof IBizMDViewController
     */
    public addDataBatch(selectedDatas: Array<any>): void {
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.WARN', '警告'), $IGM('MDVIEWCONTROLLER.ADDDATABATCH.INFO', '[addDataBatch]方法必须重写！'), 2);
        this.$iBizNotification.warning('警告', '[addDataBatch]方法必须重写！');
    }

    /**
     * 向导新建数据
     * 
     * @param {any} arg 
     * @returns {boolean} 
     * @memberof IBizMDViewController
     */
    public doNewDataWizard(arg): boolean {
        let hasWizardView = false;
        const wizardView = this.getNewDataWizardView(arg);
        if (wizardView) {

            // 打开模态框
            this.openModal(wizardView).subscribe((result) => {
                if (result && Object.is(result.ret, 'OK')) {
                    const data: any = result.selection[0];
                    this.doNewDataNormal(Object.assign({ srfnewmode: data.srfkey }, arg));
                }
            });
            hasWizardView = true;
        }

        return hasWizardView;
    }

    /**
     * 向导新建数据窗口关闭
     * 
     * @param {any} win 
     * @param {any} eOpts 
     * @returns {void} 
     * @memberof IBizMDViewController
     */
    public onNewDataWizardWindowClose(win, eOpts): void {
        // var this = win.scope;
        // var loadParam = {};//win.userData;
        // var dialogResult = win.dialogResult;
        // if (!dialogResult) return;
        // if (dialogResult == 'ok') {
        //     var selectedData = win.selectedData;
        //     if (selectedData) {
        //         var newMode = selectedData.srfkey;
        //         loadParam.srfnewmode = newMode;
        //         var view = this.getNewDataView(loadParam);
        //         if (view == null) {
        //             return;
        //         }
        //         this.openDataView(view);
        //     }
        // }
        // return;
    }

    /**
     * 常规新建数据
     *
     * @param {*} [arg={}]
     * @returns {*}
     * @memberof IBizMDViewController
     */
    public doNewDataNormal(arg: any = {}): any {

        let view = this.getNewDataView(arg);
        if (view == null) {
            return false;
        }
        // const openMode = view.openMode;
        // if (!openMode || Object.is(openMode, '')) {
        //     view.openMode = 'INDEXVIEWTAB';
        // }
        if (!view.routerlink || Object.is(view.routerlink, '')) {
            return false;
        }
        let viewParam: any = {};
        Object.assign(viewParam, view.viewParam);

        if (viewParam && viewParam.srfnewmode && !Object.is(viewParam.srfnewmode, '')) {
            const srfnewmode: string = viewParam.srfnewmode.split('@').join('__');
            view.routerlink = view.routerlink + '_' + srfnewmode.toLowerCase();
        }
        return this.openDataView(view);
    }

    /**
     * 编辑数据
     *
     * @param {*} [arg={}]
     * @memberof IBizMDViewController
     */
    public onEditData(arg: any = {}): void {

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
            Object.assign(loadParam, { srfkey: arg.data.srfkey, srfdeid: arg.data.srfdeid });
        }

        let editMode = this.getEditMode(arg.data);
        if (editMode) {
            loadParam.srfeditmode = editMode;
            loadParam.srfviewmode = editMode;
        }
        if (arg.data.srfmstag) {
            loadParam.srfeditmode2 = arg.data.srfmstag;
        }

        this.doEditDataNormal(loadParam);
    }

    /**
     * 执行常规编辑数据
     * 
     * @param {*} [arg={}] 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public doEditDataNormal(arg: any = {}): any {
        let view = this.getEditDataView(arg);
        if (view == null) {
            return false;
        }
        // let openMode = view.openMode;
        // if (!openMode || Object.is(openMode, '')) {
        //     view.openMode = 'INDEXVIEWTAB';
        // }
        if (!view.routerlink || Object.is(view.routerlink, '')) {
            return false;
        }
        let viewParam: any = {};
        Object.assign(viewParam, view.viewParam);

        if (Object.keys(viewParam).length > 0) {
            let srfeditmode: string = '';
            if (viewParam.srfeditmode && !Object.is(viewParam.srfeditmode, '')) {
                srfeditmode = viewParam.srfeditmode.split('@').join('__');
            }
            // 实体主状态
            if (viewParam.srfeditmode2 && !Object.is(viewParam.srfeditmode2, '') && !Object.is(viewParam.srfeditmode2, 'MSTAG:null')) {
                srfeditmode = viewParam.srfeditmode2.split(':').join('__');
            }

            if (!Object.is(srfeditmode, '')) {
                view.routerlink = `${view.routerlink}_${srfeditmode.toLowerCase()}`;
            }
        }

        return this.openDataView(view);
    }

    /**
     * 打开数据视图
     *
     * @param {*} [view={}]
     * @returns {boolean}
     * @memberof IBizMDViewController
     */
    public openDataView(view: any = {}): boolean {

        const openMode = view.openMode;

        if (view.redirect) {
            this.redirectOpenView(view);
            return false;
        }

        if (!openMode || Object.is(openMode, '') || Object.is(openMode, 'INDEXVIEWTAB')) {
            let data: any = {};
            Object.assign(data, view.viewParam);
            this.openView(view.routerlink, data);
            return false;
        }


        if (Object.is(openMode, 'POPUPMODAL')) {
            view.modal = true;
        } else if (Object.is(openMode, 'POPUP')) {
            view.modal = true;
        } else if (Object.is(openMode, '') || Object.is(openMode, 'INDEXVIEWTAB')) {
            view.modal = false;
        }

        if (!view.modal) {
            return false;
        }
        this.openModal(view).subscribe((result) => {
            if (result && Object.is(result.ret, 'OK')) {
                this.onRefresh();
            }
        });


        return true;
    }

    /**
     * 获取编辑模式
     * 
     * @param {any} data 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getEditMode(data): any {
        return data.srfdatatype;
    }

    /**
     * 获取编辑视图
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getEditDataView(arg): any {
        return undefined;
    }

    /**
     * 获取新建视图
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getNewDataView(arg): any {
        return undefined;
    }

    /**
     * 获取新建向导视图
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getNewDataWizardView(arg): any {
        return undefined;
    }

    /**
     * 获取多选视图
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getMPickupView(arg): any {
        return undefined;
    }

    /**
     * 获取多数据对象
     * 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getMDCtrl(): any {
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.WARN', '警告'), $IGM('MDVIEWCONTROLLER.GETMDCTRL.INFO', '[getMDCtrl]方法必须重写！'), 2);
        this.$iBizNotification.warning('警告', '[getMDCtrl]方法必须重写！');
    }

    /**
     * 视图刷新
     * 
     * @memberof IBizMDViewController
     */
    public onRefresh(): void {
        super.onRefresh();
        if (this.getMDCtrl()) {
            this.getMDCtrl().load();
        }
    }

    /**
     * 
     * 
     * @memberof IBizMDViewController
     */
    public onSetParentData(): void {
        super.onSetParentData();
        this.$parentDataChanged = true;
    }

    /**
     * 获取搜索条件
     * 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getSearchCond(): any {
        if (this.getSearchForm()) {
            return this.getSearchForm().getValues();
        }
        return undefined;
    }

    /**
     * 搜索表单搜索执行
     * 
     * @param {boolean} isload 是否加载数据
     * @memberof IBizMDViewController
     */
    public onSearchFormSearched(isload: boolean): void {
        if (this.getMDCtrl() && isload) {
            this.getMDCtrl().setCurPage(1);
            this.getMDCtrl().load();
        }
    }

    /**
     * 搜索表单重置完成
     * 
     * @memberof IBizMDViewController
     */
    public onSearchFormReseted(): void {
        if (this.getMDCtrl() && (!this.isLoadDefault())) {
            this.getMDCtrl().load();
        }
    }

    /**
     * 
     * 
     * @param {*} [uiaction={}] 
     * @param {*} [params={}] 
     * @returns {void} 
     * @memberof IBizMDViewController
     */
    public doDEUIAction(uiaction: any = {}, params: any = {}): void {

        if (Object.is(uiaction.tag, 'Help')) {
            this.doHelp(params);
            return;
        }
        if (Object.is(uiaction.tag, 'Edit')) {
            this.doEdit(params);
            return;
        }
        if (Object.is(uiaction.tag, 'View')) {
            this.doView(params);
            return;
        }
        if (Object.is(uiaction.tag, 'Print')) {

            this.doPrint(params);
            return;
        }
        if (Object.is(uiaction.tag, 'ExportExcel')) {
            this.doExportExcel(params);
            return;
        }
        if (Object.is(uiaction.tag, 'ExportModel')) {
            this.doExportModel(params);
            return;
        }
        if (Object.is(uiaction.tag, 'Copy')) {
            this.doCopy(params);
            return;
        }
        if (Object.is(uiaction.tag, 'Remove')) {
            this.doRemove(params);
            return;
        }
        if (Object.is(uiaction.tag, 'Import')) {
            this.doImport(params);
            return;
        }
        if (Object.is(uiaction.tag, 'Refresh')) {
            this.doRefresh(params);
            return;
        }
        if (Object.is(uiaction.tag, 'NewRow')) {
            this.doCheck(params);
            return;
        }
        if (Object.is(uiaction.tag, 'New')) {
            this.doNew(params);
            return;
        }
        if (Object.is(uiaction.tag, 'ToggleRowEdit')) {
            this.doToggleRowEdit(params);
            return;
        }
        super.doDEUIAction(uiaction, params);
    }

    /**
     * 多数据项界面_行编辑操作
     *
     * @param {*} [params={}]
     * @memberof IBizMDViewController
     */
    public doToggleRowEdit(params: any = {}): void {
        if (this.getMDCtrl() && typeof (this.getMDCtrl().isOpenEdit) === 'function') {
            this.getMDCtrl().isOpenEdit(params);
        }
    }

    /**
     * 多数据项界面_新建行操作
     *
     * @param {*} [params={}]
     * @memberof IBizMDViewController
     */
    public doNewRow(params: any = {}): void {
        if (this.getMDCtrl() && typeof (this.getMDCtrl().newRowAjax) === 'function') {
            this.getMDCtrl().newRowAjax(params);
        }
    }

    /**
     * 多数据项界面_检测行操作
     *
     * @param {*} [params={}]
     * @memberof IBizMDViewController
     */
    public doCheck(params: any = {}): void {
        if (this.getMDCtrl() && typeof (this.getMDCtrl().saveAllEditRow) === 'function') {
            this.getMDCtrl().saveAllEditRow();
        }
    }

    /**
     * 多数据项界面_帮助操作
     *
     * @param {*} [params={}]
     * @memberof IBizMDViewController
     */
    public doHelp(params: any = {}): void {
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.WARN', '警告'), $IGM('MDVIEWCONTROLLER.DOHELP.INFO', '帮助操作'), 0);
        this.$iBizNotification.warning('警告', '帮助操作');
    }

    /**
     * 多数据项界面_编辑操作
     *
     * @param {*} [params={}]
     * @returns {void}
     * @memberof IBizMDViewController
     */
    public doEdit(params: any = {}): void {
        // 获取要编辑的数据集合
        if (params && params.srfkey) {
            // if ($.isFunction(this.getMDCtrl().findItem)) {
            //     params = this.getMDCtrl().findItem('srfkey', params.srfkey);
            // }
            const arg = { data: params };
            this.onEditData(arg);
            return;
        }
        const selectedData = this.getMDCtrl().getSelection();
        if (selectedData == null || selectedData.length === 0) {
            return;
        }

        this.onEditData({ data: selectedData[0] });
    }

    /**
     * 多数据项界面_行编辑操作
     * 
     * @param {any} params 
     * @memberof IBizMDViewController
     */
    public doView(params): void {
        this.doEdit(params);
    }

    /**
     * 多数据项界面_打印操作
     * 
     * @param {any} params 
     * @memberof IBizMDViewController
     */
    public doPrint(params): void {

    }

    /**
     * 多数据项界面_导出操作（Excel）
     * 
     * @param {any} params 
     * @memberof IBizMDViewController
     */
    public doExportExcel(params): void {
        // if (params.itemtag == '') {

        // }
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.WARN', '警告'), $IGM('MDVIEWCONTROLLER.DOEXPORTEXCEL.INFO', '导出操作（Excel）'), 0);
        this.$iBizNotification.warning('警告', '导出操作（Excel）');
    }

    /**
     * 多数据项界面_导出数据模型
     * 
     * @param {any} params 
     * @memberof IBizMDViewController
     */
    public doExportModel(params): void {
        this.$iBizNotification.warning('警告', '导出数据模型');
    }

    /**
     * 多数据项界面_拷贝操作
     * 
     * @param {any} params 
     * @returns {void} 
     * @memberof IBizMDViewController
     */
    public doCopy(params): void {

        // 获取要拷贝的数据集合
        if (!this.getMDCtrl()) {
            return;
        }
        const selectedData = this.getMDCtrl().getSelection();
        if (selectedData == null || selectedData.length === 0) {
            return;
        }

        const arg = { data: selectedData[0], srfcopymode: true };
        this.onEditData(arg);
    }

    /**
     * 多数据项界面_删除操作
     * 
     * @param {any} params 
     * @memberof IBizMDViewController
     */
    public doRemove(params): void {
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.WARN', '警告'), $IGM('MDVIEWCONTROLLER.DOREMOVE.INFO', '删除操作'), 0);
        this.$iBizNotification.warning('警告', '删除操作');
    }

    /**
     * 多数据项界面_数据导入栏
     * 
     * @param {any} params 
     * @memberof IBizMDViewController
     */
    public doImport(params): void {
        if (this.getMDCtrl() && this.getDEName() !== '') {
            this.getMDCtrl().doImportData(this.getDEName());
        }
    }

    /**
     * 多数据项界面_刷新操作
     * 
     * @param {any} params 
     * @memberof IBizMDViewController
     */
    public doRefresh(params): void {
        this.onRefresh();
    }

    /**
     * 多数据项界面_新建操作
     * 
     * @param {any} params 
     * @memberof IBizMDViewController
     */
    public doNew(params): void {
        this.onNewData();
    }

    /**
     * 
     * 
     * @param {*} [uiaction={}] 
     * @param {*} [params={}] 
     * @memberof IBizMDViewController
     */
    public doWFUIAction(uiaction: any = {}, params: any = {}): void {
        if (Object.is(uiaction.actionmode, 'WFBACKEND')) {
            const selectedData = this.getMDCtrl().getSelection();
            if (selectedData == null || selectedData.length === 0) {
                return;
            }

            let keys = '';

            selectedData.forEach((element, index) => {
                let key: string = element.srfkey;
                if (!Object.is(keys, '')) {
                    keys += ';';
                }
                keys += key;
            });

            if (this.getMDCtrl()) {
                this.getMDCtrl().wfsubmit({ srfwfiatag: uiaction.tag, srfkeys: keys });
                return;
            }
        }
        super.doWFUIAction(uiaction, params);
    }

    /**
     * 
     * 
     * @param {any} win 
     * @param {any} data 
     * @memberof IBizMDViewController
     */
    public onWFUIFrontWindowClosed(win, data): void {
        // this.load();
        this.onRefresh();
    }

    /**
     * 获取UI操作参数
     * 
     * @param {*} [uiaction={}] 
     * @param {*} [params={}] 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getFrontUIActionParam(uiaction: any = {}, params: any = {}): any {

        let arg: any = {};
        const front_arg = super.getFrontUIActionParam(uiaction, params);
        if (front_arg) {
            Object.assign(arg, front_arg);
        }
        if (this.getParentMode()) {
            Object.assign(arg, this.getParentMode());
        }
        if (this.getParentData()) {
            Object.assign(arg, this.getParentData());
        }
        let target = 'NONE';
        if (uiaction.actiontarget) {
            target = uiaction.actiontarget;
        }
        if (!Object.is(target, 'NONE')) {
            const selectedData: Array<any> = this.getMDCtrl().getSelection();
            if (!(selectedData == null || selectedData.length === 0)) {

                let vlaueitem = 'srfkey';
                let paramkey = 'srfkeys';
                let paramjo = null;
                if (uiaction.actionparams) {
                    let actionparams = uiaction.actionparams;
                    vlaueitem = (actionparams.vlaueitem && !Object.is(actionparams.vlaueitem, '')) ? actionparams.vlaueitem.toLowerCase() : vlaueitem;
                    paramkey = (actionparams.paramitem && !Object.is(actionparams.paramitem, '')) ? actionparams.paramitem.toLowerCase() : paramkey;
                    paramjo = actionparams.paramjo ? actionparams.paramjo : {};
                }

                if (Object.is(target, 'SINGLEKEY')) {
                    arg[paramkey] = selectedData[0][vlaueitem];
                } else if (Object.is(target, 'SINGLEDATA')) {
                    Object.assign(arg, selectedData[0]);
                } else if (Object.is(target, 'MULTIKEY')) {
                    let keys = '';
                    selectedData.forEach(item => {
                        let key = item[vlaueitem];
                        if (!Object.is(keys, '')) {
                            keys += ';';
                        }
                        keys += key;
                    });
                    arg[paramkey] = keys;
                }

                if (paramjo) {
                    Object.assign(arg, paramjo);
                }
            }
        }
        return arg;
    }

    /**
     * 获取后天界面行为参数
     * 
     * @param {*} [uiaction={}] 
     * @param {*} [params={}] 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getBackendUIActionParam(uiaction: any = {}, params: any = {}): any {
        let arg: any = {};
        if (this.getParentMode()) {
            Object.assign(arg, this.getParentMode());
        }
        if (this.getParentData()) {
            Object.assign(arg, this.getParentData());
        }
        let bSingle = false;
        if (Object.is(uiaction.actiontarget, 'SINGLEKEY')) {
            bSingle = true;
        }
        const selectedData: Array<any> = this.getMDCtrl().getSelection();
        if (!(selectedData == null || selectedData.length === 0)) {

            let vlaueitem = 'srfkey';
            let paramkey = 'srfkeys';
            let paramitems = '';
            let paramjo = null;
            let infoitem = 'srfmajortext';

            if (uiaction.actionparams) {
                let actionparams = uiaction.actionparams;
                vlaueitem = (actionparams.vlaueitem && !Object.is(actionparams.vlaueitem, '')) ? actionparams.vlaueitem.toLowerCase() : vlaueitem;
                paramkey = (actionparams.paramitem && !Object.is(actionparams.paramitem, '')) ? actionparams.paramitem.toLowerCase() : paramkey;
                infoitem = (actionparams.textitem && !Object.is(actionparams.textitem, '')) ? actionparams.textitem.toLowerCase() : infoitem;
                paramjo = actionparams.paramjo ? actionparams.paramjo : {};
            }

            if (bSingle) {
                paramitems = selectedData[0][vlaueitem];
            } else {
                selectedData.forEach(item => {
                    let key = item[vlaueitem];
                    if (!Object.is(paramitems, '')) {
                        paramitems += ';';
                    }
                    paramitems += key;
                });
            }
            arg[paramkey] = paramitems;
            if (paramjo) {
                Object.assign(arg, paramjo);
            }
        }
        return arg;
    }


    /**
     * 移动记录
     * 
     * @param {any} target 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public moveRecord(target): any {
    }

    /**
     * 
     * 
     * @param {any} arg 
     * @memberof IBizMDViewController
     */
    public doBackendUIAction(arg): void {
        if (this.getMDCtrl()) {
            this.getMDCtrl().doUIAction(arg);
        }
    }

    /**
     * 隐藏关系列
     * 
     * @param {any} parentMode 
     * @memberof IBizMDViewController
     */
    public doHideParentColumns(parentMode): void {
    }

    /**
     * 
     * 
     * @param {any} arg 
     * @memberof IBizMDViewController
     */
    public onPrintData(arg): void {
        this.doPrintDataNormal(arg);
    }

    /**
     * 常规新建数据
     * 
     * @param {any} arg 
     * @returns {boolean} 
     * @memberof IBizMDViewController
     */
    public doPrintDataNormal(arg): boolean {

        // var view = this.getPrintDataView(arg);
        // if (view == null) {
        //     return false;
        // }
        // var viewurl = view.viewurl;
        // if (!viewurl || viewurl == '') {
        //     viewurl = BASEURL + '/ibizutil/print.pdf';
        // }
        // else {
        //     viewurl = BASEURL + viewurl;
        // }
        // viewurl = viewurl + (viewurl.indexOf('?') == -1 ? '?' : '&') + $.param(view.viewparam);
        // window.open(viewurl, '_blank');
        return true;
    }

    /**
     * 
     * 
     * @param {any} arg 
     * @returns {*} 
     * @memberof IBizMDViewController
     */
    public getPrintDataView(arg): any {
        // return null;
        return undefined;
    }

    /**
     * 是否默认加载
     *
     * @returns {boolean}
     * @memberof IBizMDViewController
     */
    public isLoadDefault(): boolean {
        return true;
    }

    /**
     * 支持批量添加
     * 
     * @returns {boolean} 
     * @memberof IBizMDViewController
     */
    public isEnableBatchAdd(): boolean {
        return false;
    }

    /**
     * 是否支持快速搜索
     * 
     * @returns {boolean} 
     * @memberof IBizMDViewController
     */
    public isEnableQuickSearch(): boolean {
        return true;
    }

    /**
     * 只支持批量添加
     * 
     * @returns {boolean} 
     * @memberof IBizMDViewController
     */
    public isBatchAddOnly(): boolean {
        return false;
    }

    /**
     * 是否支持行编辑
     *
     * @returns {boolean}
     * @memberof IBizMDViewController
     */
    public isEnableRowEdit(): boolean {
        return false;
    }

    /**
     * 是否支持多选
     * 
     * @returns {boolean} 
     * @memberof IBizMDViewController
     */
    public isEnableMultiSelect(): boolean {
        return this.$multiSelect;
    }

    /**
     * 设置支持多选
     *
     * @param {boolean} multiSelect
     * @memberof IBizMDViewController
     */
    public setEnableMultiSelect(multiSelect: boolean): void {
        this.$multiSelect = multiSelect;
    }

    /**
     * 注册快速搜索实体属性
     * 
     * @memberof IBizMDViewController
     */
    public regQuickSearchDEFields(): void {

    }
}
