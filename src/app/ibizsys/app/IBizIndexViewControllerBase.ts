import { IBizMainViewController } from './IBizMainViewController';

/**
 * 首页应用视图基类，处理主题菜单服务对象
 * 
 * @export
 * @class IBizIndexViewControllerBase
 * @extends {IBizMainViewController}
 */
export class IBizIndexViewControllerBase extends IBizMainViewController {

    /**
     * Creates an instance of IBizIndexViewControllerBase.
     * 创建 IBizIndexViewControllerBase 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizIndexViewControllerBase
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 应用菜单部件加载完成
     * 
     * @param {any[]} items 
     * @memberof IBizIndexViewControllerBase
     */
    public appMenuLoaded(items: any[]): void {
    }
}
