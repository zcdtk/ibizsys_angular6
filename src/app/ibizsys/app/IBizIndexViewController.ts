import { IBizIndexViewControllerBase } from './IBizIndexViewControllerBase';
import { IBizEvent } from '../IBizEvent';

/**
 * 首页应用视图
 * 
 * @export
 * @class IBizIndexViewController
 * @extends {IBizMainViewController}
 */
export class IBizIndexViewController extends IBizIndexViewControllerBase {

    /**
     * 视图类型
     *
     * @type {string}
     * @memberof IBizIndexViewController
     */
    public viewtype: string = 'index';

    /**
     * Creates an instance of IBizIndexViewController.
     * 创建 IBizIndexViewController 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizIndexViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 应用菜单部件初始化
     * 
     * @memberof IBizIndexViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const appMenu: any = this.getAppMenu();
        if (appMenu) {
            appMenu.on(IBizEvent.IBizAppMenu_LOADED).subscribe((items: Array<any>) => {
                this.appMenuLoaded(items);
            });
        }
    }

    /**
     * 部件加载
     * 
     * @memberof IBizIndexViewController
     */
    public onLoad(): void {
        super.onLoad();
        const appMenu = this.getAppMenu();
        if (appMenu) {
            appMenu.load();
        }
        this.setMianMenuState();
    }

    /**
     * 应用菜单部件加载完成,调用基类处理
     * 
     * @private
     * @param {any[]} items 
     * @memberof IBizIndexViewController
     */
    public appMenuLoaded(items: any[]): void {
        super.appMenuLoaded(items);
    }

    /**
     * 获取表单项
     * 
     * @returns {*} 
     * @memberof IBizIndexViewController
     */
    public getAppMenu(): any {
        return this.$controls.get('appmenu');
    }

    /**
     * 导航数据跳转处理
     * 
     * @param {*} [data={}] 
     * @memberof IBizIndexViewController
     */
    public navigationLink(data: any = {}) {
        Object.assign(data, { breadcrumbs: true });
        this.$iBizApp.updateActivatedRouteDatas(data);
        if (data.routerurl) {
            this.$router.navigateByUrl(data.routerurl);
        }
    }

    /**
     * 设置主菜单状态
     *
     * @param {string} [align]
     * @memberof IBizIndexViewController
     */
    public setMianMenuState(align?: string): void {
        if (Object.is(align, 'NONE')) {
            this.$iBizApp.setMainMenuState(false);
        } else {
            this.$iBizApp.setMainMenuState(true);
        }
    }
}
