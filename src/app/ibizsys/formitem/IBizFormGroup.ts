import { IBizFormItem } from './IBizFormItem';

/**
 * 表单分组
 * 
 * @export
 * @class IBizFormGroup
 * @extends {IBizFormItem}
 */
export class IBizFormGroup extends IBizFormItem {

    /**
     * 标题栏关系模式
     *
     * @type {number}
     * @memberof IBizFormGroup
     */
    public titleBarCloseMode: number;

    /**
     * 部件集合
     * 
     * @type {*}
     * @memberof IBizFormGroup
     */
    public $editor: any = {};

    /**
     * Creates an instance of IBizFormGroup.
     * 创建 IBizFormGroup 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizFormGroup
     */
    constructor(opts: any = {}) {
        super(opts);
        this.titleBarCloseMode = opts.titleBarCloseMode;
    }

    /**
     * 注册部件
     * 
     * @param {string} name 
     * @param {*} editor 
     * @memberof IBizFormGroup
     */
    public regEditor(name: string, editor: any) {
        if (name) {
            this.$editor[name] = editor;
        }
    }

    /**
     * 获取指定部件
     * 
     * @param {string} name 
     * @memberof IBizFormGroup
     */
    public getEditor(name: string): any {
        if (name) {
            return this.$editor[name];
        }
        return null;
    }

    /**
     * 设置是否启用
     * 
     * @param {boolean} disabled 
     * @memberof IBizFormGroup
     */
    public setDisabled(disabled: boolean): void {
        this.disabled = disabled;
    }


    /**
     * 隐藏控件
     * 
     * @param {boolean} hidden 
     * @memberof IBizFormGroup
     */
    public setHidden(hidden: boolean): void {
        this.hidden = hidden;
    }

    /**
     * 设置可见性
     * 
     * @param {boolean} visible 
     * @memberof IBizFormGroup
     */
    public setVisible(visible: boolean): void {
        this.visible = visible;
    }
}
