import { IBizFormItem } from './IBizFormItem';

/**
 * 表单项
 * 
 * @export
 * @class IBizFormField
 * @extends {IBizFormItem}
 */
export class IBizFormField extends IBizFormItem {

    /**
     * Creates an instance of IBizFormField.
     * 创建 IBizFormField 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizFormField
     */
    constructor(opts: any = {}) {
        super(opts);
    }
}
