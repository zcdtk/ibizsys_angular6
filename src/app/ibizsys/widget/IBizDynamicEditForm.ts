import { IBizEditForm } from './IBizEditForm';

/**
 * 动态表单部件控制器
 *
 * @export
 * @class IBizDynamicEditForm
 * @extends {IBizEditForm}
 */
export class IBizDynamicEditForm extends IBizEditForm {

    /**
     * Creates an instance of IBizDynamicEditForm.
     * 创建 IBizDynamicEditForm 实例
     * 
     * @param {*} [opt={}]
     * @memberof IBizDynamicEditForm
     */
    constructor(opt: any = {}) {
        super(opt);
    }

}
