import { IBizObject } from '../IBizObject';
import { IBizEvent } from '../IBizEvent';

/**
 * 表单属性对象<主要管理属性及其标签的值、可用、显示、必填等操作>
 * 
 * @export
 * @class IBizFormItem
 * @extends {IBizService}
 */
export class IBizFormItem extends IBizObject {

    /**
     * 是否是必填
     * 
     * @type {boolean}
     * @memberof IBizFormItem
     */
    public allowEmpty: boolean;

    /**
     * 属性动态配置值<代码表>
     *
     * @type {Array<any>}
     * @memberof IBizFormItem
     */
    public config: Array<any> = [];

    /**
     * 标题
     *
     * @type {string}
     * @memberof IBizFormItem
     */
    public caption: string;

    /**
     * 属性动态配置值<用户字典>
     *
     * @type {Array<any>}
     * @memberof IBizFormItem
     */
    public dictitems: Array<any> = [];

    /**
     * 表单项是否禁用
     *
     * @type {boolean}
     * @memberof IBizFormItem
     */
    public disabled: boolean;

    /**
     * 标签是否为空
     *
     * @type {boolean}
     * @memberof IBizFormItem
     */
    public emptyCaption: boolean;

    /**
     * 表达校验错误信息
     *
     * @type {string}
     * @memberof IBizFormItem
     */
    public errorInfo: string = '';


    /**
     *表单项类型
     * 
     * @private
     * @type {string}
     * @memberof IBizFormItem
     */
    public fieldType: string;

    /**
     * 表单对象
     * 
     * @private
     * @type {*}
     * @memberof IBizFormItem
     */
    public form: any;

    /**
     * 隐藏表单项
     *
     * @type {boolean}
     * @memberof IBizFormItem
     */
    public hidden: boolean;

    /**
     * 是否有错误信息
     * 
     * @type {boolean}
     * @memberof IBizFormItem
     */
    public hasError: boolean = false;

    /**
     * 表单项名称
     *
     * @type {string}
     * @memberof IBizFormItem
     */
    public name: string;

    /**
     * 是否显示标题
     *
     * @type {boolean}
     * @memberof IBizFormItem
     */
    public showCaption: boolean;

    /**
     * 表单项校验状态
     * 
     * @type {string}
     * @memberof IBizFormItem
     */
    public validateStatus: string = 'success';


    /**
     * 是否可见
     * 
     * @type {boolean}
     * @memberof IBizFormItem
     */
    public visible: boolean;


    /**
     * 表单项的值
     * 
     * @private
     * @type {string}
     * @memberof IBizFormItem
     */
    private $value: string;

    /**
     * Creates an instance of IBizFormItem.
     * 创建 IBizFormItem 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizFormItem
     */
    constructor(opts: any = {}) {
        super(opts);
        this.allowEmpty = opts.allowEmpty ? true : false;
        this.caption = opts.caption;
        this.disabled = opts.disabled ? true : false;
        this.emptyCaption = opts.emptyCaption ? true : false;
        this.fieldType = opts.fieldType;
        this.form = opts.form;
        this.hidden = opts.hidden ? true : false;
        this.name = opts.name;
        this.showCaption = opts.showCaption ? true : false;
        this.visible = opts.visible ? true : false;
    }

    /**
     * 设置值
     * 
     * @memberof IBizFormItem
     */
    set value(val) {
        const oldVal = this.$value;
        this.$value = val;
        if (oldVal !== this.$value) {
            this.onValueChanged(oldVal);
        }
    }

    /**
     * 获取值
     * 
     * @type {string}
     * @memberof IBizFormItem
     */
    get value(): string {
        return this.$value ? this.$value : '';
    }

    /**
     * 获取表单项类型
     * 
     * @returns {string} 
     * @memberof IBizFormItem
     */
    public getFieldType(): string {
        return this.fieldType;
    }

    /**
     * 设置表单对象
     * 
     * @param {*} form 
     * @memberof IBizFormItem
     */
    public setForm(form: any): void {
        this.form = form;
    }

    /**
     * 获取表单对象
     * 
     * @returns {*} 
     * @memberof IBizFormItem
     */
    public getForm(): any {
        return this.form;
    }

    /**
     * 获取值
     * 
     * @returns {*} 
     * @memberof IBizFormItem
     */
    public getValue(): any {
        return this.value;
    }

    /**
     * 设置值
     * 
     * @param {string} value 
     * @memberof IBizFormItem
     */
    public setValue(value: string): void {
        this.value = value;
    }

    /**
     * 获取属性名
     * 
     * @returns {string} 
     * @memberof IBizFormItem
     */
    public getName(): string {
        return this.name;
    }

    /**
     * 是否启用
     * 
     * @returns {boolean} 
     * @memberof IBizFormItem
     */
    public isDisabled(): boolean {
        return this.disabled;
    }

    /**
     * 设置是否启用
     * 
     * @param {boolean} disabled 
     * @memberof IBizFormItem
     */
    public setDisabled(disabled: boolean): void {
        this.disabled = disabled;
    }

    /**
     * 隐藏控件
     * 
     * @param {boolean} hidden 
     * @memberof IBizFormItem
     */
    public setHidden(hidden: boolean): void {
        this.hidden = hidden;

    }

    /**
     * 设置可见性
     * 
     * @param {boolean} visible 
     * @memberof IBizFormItem
     */
    public setVisible(visible: boolean): void {
        this.visible = visible;
    }

    /**
     * 设置属性动态配置
     *
     * @param {Array<any>} config 代码表
     * @memberof IBizFormItem
     */
    public setAsyncConfig(config: Array<any>): void {
        if (Array.isArray(config)) {
            this.config = [...config];
        }
    }

    /**
     * 设置用户字典
     *
     * @param {Array<any>} item
     * @memberof IBizFormItem
     */
    public setDictItems(item: Array<any>): void {
        if (Array.isArray(item)) {
            this.dictitems = [...item];
        }
    }

    /**
     * 设置只读<Ext版本方法禁止使用>
     * 
     * @param {boolean} readonly 
     * @memberof IBizFormItem
     */
    public setReadOnly(readonly: boolean): void {
        this.setDisabled(readonly);
    }

    /**
     * 编辑是否必须输入
     * 
     * @param {boolean} allowblank 
     * @memberof IBizFormItem
     */
    public setAllowBlank(allowblank: boolean): void {
    }

    /**
     * 标记表单项值无效提示
     * 
     * @param {*} info 
     * @memberof IBizFormItem
     */
    public markInvalid(info: any): void {
    }

    /**
     * 设置表单项错误
     * 
     * @param {*} info 
     * @memberof IBizFormItem
     */
    public setActiveError(info: any): void {
        this.markInvalid(info);
    }

    /**
     * 表单项是否有错误
     * 
     * @returns {boolean} 
     * @memberof IBizFormItem
     */
    public hasActiveError(): boolean {
        return this.hasError;
    }

    /**
     * 重置表单项错误
     * 
     * @memberof IBizFormItem
     */
    public unsetActiveError(): void {
        this.hasError = false;
    }

    /**
     * 值变化
     * 
     * @param {string} oldValue 
     * @param {string} newValue 
     * @memberof IBizFormItem
     */
    public onValueChanged(oldValue: string): void {
        this.fire(IBizEvent.IBizFormItem_VALUECHANGED, { name: this.getName(), value: oldValue, field: this });
    }

    /**
     * 输入框失去焦点触发
     * 
     * @param {*} $event 
     * @memberof IBizFormItem
     */
    public onBlur($event: any): void {
        if (!$event) {
            return;
        }
        if (Object.is($event.target.value, this.value)) {
            return;
        }
        this.value = $event.target.value;
    }

    /**
     * 键盘事件
     *
     * @param {*} $event
     * @returns {void}
     * @memberof IBizFormItem
     */
    public onKeydown($event: any): void {
        if (!$event) {
            return;
        }
        if ($event.keyCode !== 13) {
            return;
        }
        if (Object.is($event.target.value, this.value)) {
            return;
        }

        this.value = $event.target.value;
    }

    /**
     * 设置表单项错误信息
     * 
     * @param {*} [info={}] 
     * @memberof IBizFormItem
     */
    public setErrorInfo(info: any = {}): void {
        this.validateStatus = info.validateStatus;
        this.hasError = info.hasError;
        this.errorInfo = info.errorInfo;
    }
}
