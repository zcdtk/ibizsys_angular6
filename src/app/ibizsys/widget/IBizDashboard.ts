import { IBizControl } from './IBizControl';

/**
 * 数据看板
 *
 * @export
 * @class IBizDashboard
 * @extends {IBizControl}
 */
export class IBizDashboard extends IBizControl {

    /**
     * Creates an instance of IBizDashboard.
     * 创建 IBizDashboard 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizDashboard
     */
    constructor(opts: any = {}) {
        super(opts);
    }
}
