import { Subject, Observable } from 'rxjs';
import { IBizControl } from './ibiz-control';
import { IBizEvent } from '../ibiz-event';

/**
 * 表单部件服务对象
 * 
 * @export
 * @class IBizForm
 * @extends {IBizControl}
 */
export class IBizForm extends IBizControl {

    /**
     * 是否忽略表单变化
     * 
     * @type {boolean}
     * @memberof IBizForm
     */
    public $ignoreformfieldchange: boolean = false;

    /**
     * 是否忽略表单项更新
     * 
     * @type {boolean}
     * @memberof IBizForm
     */
    public $ignoreUFI: boolean = false;

    /**
     * 当前表单权限
     * 
     * @type {*}
     * @memberof IBizForm
     */
    public $dataaccaction: any = {};

    /**
     * 表单是否改变
     * 
     * @type {boolean}
     * @memberof IBizForm
     */
    public $formDirty: boolean = false;

    /**
     * 表单表单项
     * 
     * @type {*}
     * @memberof IBizForm
     */
    public $fields: any = {};

    /**
     * Creates an instance of IBizForm.
     * 创建IBizForm的一个实例。
     * 
     * @param {*} [opts={}] 
     * @memberof IBizForm
     */
    constructor(opts: any = {}) {
        super(opts);
        this.regFields();
    }

    /**
     * 注册表单项
     * 
     * @memberof IBizForm
     */
    public regFields(): void {

    }

    /**
     * 表单加载
     * 
     * @param {*} [arg={}] 参数
     * @returns {void} 
     * @memberof IBizForm
     */
    public autoLoad(arg: any = {}): void {

        if (!arg) {
            arg = {};
        }

        if (arg.srfkey && !Object.is(arg.srfkey, '')) {
            this.load2(arg);
            return;
        }
        if (arg.srfkeys && !Object.is(arg.srfkeys, '')) {
            Object.assign(arg, { srfkey: arg.srfkeys });
            this.load2(arg);
            return;
        }
        this.loadDraft(arg);
    }

    /**
     * 加载
     * 
     * @param {*} [opt={}] 参数
     * @memberof IBizForm
     */
    public load2(opt: any = {}): void {

        // tslint:disable-next-line:prefer-const
        let arg: any = {};
        Object.assign(arg, opt);

        Object.assign(arg, { srfaction: 'load', srfctrlid: this.getName() });
        this.fire(IBizEvent.IBizForm_BEFORELOAD, arg);

        this.$ignoreUFI = true;
        this.$ignoreformfieldchange = true;
        this.load(arg).subscribe((action) => {
            this.setFieldAsyncConfig(action.config);
            this.setFieldState(action.state);
            this.setDataAccAction(action.dataaccaction);
            this.fillForm(action.data);
            this.$formDirty = false;
            // this.fireEvent(IBizForm.FORMLOADED, this);
            this.fire(IBizEvent.IBizForm_FORMLOADED, this);
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
            // this.fireEvent(IBizForm.FORMFIELDCHANGED, null);
            this.fire(IBizEvent.IBizForm_FORMFIELDCHANGED, null);
            this.onLoaded();
        }, (action) => {
            action.failureType = 'SERVER_INVALID';
            this.$iBizNotification.error('加载失败', '加载数据发生错误, ' + this.getActionErrorInfo(action));
            // IBiz.alert($IGM('IBIZFORM.LOAD.TITLE', '加载失败'), $IGM('IBIZFORM.LOAD2.INFO', '加载数据发生错误,' + this.getActionErrorInfo(action), [this.getActionErrorInfo(action)]), 2);
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
        });
    }

    /**
     * 加载草稿
     * 
     * @param {*} [opt={}] 
     * @memberof IBizForm
     */
    public loadDraft(opt: any = {}): void {

        // tslint:disable-next-line:prefer-const
        let arg: any = {};
        Object.assign(arg, opt);

        this.$ignoreUFI = true;
        this.$ignoreformfieldchange = true;

        if (!arg.srfsourcekey || Object.is(arg.srfsourcekey, '')) {
            // $.extend(arg, { srfaction: 'loaddraft' });
            Object.assign(arg, { srfaction: 'loaddraft', srfctrlid: this.getName() });

        } else {
            // $.extend(arg, { srfaction: 'loaddraftfrom' });
            Object.assign(arg, { srfaction: 'loaddraftfrom', srfctrlid: this.getName() });
        }

        this.load(arg).subscribe((action) => {
            this.setFieldAsyncConfig(action.config);
            this.setFieldState(action.state);
            this.setDataAccAction(action.dataaccaction);
            this.fillForm(action.data);
            this.$formDirty = false;
            // this.fireEvent(IBizForm.FORMLOADED, this);
            this.fire(IBizEvent.IBizForm_FORMLOADED, this);
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
            // this.fireEvent(IBizForm.FORMFIELDCHANGED, null);
            this.fire(IBizEvent.IBizForm_FORMFIELDCHANGED, null);
            this.onDraftLoaded();
        }, (action) => {
            action.failureType = 'SERVER_INVALID';
            // IBiz.alert($IGM('IBIZFORM.LOAD.TITLE', '加载失败'), $IGM('IBIZFORM.LOADDRAFT.INFO', '加载草稿发生错误,' + this.getActionErrorInfo(action), [this.getActionErrorInfo(action)]), 2);
            this.$iBizNotification.error('加载失败', '加载草稿发生错误, ' + this.getActionErrorInfo(action));
            this.$ignoreUFI = false;
            this.$ignoreformfieldchange = false;
        });
    }

    /**
     * 
     * 
     * @memberof IBizForm
     */
    public onDraftLoaded(): void {

    }

    /**
     * 
     * 
     * @memberof IBizForm
     */
    public onLoaded(): void {

    }

    /**
     * 设置表单动态配置
     * 
     * @param {*} [config={}] 
     * @memberof IBizForm
     */
    public setFieldAsyncConfig(config: any = {}): void {
        if (!config) {
            return;
        }

        const _names: Array<any> = Object.keys(config);
        _names.forEach((name) => {
            const field = this.findField(name);
            if (!field) {
                return;
            }
            if (config[name].hasOwnProperty('items') && Array.isArray(config[name].items)) {
                field.setAsyncConfig(config[name].items);
            }
            if (config[name].hasOwnProperty('dictitems') && Array.isArray(config[name].dictitems)) {
                field.setDictItems(config[name].dictitems);
            }
        });
    }

    /**
     * 设置当前表单权限信息
     * 
     * @param {*} [dataaccaction={}] 权限数据
     * @memberof IBizForm
     */
    public setDataAccAction(dataaccaction: any = {}): void {
        this.$dataaccaction = dataaccaction;
        this.fire(IBizEvent.IBizForm_DATAACCACTIONCHANGE, this.$dataaccaction);
    }

    /**
     * 获取当前表单权限信息
     * 
     * @returns {*} 
     * @memberof IBizForm
     */
    public getdataaccaction(): any {
        return this.$dataaccaction;
    }

    /**
     * 设置属性状态
     * 
     * @param {*} [state={}] 
     * @memberof IBizForm
     */
    public setFieldState(state: any = {}): void {
        if (!state) {
            return;
        }

        const stateDats: Array<any> = Object.keys(state);
        stateDats.forEach(name => {
            const field = this.findField(name);
            if (field) {
                // tslint:disable-next-line:no-bitwise
                const disabled = ((state[name] & 1) === 0);
                if (field.isDisabled() !== disabled) {
                    field.setDisabled(disabled);
                }
            }
        });
    }

    /**
     * 表单是否改变
     * 
     * @returns {boolean} 
     * @memberof IBizForm
     */
    public isDirty(): boolean {
        return this.$formDirty;
    }

    /**
     * 注册表单属性
     * 
     * @param {*} field 表单项
     * @memberof IBizForm
     */
    public regField(field: any): void {
        if (!this.$fields) {
            this.$fields = {};
        }

        if (field) {
            field.on(IBizEvent.IBizFormItem_VALUECHANGED).subscribe((data: any = {}) => {
                if (this.$ignoreformfieldchange) {
                    return;
                }
                this.$formDirty = true;
                this.fire(IBizEvent.IBizForm_FORMFIELDCHANGED, data);
            });
            this.$fields[field.getName()] = field;
        }
    }

    /**
     * 注销表单属性
     * 
     * @param {*} field 属性
     * @memberof IBizForm
     */
    public unRegFiled(field: any): void {
        delete this.$fields[field.getName()];
    }

    /**
     * 获取控件标识
     * 
     * @returns {*} 
     * @memberof IBizForm
     */
    public getSRFCtrlId(): any {
        // return this.srfctrlid;
    }

    /**
     * 根据名称获取属性
     * 
     * @param {string} name 属性名称
     * @returns {*} 
     * @memberof IBizForm
     */
    public findField(name: string): any {
        if (this.$fields[name]) {
            return this.$fields[name];
        }
        return undefined;
    }

    /**
     * 根据唯一标识获取属性
     * 
     * @param {string} id 表单项id
     * @returns {*} 
     * @memberof IBizForm
     */
    public getFieldById(id: string): any {
        // return this.fieldIdMap[id];
    }

    /**
     * 加载数据
     * 
     * @param {*} [opt={}] 参数
     * @returns {Observable<any>}  事件回调
     * @memberof IBizForm
     */
    public load(opt: any = {}): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let arg: any = {};
        Object.assign(arg, opt);
        const subject = new Subject();

        this.post(arg).subscribe((data) => {
            if (data.ret === 0) {
                subject.next(data);
            } else {
                subject.error(data);
            }
        }, (data) => {
            subject.error(data);
        });

        return subject;
    }

    /**
     * 数据提交
     * 
     * @param {*} [opt={}] 参数
     * @returns {Observable<any>} 事件回调
     * @memberof IBizForm
     */
    public submit(opt: any = {}): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let arg: any = {};
        Object.assign(arg, opt);
        const subject = new Subject();

        this.post(arg).subscribe((data) => {
            if (data.ret === 0) {
                subject.next(data);
            } else {
                subject.error(data);
            }
        }, (data) => {
            subject.error(data);
        });

        return subject;
    }

    /**
     * 返回错误提示信息
     * 
     * @param {*} [action={}] 
     * @returns {string} 
     * @memberof IBizForm
     */
    public getActionErrorInfo(action: any = {}): string {
        if (action.failureType === 'CONNECT_FAILURE') {
            return 'Status:' + action.response.status + ': ' + action.response.statusText;
        }
        if (action.failureType === 'SERVER_INVALID') {
            let msg: string;
            if (action.errorMessage) {
                msg = action.errorMessage;
            }
            if (action.error && action.error.items) {
                const items: Array<any> = action.error.items;
                items.forEach((item, index) => {
                    if (index >= 5) {
                        msg += ('...... ');
                        return false;
                    }
                    if (item.info && !Object.is(item.info, '') && msg.indexOf(item.info) < 0) {
                        msg += item.info;
                    }
                });
            }
            return msg;
        }
        if (action.failureType === 'CLIENT_INVALID') {
            return '';
        }
        if (action.failureType === 'LOAD_FAILURE') {
            return '';
        }
    }

    /**
     * 填充表单
     * 
     * @param {*} [data={}] 
     * @memberof IBizForm
     */
    public fillForm(data: any = {}): void {
        const fillDatas: Array<any> = Object.keys(data);
        fillDatas.forEach((name) => {
            const field = this.findField(name);
            if (field) {
                let _value = data[name];
                if (_value instanceof Array || _value instanceof Object) {
                    _value = JSON.stringify(_value);
                }
                field.setValue(_value);
            }
        });
    }

    /**
     * 设置表单项值
     * 
     * @param {string} name 
     * @param {*} value 
     * @memberof IBizForm
     */
    public setFieldValue(name: string, value: any): void {
        const field = this.findField(name);
        if (field) {
            field.setValue(value);
        }
    }

    /**
     * 获取表单项值
     * 
     * @param {string} name 
     * @returns {*} 
     * @memberof IBizForm
     */
    public getFieldValue(name: string): any {

        const field = this.findField(name);
        if (!field) {
            // IBiz.alert($IGM('IBIZFORM.GETFIELDVALUE.TITLE', '获取失败'), $IGM('IBIZFORM.GETFIELDVALUE.INFO', '无法获取表单项[' + name + ']', [name]), 2);
            this.$iBizNotification.error('获取失败', '无法获取表单项[' + name + ']');
            return '';
        }
        return field.getValue();
    }

    /**
     * 设置表单项允许为空
     * 
     * @param {string} name 
     * @param {boolean} allowblank 
     * @memberof IBizForm
     */
    public setFieldAllowBlank(name: string, allowblank: boolean): void {

        const field = this.findField(name);
        if (field) {
            field.setAllowBlank(allowblank);
        }
    }

    /**
     * 设置表单项属性是否禁用
     * 
     * @param {string} name 
     * @param {boolean} disabled 
     * @memberof IBizForm
     */
    public setFieldDisabled(name: string, disabled: boolean): void {

        const field = this.findField(name);
        if (field) {
            field.setDisabled(disabled);
        }
    }

    /**
     * 设置表单错误
     * 
     * @param {any} formerror 
     * @memberof IBizForm
     */
    public setFormError(formerror: any): void {
        this.resetFormError();
        if (formerror && formerror.items) {
            const errorItems: Array<any> = formerror.items;
            errorItems.forEach(item => {
                const name: string = item.id;
                if (name) {
                    const _item: any = this.$fields[name];
                    _item.setErrorInfo({ validateStatus: 'error', hasError: true, errorInfo: item.info });
                }
            });
        }
    }

    /**
     * 
     * 
     * @memberof IBizForm
     */
    public resetFormError(): void {
        const itemsData: Array<any> = Object.keys(this.$fields);
        itemsData.forEach(name => {
            const item = this.$fields[name];
            item.setErrorInfo({ validateStatus: 'success', hasError: false, errorInfo: '' });
        });
    }

    /**
     * 设置面板,表单项<分组、分页面板>隐藏
     * 
     * @param {string} name 
     * @param {boolean} visible 
     * @memberof IBizForm
     */
    public setPanelVisible(name: string, visible: boolean): void {

        const field = this.findField(name);
        if (field) {
            field.setVisible(visible);
        }
    }

    /**
     * 获取当前表单项值
     * 
     * @returns {*} 
     * @memberof IBizForm
     */
    public getActiveData(): any {
        // tslint:disable-next-line:prefer-const
        let values: any = {};
        const items: Array<any> = Object.keys(this.$fields);
        items.forEach(name => {
            const field = this.findField(name);
            if (field && (Object.is(field.fieldType, 'FORMITEM') || Object.is(field.fieldType, 'HIDDENFORMITEM'))) {
                const value = field.getValue();
                if (Object.keys(values).length <= 1000) {
                    values[name] = value;
                }
            }

        });
        return values;
    }

    /**
     * 获取全部表单项值
     * 
     * @returns {*} 
     * @memberof IBizForm
     */
    public getValues(): any {
        // tslint:disable-next-line:prefer-const
        let values: any = {};
        const items: Array<any> = Object.keys(this.$fields);
        items.forEach(name => {
            const field = this.findField(name);
            if (field && (Object.is(field.fieldType, 'FORMITEM') || Object.is(field.fieldType, 'HIDDENFORMITEM'))) {
                const value = field.getValue();
                values[name] = value;
            }

        });
        return values;
    }

    /**
     * 
     * 
     * @param {*} value 
     * @returns {boolean} 
     * @memberof IBizForm
     */
    public testFieldEnableReadonly(value: any): boolean {
        return false;
    }

    /**
     * 更新表单项
     * 
     * @param {string} mode 更新模式
     * @returns {void} 
     * @memberof IBizForm
     */
    public updateFormItems(mode: string): void {

        if (this.$ignoreUFI) {
            return;
        }
        const activeData = this.getActiveData();
        // tslint:disable-next-line:prefer-const
        let arg: any = {};

        this.fire(IBizEvent.IBizForm_UPDATEFORMITEMBEFORE, activeData);

        Object.assign(arg, { srfaction: 'updateformitem', srfufimode: mode, srfactivedata: JSON.stringify(activeData), srfctrlid: this.getName() });
        this.$ignoreUFI = true;
        // this.$ignoreformfieldchange=true;
        this.load(arg).subscribe((action) => {
            this.fire(IBizEvent.IBizForm_UPDATEFORMITEMED, action.data);
            this.setFieldAsyncConfig(action.config);
            this.setFieldState(action.state);
            if (action.$dataaccaction) {
                this.setDataAccAction(action.dataaccaction);
            }
            this.fillForm(action.data);
            this.$ignoreUFI = false;
            // this.$ignoreformfieldchange=false;
        }, (action) => {
            action.failureType = 'SERVER_INVALID';
            // IBiz.alert($IGM('IBIZFORM.UPDATEFORMITEMS.TITLE', '更新失败'), $IGM('IBIZFORM.UPDATEFORMITEMS.INFO', '更新表单项发生错误,' + action.info, [action.info]), 2);
            this.$iBizNotification.error('更新失败', '更新表单项发生错误, ' + action.info);
            this.$ignoreUFI = false;
            // this.$ignoreformfieldchange=false;
        });
    }

    /**
     * 重置表单
     * 
     * @memberof IBizForm
     */
    public reset(): void {
        this.autoLoad();
    }

    /**
     * 获取表单类型
     * 
     * @returns {string} 
     * @memberof IBizForm
     */
    public getFormType(): string {
        return undefined;
    }

    /**
     * 
     * 
     * @param {string} fieldName 
     * @param {boolean} state 
     * @param {string} errorInfo 
     * @memberof IBizForm
     */
    public setFormFieldChecked(fieldName: string, state: boolean, errorInfo: string): void {
        const field = this.findField(fieldName);
        if (field) {
            field.setErrorInfo({ validateStatus: state ? 'error' : 'success', hasError: state ? true : false, errorInfo: state ? errorInfo : '' });
        }
    }
}
