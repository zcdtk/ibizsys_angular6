import { IBizMainViewController } from './IBizMainViewController';

/**
 * 自定义视图控制器对象
 * 
 * @export
 * @class IBizCustomViewController
 * @extends {IBizMainViewController}
 */
export class IBizCustomViewController extends IBizMainViewController {

    /**
     * Creates an instance of IBizCustomViewController.
     * 创建 IBizCustomViewController 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizCustomViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }
}
