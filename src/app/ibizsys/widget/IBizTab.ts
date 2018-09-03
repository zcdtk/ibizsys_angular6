import { IBizControl } from './IBizControl';

/**
 * 分页部件服务对象
 * 
 * @export
 * @class IBizTab
 * @extends {IBizControl}
 */
export class IBizTab extends IBizControl {

    /**
     * 激活分页部件分页数
     * 
     * @type {number}
     * @memberof IBizTab
     */
    public $activeTabIndex: number = 0;

    /**
     * 分页部件对象
     * 
     * @type {*}
     * @memberof IBizTab
     */
    public $tabs: any = {};

    /**
     * Creates an instance of IBizTab.
     * 创建 IBizTab 实例
     * @param {*} [opts={}] 
     * @memberof IBizTab
     */
    constructor(opts: any = {}) {
        super(opts);
        this.regTabs();
    }

    /**
     * 注册所有分页部件对象
     * 
     * @memberof IBizTab
     */
    public regTabs(): void {

    }

    /**
     * 注册分页部件对象
     * 
     * @param {*} [tab={}] 
     * @memberof IBizTab
     */
    public regTab(tab: any = {}): void {
        if (Object.keys(tab).length > 0 && tab.name) {
            this.$tabs[tab.name] = tab;
        }
    }

    /**
     * 获取分页部件对象
     * 
     * @param {string} name 
     * @returns {*} 
     * @memberof IBizTab
     */
    public getTab(name: string): any {
        if (this.$tabs[name]) {
            return this.$tabs[name];
        }
        return undefined;
    }

    /**
     * 设置激活分页数
     * 
     * @param {number} index 
     * @memberof IBizTab
     */
    public setActiveTab(index: number): void {
        setTimeout(() => {
            this.$activeTabIndex = index;
        });
    }
}
