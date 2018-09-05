import { IBizMainViewController } from './IBizMainViewController';
import { IBizEvent } from '../IBizEvent';
import { SettingService } from '../service/setting.service';

/**
 * 首页应用视图
 * 
 * @export
 * @class IBizIndexViewController
 * @extends {IBizMainViewController}
 */
export class IBizIndexViewController extends IBizMainViewController {

    /**
     * 是否收缩内容
     *
     * @type {boolean}
     * @memberof IBizIndexViewController
     */
    public isCollapsed: boolean = false;

    /**
     * 基础设置服务
     *
     * @private
     * @type {SettingService}
     * @memberof IBizIndexViewController
     */
    private settingService: SettingService;

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
        this.settingService = opts.settingService;
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
            appMenu.on(IBizEvent.IBizAppMenu_MENUSELECTION).subscribe((items: any) => {
                this.appMenuSelected(items);
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
            if (this.$activatedRouteData && this.$activatedRouteData.index) {
                const nextRouterData = this.$iBizApp.$activatedRouteDatas[this.$activatedRouteData.index + 1];
                appMenu.setAppMenuSelected(nextRouterData);
            }
        }
        this.setMianMenuState();
    }

    /**
     * 视图初始化完成
     *
     * @memberof IBizIndexViewController
     */
    public onInited(): void {
        this.settingService.menuCollapsed().subscribe((state) => {
            this.isCollapsed = state;
        });
    }

    /**
     * 应用菜单部件加载完成,调用基类处理
     * 
     * @private
     * @param {any[]} items 
     * @memberof IBizIndexViewController
     */
    public appMenuLoaded(items: any[]): void {
        const nextActiveRouterData = this.$iBizApp.getActivatedRouteDatas(this.$activatedRouteData.index + 1);
        if (nextActiveRouterData) {
            this.getAppMenu().setAppMenuSelected(nextActiveRouterData);
        }
    }

    /**
     * 应用菜单选中
     *
     * @param {*} [item={}]
     * @memberof IBizIndexViewController
     */
    public appMenuSelected(item: any = {}): void {
        if (item.routerlink) {
            this.openView(item.routerlink, item.viewParams);
        }
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
