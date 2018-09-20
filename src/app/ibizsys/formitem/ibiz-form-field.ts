import { IBizFormItem } from './ibiz-form-item';

/**
 * 表单项
 * 
 * @export
 * @class IBizFormField
 * @extends {IBizFormItem}
 */
export class IBizFormField extends IBizFormItem {

    /**
     * label 宽度
     *
     * @type {string}
     * @memberof IBizFormField
     */
    public labelWidth: string;

    /**
     * Creates an instance of IBizFormField.
     * 创建 IBizFormField 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizFormField
     */
    constructor(opts: any = {}) {
        super(opts);
        this.labelWidth = opts.labelWidth;
    }
}
