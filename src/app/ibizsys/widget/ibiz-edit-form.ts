import { IBizForm } from './ibiz-form';
import { IBizEvent } from '../ibiz-event';

/**
 * 编辑表单控制器
 * 
 * @export
 * @class IBizEditForm
 * @extends {IBizForm}
 */
export class IBizEditForm extends IBizForm {

    /**
     * Creates an instance of IBizEditForm.
     * 创建 IBizEditForm 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizEditForm
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 数据保存
     *
     * @param {*} [opt={}]
     * @returns {void}
     * @memberof IBizEditForm
     */
    public save2(opt: any = {}): void {

        // tslint:disable-next-line:prefer-const
        let arg: any = {};
        this.fire(IBizEvent.IBizEditForm_FORMBEFORESAVE, arg);
        if (opt) {
            Object.assign(arg, opt);
        }
        const data = this.getValues();
        Object.assign(arg, data);

        if (Object.is(data.srfuf, '1')) {
            Object.assign(arg, { srfaction: 'update', srfctrlid: this.getName() });
        } else {
            Object.assign(arg, { srfaction: 'create', srfctrlid: this.getName() });
        }

        arg.srfcancel = false;
        // this.fireEvent(IBizEditForm.FORMBEFORESAVE, this, arg);
        if (arg.srfcancel) {
            return;
        }
        delete arg.srfcancel;

        this.$ignoreUFI = true;
        this.$ignoreformfieldchange = true;

        this.submit(arg).subscribe((action) => {
            this.resetFormError();
            this.setFieldAsyncConfig(action.config);
            this.setFieldState(action.state);
            this.setDataAccAction(action.dataaccaction);
            this.fillForm(action.data);
            this.$formDirty = false;
            // 判断是否有提示
            if (action.info && !Object.is(action.info, '')) {
                // IBiz.alert('', action.info, 1);
                this.$iBizNotification.info('', action.info);
            }
            // this.fireEvent('formsaved', this, action);
            this.fire(IBizEvent.IBizForm_FORMSAVED, this);
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
            // this.fireEvent('formfieldchanged', null);
            this.fire(IBizEvent.IBizForm_FORMFIELDCHANGED, null);
            this.onSaved();
        }, (action) => {
            if (action.error) {
                this.setFormError(action.error);
            }

            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;

            // this.fireEvent(IBizEditForm.FORMSAVEERROR, this);
            this.fire(IBizEvent.IBizEditForm_FORMSAVEERROR, this);

            action.failureType = 'SERVER_INVALID';
            if (action.ret === 10) {
                this.$iBizNotification.confirm('保存错误信息', '保存数据发生错误, ' + this.getActionErrorInfo(action) + ', 是否要重新加载数据？').subscribe(result => {
                    if (result && Object.is(result, 'OK')) {
                        this.reload();
                    }
                });
            } else {
                this.$iBizNotification.error('保存错误信息', '保存数据发生错误,' + this.getActionErrorInfo(action));
            }
        });
    }

    /**
     * 
     * 
     * @memberof IBizEditForm
     */
    public onSaved(): void {

    }

    /**
     * 表单数据刷新
     * 
     * @memberof IBizEditForm
     */
    public reload(): void {

        let field = this.findField('srfkey');
        // tslint:disable-next-line:prefer-const
        let loadarg: any = {};
        if (field) {
            loadarg.srfkey = field.getValue();
            if (loadarg.srfkey.indexOf('SRFTEMPKEY:') === 0) {
                field = this.findField('srforikey');
                if (field) {
                    loadarg.srfkey = field.getValue();
                }
            }
            const viewController = this.getViewController();
            if (viewController) {
                const viewParmams: any = viewController.getViewParam();
                if (!Object.is(loadarg.srfkey, viewParmams.srfkey)) {
                    loadarg.srfkey = viewParmams.srfkey;
                }
            }
        }
        this.autoLoad(loadarg);
    }

    /**
     * 删除
     *
     * @param {*} [opt={}]
     * @returns {void}
     * @memberof IBizEditForm
     */
    public remove(opt: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let arg: any = {};
        if (opt) {
            Object.assign(arg, opt);
        }

        if (!arg.srfkey) {
            const field = this.findField('srfkey');
            if (field) {
                arg.srfkey = field.getValue();
            }
        }

        if (!arg.srfkey || Object.is(arg.srfkey, '')) {
            // IBiz.alert($IGM('IBIZEDITFORM.REMOVEFAILED.TITLE', '删除错误信息'), $IGM('IBIZEDITFORM.UNLOADDATA', '当前表单未加载数据！'), 2);
            this.$iBizNotification.error('删除错误信息', '当前表单未加载数据！');
            return;
        }
        Object.assign(arg, { srfaction: 'remove', srfctrlid: this.getName() });
        this.$ignoreUFI = true;

        this.load(arg).subscribe((action) => {
            this.setFieldAsyncConfig(action.config);
            this.setFieldState(action.state);
            // this.fireEvent(IBizForm.FORMREMOVED);
            this.fire(IBizEvent.IBizForm_FORMREMOVED, this);
        }, (action) => {
            action.failureType = 'SERVER_INVALID';
            this.$iBizNotification.error('删除错误信息', '删除数据发生错误, ' + this.getActionErrorInfo(action));
            this.$ignoreUFI = false;
        });
    }

    /**
     * 工作流启动
     *
     * @param {*} [opt={}]
     * @returns {void}
     * @memberof IBizEditForm
     */
    public wfstart(opt: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let arg: any = {};
        if (opt) {
            Object.assign(arg, opt);
        }

        if (!arg.srfkey) {
            let field = this.findField('srfkey');
            if (field) {
                arg.srfkey = field.getValue();
            }
            field = this.findField('srforikey');
            if (field) {
                // tslint:disable-next-line:prefer-const
                let v = field.getValue();
                if (v && !Object.is(v, '')) {
                    arg.srfkey = v;
                }
            }
        }
        if (!arg.srfkey || Object.is(arg.srfkey, '')) {
            // IBiz.alert($IGM('IBIZEDITFORM.WFSTARTFAILED.TITLE', '启动流程错误信息'), $IGM('IBIZEDITFORM.UNLOADDATA', '当前表单未加载数据！'), 2);
            this.$iBizNotification.error('启动流程错误信息', '当前表单未加载数据！');
            return;
        }

        Object.assign(arg, { srfaction: 'wfstart', srfctrlid: this.getName() });
        this.$ignoreUFI = true;
        this.$ignoreformfieldchange = true;

        this.post(arg).subscribe((action) => {
            if (action.ret !== 0) {
                action.failureType = 'SERVER_INVALID';
                this.$iBizNotification.error('启动流程错误信息', '启动流程发生错误,' + this.getActionErrorInfo(action));
                this.$ignoreUFI = false;
                this.$ignoreformfieldchange = false;
                return;
            }

            this.setFieldAsyncConfig(action.config);
            this.setFieldState(action.state);
            this.setDataAccAction(action.dataaccaction);
            this.fillForm(action.data);
            this.$formDirty = false;
            // this.fireEvent(IBizForm.FORMLOADED);
            // this.fireEvent(IBizForm.FORMWFSTARTED);
            this.fire(IBizEvent.IBizForm_FORMWFSTARTED, this);
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
            // this.fireEvent(IBizForm.FORMFIELDCHANGED, null);
            this.fire(IBizEvent.IBizForm_FORMFIELDCHANGED, null);
        }, (action) => {
            action.failureType = 'SERVER_INVALID';
            this.$iBizNotification.error('启动流程错误信息', '启动流程发生错误,' + this.getActionErrorInfo(action));
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
        });
    }

    /**
     * 工作流提交
     *
     * @param {*} [opt={}]
     * @returns {void}
     * @memberof IBizEditForm
     */
    public wfsubmit(opt: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let arg: any = {};
        if (opt) {
            Object.assign(arg, opt);
        }

        const data = this.getValues();
        Object.assign(arg, data);
        Object.assign(arg, { srfaction: 'wfsubmit', srfctrlid: this.getName() });

        //        if (!arg.srfkey) {
        //            var field = this.findField('srfkey');
        //            if (field) {
        //                arg.srfkey = field.getValue();
        //            }
        //        }
        if (!arg.srfkey || Object.is(arg.srfkey, '')) {
            // IBiz.alert($IGM('IBIZEDITFORM.WFSUBMITFAILED.TITLE', '提交流程错误信息'), $IGM('IBIZEDITFORM.UNLOADDATA', '当前表单未加载数据！'), 2);
            this.$iBizNotification.error('提交流程错误信息', '当前表单未加载数据！');
            return;
        }

        this.$ignoreUFI = true;
        this.$ignoreformfieldchange = true;

        this.load(arg).subscribe((action) => {
            this.setFieldAsyncConfig(action.config);
            this.setFieldState(action.state);
            this.setDataAccAction(action.dataaccaction);
            this.fillForm(action.data);
            this.$formDirty = false;
            // this.fireEvent(IBizForm.FORMLOADED);
            // this.fireEvent(IBizForm.FORMWFSUBMITTED);
            this.fire(IBizEvent.IBizForm_FORMWFSUBMITTED, this);
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
            // this.fireEvent(IBizForm.FORMFIELDCHANGED, null);
            this.fire(IBizEvent.IBizForm_FORMFIELDCHANGED, null);
        }, (action) => {
            action.failureType = 'SERVER_INVALID';
            this.$iBizNotification.error('提交流程错误信息', '工作流提交发生错误,' + this.getActionErrorInfo(action));
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
        });
    }

    /**
     * 界面行为
     * 
     * @param {*} [arg={}] 
     * @memberof IBizEditForm
     */
    public doUIAction(arg: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let opt: any = {};
        if (arg) {
            Object.assign(opt, arg);
        }
        Object.assign(opt, { srfaction: 'uiaction', srfctrlid: this.getName() });

        this.post(opt).subscribe((data) => {
            if (data.ret === 0) {
                // IBiz.processResultBefore(data);
                this.fire(IBizEvent.IBizEditForm_UIACTIONFINISHED, data);
                if (data.reloadData) {
                    this.reload();
                }
                if (data.info && !Object.is(data.info, '')) {
                    this.$iBizNotification.info('', data.info);
                }
                // IBiz.processResult(data);
            } else {
                this.$iBizNotification.error('界面操作错误信息', '操作失败,' + data.errorMessage);
            }
        }, (error) => {
            this.$iBizNotification.error('界面操作错误信息', '操作失败,' + error.info);
        });

    }

    /**
     * 表单类型
     *
     * @returns {string}
     * @memberof IBizEditForm
     */
    public getFormType(): string {
        return 'EDITFORM';
    }
}
