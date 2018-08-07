import { IBizEvent } from './../IBizEvent';
import { IBizMainViewController } from './IBizMainViewController';

/**
 * 编辑视图控制器
 * 
 * @export
 * @class IBizEditViewController
 * @extends {IBizMainViewController}
 */
export class IBizEditViewController extends IBizMainViewController {


    /**
     * 表单视图数据标题信息
     * 
     * @type {string}
     * @memberof IBizEditViewController
     */
    public $dataInfo: string;

    /**
     * 表单保存后操作行为
     * 
     * @private
     * @type {string}
     * @memberof IBizEditViewController
     */
    private $afterformsaveaction: string = '';

    /**
     * 最后的工作流实体界面行为
     * 
     * @private
     * @type {*}
     * @memberof IBizEditViewController
     */
    private $lastwfuiaction: any = {}

    /**
     * 最后工作流操作参数
     * 
     * @private
     * @type {*}
     * @memberof IBizEditViewController
     */
    private $lastwfuaparam: any = {};

    /**
     * Creates an instance of IBizEditViewController.
     * 创建IBizEditViewController实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizEditViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 视图部件初始化
     * 
     * @memberof IBizEditViewController
     */
    public onInit(): void {
        if (!this.isModal() && this.$iBizApp) {
            const _routeDataLength: number = this.$iBizApp.$activatedRouteDatas.length;
            if (_routeDataLength !== 0) {
                const lastData_index: number = _routeDataLength - 1;
                Object.assign(this.$activatedRouteData, this.$iBizApp.$activatedRouteDatas[lastData_index]);
            }
        }
        super.onInit();
    }

    /**
     * 初始化表单
     * 
     * @memberof IBizEditViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const form: any = this.getForm();
        if (form) {
            // 表单保存之前
            form.on(IBizEvent.IBizEditForm_FORMBEFORESAVE, (data) => {
                this.onFormBeforeSaved(data);
            });
            // 表单保存完成
            form.on(IBizEvent.IBizForm_FORMSAVED, (data) => {
                this.onFormSaved(data);
            });
            // 表单加载完成
            form.on(IBizEvent.IBizForm_FORMLOADED, (data) => {
                this.onFormLoaded();
            });
            // 表单删除完成
            form.on(IBizEvent.IBizForm_FORMREMOVED, (data) => {
                this.onFormRemoved();
            });
            // 工作流启动完成
            form.on(IBizEvent.IBizForm_FORMWFSTARTED, (data) => {
                this.onFormWFStarted();
            });
            // 工作流提交完成
            form.on(IBizEvent.IBizForm_FORMWFSUBMITTED, (data) => {
                this.onFormWFSubmitted();
            });
            // 编辑表单实体界面行为
            form.on(IBizEvent.IBizEditForm_UIACTIONFINISHED, (data) => {
                if (data.reloadData) {
                    this.refreshReferView();
                }
                if (data.closeEditview) {
                    this.closeWindow();
                }
            });
            // 表单属性值变化
            form.on(IBizEvent.IBizForm_FORMFIELDCHANGED, (data) => {
                if (data == null) {
                    this.onFormFieldChanged('', null, null);
                } else {
                    this.onFormFieldChanged(data.name, data.value, data.field);
                    this.onFormFieldValueCheck(data.name, data.field.getValue());
                }
            });
            // 表单权限发生变化
            form.on(IBizEvent.IBizForm_DATAACCACTIONCHANGE, (data) => {
                this.onDataAccActionChange(data);
            });
        }
    }

    /**
     * 加载数据
     * 
     * @memberof IBizEditViewController
     */
    public onLoad(): void {
        super.onLoad();
        const editForm: any = this.getForm();
        if (editForm) {
            editForm.autoLoad(this.getViewParam());
        }
    }

    /**
     * 
     * 
     * @memberof IBizEditViewController
     */
    public addEditMenu(): void {

    }

    /**
     * 判断表单是否修改了
     * 
     * @returns {boolean} 
     * @memberof IBizEditViewController
     */
    public unloaded(): boolean {
        // 判断表单是否修改了

        // if (this.form.isDirty()) {
        //     return $IGM('EDITVIEWCONTROLLER.UNLOADED.INFO', '表单已经被修改是否关闭');
        // }
        return false;
    }

    /**
     * 表单权限发生变化
     * 
     * @param {*} dataaccaction 
     * @memberof IBizEditViewController
     */
    public onDataAccActionChange(dataaccaction: any): void {

        if (this.getToolBar()) {
            this.getToolBar().updateAccAction(dataaccaction);
        }
        // if (this.getToolbar())
        //     this.getToolbar().updateAccAction(dataaccaction);
        // if (this.mintoolbar)
        //     this.mintoolbar.updateAccAction(dataaccaction);
        // if (this.floattoolbar)
        //     this.floattoolbar.updateAccAction(dataaccaction);
    }

    /**
     * 设置父数据
     * 
     * @memberof IBizEditViewController
     */
    public onSetParentData(): void {

        // if (this.isInited() == true) {
        //     if (this.parentData) {
        //         var params = $.extend(this.viewparam, this.parentData);
        //         this.form.autoLoad(params);
        //     }
        // }
    }

    /**
     * 获取表单对象
     * 
     * @returns {*} 
     * @memberof IBizEditViewController
     */
    public getForm(): any {
        return this.getControl('form');
    }

    /**
     * 获取数据信息区对象
     * 
     * @returns {*} 
     * @memberof IBizEditViewController
     */
    public getDataInfoBar(): any {

        // return this.datainfobar;
        return;
    }

    /**
     * 表单保存之前，处理视图数据
     * 
     * @param {*} [arg={}] 
     * @memberof IBizEditViewController
     */
    public onFormBeforeSaved(arg: any = {}): void {
        Object.assign(arg, this.getViewParam());
    }

    /**
     * 表单保存完成
     * 
     * @param {*} [result={}] 
     * @returns {void} 
     * @memberof IBizEditViewController
     */
    public onFormSaved(result: any = {}): void {

        this.refreshReferView();
        if (Object.is(this.$afterformsaveaction, 'exit')) {
            // var window = this.getWindow();
            // if (window) {
            //     window.dialogResult = 'ok';
            //     window.activeData = this.getForm().getValues();
            // }
            this.closeWindow();
            return;
        }
        if (Object.is(this.$afterformsaveaction, 'new')) {
            let arg = this.getViewParam();
            if (!arg) {
                arg = {};
            }

            this.getForm().loadDraft(arg);
            return;
        }

        if (Object.is(this.$afterformsaveaction, 'dowfuiaction')) {
            this.$afterformsaveaction = 'dowfuiactionok';
            this.doWFUIAction(this.$lastwfuiaction, this.$lastwfuaparam);
            return;
        }

        if (Object.is(this.$afterformsaveaction, 'startwf')) {
            this.startWF();
        } else {
            // 判断是否已经出现过提示
            if (!result || !result.info) {
                // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.INFO', '信息'), $IGM('EDITVIEWCONTROLLER.ONFORMSAVED.INFO', '数据保存成功！'), 1);
                this.$iBizNotification.success('信息', '数据保存成功！');
            }
        }
        this.updateViewInfo();
    }

    /**
     * 表单加载完成
     * 
     * @memberof IBizEditViewController
     */
    public onFormLoaded(): void {
        this.updateViewInfo();
    }

    /**
     * 工作流表单启动完成
     * 
     * @memberof IBizEditViewController
     */
    public onFormWFStarted(): void {

        this.refreshReferView();
        this.closeWindow();
    }

    /**
     * 工作流表单提交完成
     * 
     * @memberof IBizEditViewController
     */
    public onFormWFSubmitted(): void {

        this.refreshReferView();
        this.closeWindow();
    }

    /**
     * 更细视图caption信息
     * 
     * @memberof IBizEditViewController
     */
    public updateViewInfo(): void {
        const form = this.getForm();
        if (!form) {
            return;
        }
        const _srfuf: any = form.findField('srfuf');
        if (!_srfuf) {
            return;
        }
        const newdata: boolean = !Object.is(_srfuf.getValue(), '1');

        const dataAccAction = form.getdataaccaction();
        this.calcToolbarItemState(!newdata, dataAccAction);

        let info: string = '';
        if (newdata) {
            info = '新建';
        } else {
            const _srfmajortext: any = form.findField('srfmajortext');
            if (_srfmajortext) {
                info = _srfmajortext.getValue();
            }
        }
        const _StrInfo: string = info.replace(/[null]/g, '').replace(/[undefined]/g, '').replace(/[ ]/g, '');

        if (_StrInfo.length > 10) {
            info = _StrInfo.substring(0, 10) + `...`;
        }
        this.$dataInfo = Object.is(info, '') ? '' : info;

        if (!this.isModal() && Object.keys(this.$activatedRouteData).length > 0) {
            const data = { fullcaption: _StrInfo, caption: this.$dataInfo };
            Object.assign(this.$activatedRouteData, data);
            this.$iBizApp.updateActivatedRouteDatas(this.$activatedRouteData);
        }
    }

    /**
     * 表单删除完成
     * 
     * @memberof IBizEditViewController
     */
    public onFormRemoved(): void {

        this.refreshReferView();
        this.closeWindow();
    }

    /**
     * 表单项更新
     * 
     * @param {string} fieldname 
     * @param {*} field 
     * @param {string} value 
     * @memberof IBizEditViewController
     */
    public onFormFieldChanged(fieldname: string, field: any, value: string): void {

    }

    /**
     * 表单项值检测
     *
     * @param {string} fieldname
     * @param {string} value
     * @memberof IBizEditViewController
     */
    public onFormFieldValueCheck(fieldname: string, value: string): void {

    }

    /**
     * 处理实体界面行为
     * 
     * @param {*} [uiaction={}] 界面行为
     * @param {*} [params={}]  参数
     * @returns {void} 
     * @memberof IBizEditViewController
     */
    public doDEUIAction(uiaction: any = {}, params: any = {}): void {

        if (Object.is(uiaction.tag, 'Help')) {
            this.doHelp();
            return;
        }
        if (Object.is(uiaction.tag, 'SaveAndStart')) {
            this.doSaveAndStart();
            return;
        }
        if (Object.is(uiaction.tag, 'SaveAndExit')) {
            this.doSaveAndExit();
            return;
        }
        if (Object.is(uiaction.tag, 'SaveAndNew')) {
            this.doSaveAndNew();
            return;
        }
        if (Object.is(uiaction.tag, 'Save')) {
            this.doSave();
            return;
        }
        if (Object.is(uiaction.tag, 'Print')) {
            this.doPrint();
            return;
        }
        if (Object.is(uiaction.tag, 'Copy')) {
            this.doCopy();
            return;
        }
        if (Object.is(uiaction.tag, 'RemoveAndExit')) {
            this.doRemoveAndExit();
            return;
        }
        if (Object.is(uiaction.tag, 'Refresh')) {
            this.doRefresh();
            return;
        }
        if (Object.is(uiaction.tag, 'New')) {
            this.doNew();
            return;
        }
        if (Object.is(uiaction.tag, 'FirstRecord')) {
            this.doMoveToRecord('first');
            return;
        }
        if (Object.is(uiaction.tag, 'PrevRecord')) {
            this.doMoveToRecord('prev');
            return;
        }
        if (Object.is(uiaction.tag, 'NextRecord')) {
            this.doMoveToRecord('next');
            return;
        }
        if (Object.is(uiaction.tag, 'LastRecord')) {
            this.doMoveToRecord('last');
            return;
        }
        if (Object.is(uiaction.tag, 'Exit') || Object.is(uiaction.tag, 'Close')) {
            this.doExit();
            return;
        }
        super.doDEUIAction(uiaction, params);
    }

    /**
     * 编辑界面_实体帮助界面操作
     * 
     * @memberof IBizEditViewController
     */
    public doHelp(): void {
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.INFO', '信息'), $IGM('EDITVIEWCONTROLLER.DOHELP.INFO', '编辑界面_帮助操作！'), 5);
        this.$iBizNotification.info('信息', '编辑界面_帮助操作！');
    }

    /**
     * 编辑界面_保存并启动工作流操作
     * 
     * @memberof IBizEditViewController
     */
    public doSaveAndStart(): void {
        this.$afterformsaveaction = 'startwf';
        this.saveData({ 'postType': 'startwf' });
    }

    /**
     * 编辑界面_保存并退出操作
     * 
     * @memberof IBizEditViewController
     */
    public doSaveAndExit(): void {

        this.$afterformsaveaction = 'exit';
        const window = this.getWindow();
        // if (window) {
        //     window.dialogResult = 'cancel';
        // }
        this.saveData({});
    }

    /**
     * 编辑界面_保存并新建操作
     * 
     * @memberof IBizEditViewController
     */
    public doSaveAndNew(): void {

        this.$afterformsaveaction = 'new';
        this.saveData({});
    }

    /**
     * 编辑界面_保存操作
     * 
     * @memberof IBizEditViewController
     */
    public doSave(): void {

        this.$afterformsaveaction = '';
        this.saveData({});
    }

    /**
     * 编辑界面_打印操作
     * 
     * @memberof IBizEditViewController
     */
    public doPrint(): void {

        // var arg = {};
        // arg.srfkey = '';
        // var field = this.getForm().findField('srforikey');
        // if (field) {
        //     arg.srfkey = field.getValue();
        // }
        // if (arg.srfkey == undefined || arg.srfkey == '') {
        //     field = this.getForm().findField('srfkey');
        //     if (field) {
        //         arg.srfkey = field.getValue();
        //     }
        // }
        // if (arg.srfkey == '')
        //     return;
        // this.onPrintData(arg);
    }

    /**
     * 编辑界面_拷贝操作
     * 
     * @memberof IBizEditViewController
     */
    public doCopy(): void {
        let arg: any = {};
        Object.assign(arg, this.getViewParam());
        arg.srfkey = '';
        if (!this.getForm()) {
            return;
        }
        let srforikey = this.getForm().findField('srforikey');
        if (srforikey) {
            arg.srfsourcekey = srforikey.getValue();
        }
        if (!arg.srfsourcekey || Object.is(arg.srfsourcekey, '')) {
            let srfkey = this.getForm().findField('srfkey');
            if (srfkey) {
                arg.srfsourcekey = srfkey.getValue();
            }
        }
        if (!arg.srfsourcekey || Object.is(arg.srfsourcekey, '')) {
            this.$iBizNotification.warning('警告', '当前表单未加载数据，不能拷贝');
            return;
        }
        this.getForm().autoLoad(arg);
    }

    /**
     * 编辑界面_删除并退出操作
     * 
     * @memberof IBizEditViewController
     */
    public doRemoveAndExit(): void {
        this.$iBizNotification.confirm('删除提示', '确认要删除当前数据，删除操作将不可恢复？').subscribe((result) => {
            if (result && Object.is(result, 'OK')) {
                this.removeData();
            }
        });
    }

    /**
     * 编辑界面_刷新操作
     * 
     * @memberof IBizEditViewController
     */
    public doRefresh(): void {
        this.$iBizNotification.info('信息', '编辑界面_刷新操作！');
    }

    /**
     * 编辑界面_新建操作
     * 
     * @memberof IBizEditViewController
     */
    public doNew(): void {
        this.$iBizNotification.info('信息', '编辑界面_新建操作！');
    }

    /**
     * 编辑界面_退出操作
     * 
     * @memberof IBizEditViewController
     */
    public doExit(): void {
        this.closeWindow();
    }

    /**
     * 保存视图数据
     * 
     * @param {*} [arg={}] 
     * @memberof IBizEditViewController
     */
    public saveData(arg: any = {}): void {
        if (!arg) {
            arg = {};
        }
        this.getForm().save2(arg);
    }

    /**
     * 删除视图数据
     * 
     * @param {*} [arg={}] 
     * @memberof IBizEditViewController
     */
    public removeData(arg: any = {}): void {
        if (!arg) {
            arg = {};
        }
        this.getForm().remove(arg);
    }

    /**
     * 刷新关联数据
     * 模态框情况下
     * 
     * @memberof IBizEditViewController
     */
    public refreshReferView(): void {
        if (this.isModal()) {
            const form = this.getForm();
            if (form) {
                const formActiveData = form.getActiveData();
                // this.nzModalSubject.next({ ret: 'OK', data: formActiveData });
                // this.nzModalSubject.next('DATACHANGE');
            }
        }
    }

    /**
     * 更新表单项
     * 
     * @param {*} [arg={}] 
     * @memberof IBizEditViewController
     */
    public updateFormItems(arg: any = {}): void {
        this.getForm().updateFormItems(arg);
    }

    /**
     * 
     * 
     * @param {boolean} bShow 
     * @memberof IBizEditViewController
     */
    public showCommandBar(bShow: boolean): void {

        // var toolbar = this.getToolbar();
        // if (toolbar && (toolbar.isHidden() == bShow)) {
        //     if (bShow) {
        //         toolbar.show();
        //     } else toolbar.hide();
        // }
    }

    /**
     * 工作流实体界面行为
     * 
     * @param {*} [uiaction={}] 
     * @param {*} [params={}] 
     * @returns {void} 
     * @memberof IBizEditViewController
     */
    public doWFUIAction(uiaction: any = {}, params: any = {}): void {

        if (this.isEnableEditData()) {
            if (!Object.is(this.$afterformsaveaction, 'dowfuiactionok')) {
                this.$afterformsaveaction = 'dowfuiaction';
                this.$lastwfuiaction = uiaction;
                this.$lastwfuaparam = params;
                this.saveData({});
                return;
            }
            this.$afterformsaveaction = '';
            this.$lastwfuiaction = null;
            this.$lastwfuaparam = null;
        }

        if (Object.is(uiaction.actionmode, 'WFBACKEND')) {
            let arg = {
                srfwfiatag: uiaction.tag
            };
            this.getForm().wfsubmit(arg);
            return;
        }
        super.doWFUIAction(uiaction, params);
    }

    /**
     * 启动工作流
     * 
     * @param {*} [arg={}] 
     * @memberof IBizEditViewController
     */
    public startWF(arg: any = {}): void {

        let startuiaction = this.getUIAction('WFStartWizard');
        if (startuiaction) {
            this.doUIAction(startuiaction, {});
        } else {
            this.getForm().wfstart(arg);
        }
    }

    /**
     * 
     * 
     * @param {*} target 
     * @memberof IBizEditViewController
     */
    public doMoveToRecord(target: any): void {

        // var referView = this.getReferView();
        // if (referView && referView.moveRecord) {
        //     var record = referView.moveRecord(target);
        //     if (record) {
        //         var loadParam = {};
        //         $.extend(loadParam, {
        //             srfkey: record.get('srfkey')
        //         });
        //         this.getForm().autoLoad(loadParam);
        //     }
        // }
    }

    /**
     * 执行后台界面行为
     * 
     * @param {*} [arg={}] 
     * @memberof IBizEditViewController
     */
    public doBackendUIAction(arg: any = {}): void {
        this.getForm().doUIAction(arg);
    }

    /**
     * 获取前台行为参数
     * 
     * @param {*} [uiaction={}] 行为
     * @returns {*} 
     * @memberof IBizEditViewController
     */
    public getFrontUIActionParam(uiaction: any = {}): any {

        // var arg = arguments.callee.$.getFrontUIActionParam.call(this, uiaction);
        // if (uiaction.actiontarget == 'SINGLEKEY' || uiaction.actiontarget == 'MULTIKEY') {
        //     var dataInfo = '';
        //     var keys = '';
        //     var field = this.getForm().findField('srforikey');
        //     if (field) {
        //         keys = field.getValue();
        //     }
        //     if (keys == undefined || keys == '') {
        //         field = this.getForm().findField('srfkey');
        //         if (field) {
        //             keys = field.getValue();
        //         }
        //     }
        //     return $.extend(arg, { srfkeys: keys, srfkey: keys });
        // }
        // return arg;

        let arg = super.getFrontUIActionParam(uiaction, {});
        if (Object.is(uiaction.actiontarget, 'SINGLEKEY') || Object.is(uiaction.actiontarget, 'MULTIKEY')) {
            // let dataInfo = '';
            let keys = '';
            const form = this.getForm();
            if (!form) {
                return arg;
            }

            const _srfkeyFiled = form.findField('srfkey');
            if (!_srfkeyFiled) {
                return arg;
            }

            keys = _srfkeyFiled.getValue();
            if (keys === undefined || Object.is(keys, '')) {
                keys = _srfkeyFiled.getValue();
            }
            return Object.assign(arg, { srfkeys: keys, srfkey: keys });
        }
        return arg;
    }

    /**
     * 获取后台行为参数
     * 
     * @param {*} [uiaction={}] 行为
     * @returns {*} 
     * @memberof IBizEditViewController
     */
    public getBackendUIActionParam(uiaction: any = {}): any {

        // if (uiaction.actiontarget == 'SINGLEKEY' || uiaction.actiontarget == 'MULTIKEY') {
        //     var dataInfo = '';
        //     var keys = '';

        //     var field = this.getForm().findField('srfkey');
        //     if (field) {
        //         keys = field.getValue();
        //     }
        //     field = this.getForm().findField('srfmajortext');
        //     if (field) {
        //         dataInfo = field.getValue();
        //     }
        //     return $.extend({ srfkeys: keys, dataInfo: dataInfo }this.getForm().getValues());
        //     //return {srfkeys: keys,dataInfo: dataInfo};
        // }
        // return {};

        if (Object.is(uiaction.actiontarget, 'SINGLEKEY') || Object.is(uiaction.actiontarget, 'MULTIKEY')) {
            let dataInfo = '';
            let keys = '';

            const form = this.getForm();
            if (!form) {
                return {};
            }

            const _srfkeyFiled = form.findField('srfkey');
            if (!_srfkeyFiled) {
                return {};
            }
            keys = _srfkeyFiled.getValue();

            const _srfmajortextFiled = form.findField('srfmajortext');
            if (!_srfmajortextFiled) {
                return {};
            }
            dataInfo = _srfmajortextFiled.getValue();

            return Object.assign({ srfkeys: keys, dataInfo: dataInfo }, this.getForm().getValues());
        }
        return {};
    }

    /**
     * 初始化浮动工具栏
     * 
     * @memberof IBizEditViewController
     */
    public initFloatToolbar(): void {
        // var offset = 60;
        // var duration = 300;
        // if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {  // ios supported
        //     $(window).bind('touchend touchcancel touchleave', function (e) {
        //         if ($(this).scrollTop() > offset) {
        //             $('.scroll-to-top').fadeIn(duration);
        //         } else {
        //             $('.scroll-to-top').fadeOut(duration);
        //         }
        //     });
        // } else {
        //     $(window).scroll(function () {
        //         if ($(this).scrollTop() > offset) {
        //             $('.scroll-to-top').fadeIn(duration);
        //         } else {
        //             $('.scroll-to-top').fadeOut(duration);
        //         }
        //     });
        // }
        // $('.scroll-to-top').click(function (e) {
        //     e.preventDefault();
        //     return false;
        // });
    }

    /**
     * 工作流前端实体界面后窗口关闭
     * 
     * @param {*} win 
     * @param {*} [data={}] 
     * @returns {void} 
     * @memberof IBizEditViewController
     */
    public onWFUIFrontWindowClosed(win: any, data: any = {}): void {

        // if (win.dialogResult == 'ok') {
        //     var window = this.getWindow();
        //     if (window) {
        //         window.dialogResult = 'ok';
        //         window.activeData = this.getForm().getValues();
        //     }
        // this.refreshReferView();
        // this.closeWindow();
        //     return;
        // }

        // if (win) {
        //     if (Object.is(win.ret, 'OK')) {
        //         // this.closeView();
        //     }
        // }
        this.refreshReferView();
        this.closeWindow();

    }

    /**
     * 是否启用新建数据
     * 
     * @returns {boolean} 
     * @memberof IBizEditViewController
     */
    public isEnableNewData(): boolean {
        return true;
    }

    /**
     * 是否启用编辑数据
     * 
     * @returns {boolean} 
     * @memberof IBizEditViewController
     */
    public isEnableEditData(): boolean {
        return true;
    }

    /**
     * 是否启用删除数据
     * 
     * @returns {boolean} 
     * @memberof IBizEditViewController
     */
    public isEnableRemoveData(): boolean {
        return true;
    }

    /**
     * 打印数据
     * 
     * @param {*} [arg={}] 
     * @memberof IBizEditViewController
     */
    public onPrintData(arg: any = {}): void {

        this.doPrintDataNormal(arg);
    }

    /**
     * 打印常规数据
     * 
     * @param {*} [arg={}] 
     * @returns {boolean} 
     * @memberof IBizEditViewController
     */
    public doPrintDataNormal(arg: any = {}): boolean {

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
     * 获取打印数据
     * 
     * @param {*} [arg={}] 
     * @returns {*} 
     * @memberof IBizEditViewController
     */
    public getPrintDataView(arg: any = {}): any {
        // return null;

        return undefined;
    }

    /**
     * 视图数据刷新
     * 
     * @memberof IBizEditViewController
     */
    public onRefresh(): void {
        const form = this.getForm();
        if (form) {
            form.reload();
        }
    }
}
