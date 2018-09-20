import { IBizControl } from './ibiz-control';

/**
 * 自定义部件服务对象
 * 
 * @export
 * @class IBizCustom
 * @extends {IBizControl}
 */
export class IBizCustom extends IBizControl {

    /**
     * Creates an instance of IBizCustom.
     * 创建 IBizCustom 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizCustom
     */
    constructor(opts: any = {}) {
        super(opts);
    }
}

