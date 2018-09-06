import { IBizMainViewController } from './IBizMainViewController';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IBizEvent } from '../IBizEvent';

/**
 * 导航视图控制器
 * 
 * @export
 * @class IBizExpViewController
 * @extends {IBizMainViewController}
 */
export class IBizExpViewController extends IBizMainViewController {

    /**
     * 导航路由事件
     *
     * @private
     * @type {*}
     * @memberof IBizExpViewController
     */
    private $expRouteRvents: any;

    /**
     * Creates an instance of IBizExpViewController.
     * 创建 IBizExpViewController 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizExpViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 初始化导航部件
     * 
     * @memberof IBizExpViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const expCtrl = this.getExpCtrl();
        if (expCtrl) {
            // 树导航部件选中变化
            expCtrl.on(IBizEvent.IBizTreeExpBar_SELECTIONCHANGE).subscribe((item) => {
                this.onExpCtrlSelectionChange(item);
            });
            // 树导航部件加载完成
            expCtrl.on(IBizEvent.IBizTreeExpBar_LOADED).subscribe((item) => {
                this.onExpCtrlLoaded(item);
            });
        }

        this.$expRouteRvents = this.$router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe((evt: NavigationEnd) => {
            const _expCtrl = this.getExpCtrl();
            if ((!_expCtrl) || (!this.isInited()) || (Object.keys(this.$activatedRouteData).length === 0)) {
                return;
            }

            const childRouteData: any = this.$iBizApp.getActivatedRouteDatas(this.$activatedRouteData.index + 1);
            if (Object.keys(childRouteData).length > 0) {
                return;
            } else {
                const items: Array<any> = _expCtrl.getItems();
                this.openExpChildView(items[0]);
            }
        });
    }

    /**
     * 导航部件加载
     * 
     * @memberof IBizExpViewController
     */
    public onLoad(): void {
        const expCtrl = this.getExpCtrl();
        if (expCtrl) {
            expCtrl.load({});
        }
    }

    /**
     * 视图销毁
     *
     * @memberof IBizExpViewController
     */
    public onDestroy(): void {
        super.onDestroy();
        if (this.$expRouteRvents) {
            this.$expRouteRvents.unsubscribe();
        }
    }

    /**
     * 获取导航部件
     * 
     * @returns {*} 
     * @memberof IBizExpViewController
     */
    public getExpCtrl(): any {
        let expctrl = this.getExpBar();
        if (expctrl) {
            return expctrl;
        }

        expctrl = this.getExpTab();
        if (expctrl) {
            return expctrl;
        }

        return undefined;
    }

    /**
     * 获取导航部件
     * 
     * @returns {*} 
     * @memberof IBizExpViewController
     */
    public getExpBar(): any {
        return this.$controls.get('expbar');
    }

    /**
     * 获取导航分页部件
     * 
     * @returns {*} 
     * @memberof IBizExpViewController
     */
    public getExpTab(): any {
        return this.$controls.get('exptab');
    }

    /**
     * 导航部件值选中变化
     *
     * @param {*} [item={}]
     * @memberof IBizExpViewController
     */
    public onExpCtrlSelectionChange(item: any = {}): void {

    }

    /**
     * 导航树部件加载完成
     *
     * @param {*} [item={}]
     * @memberof IBizExpViewController
     */
    public onExpCtrlLoaded(item: any = {}): void {

    }

    /**
     * 获取导航项视图参数，在发布视图控制器内重写
     * 
     * @param {*} [arg={}] 
     * @returns {*} 
     * @memberof IBizExpViewController
     */
    public getExpItemView(arg: any = {}): any {
        return undefined;
    }

    /**
     * 获取新建导航视图参数，在发布视图控制器中重写
     * 
     * @param {*} [arg={}] 
     * @returns {*} 
     * @memberof IBizExpViewController
     */
    public getNewDataView(arg: any = {}): any {
        return undefined;
    }

    /**
     * 获取编辑导航视图参数，在发布视图控制器中重写
     * 
     * @param {*} [arg={}] 
     * @returns {*} 
     * @memberof IBizExpViewController
     */
    public getEditDataView(arg: any = {}): any {
        return undefined;
    }

    /**
     * 节点路由是否存在
     *
     * @param {string} routeLink
     * @returns {boolean}
     * @memberof IBizExpViewController
     */
    public hasRoute(routeLink: string): boolean {
        let hasRoute = false;
        if (this.$activatedRoute && this.$activatedRoute.routeConfig && this.$activatedRoute.routeConfig.children !== null) {
            const index: number = this.$activatedRoute.routeConfig.children.findIndex(item => Object.is(item.path, routeLink));
            hasRoute = (index !== -1) ? true : false;
        }
        return hasRoute;
    }

    /**
     * 是否需要手动跳转路由
     * 
     * @private
     * @param {*} [item={}] 
     * @returns {boolean} 
     * @memberof IBizTreeExpViewController
     */
    public isRefreshView(routeSting: string): boolean {
        let refreshView = false;
        if (this.$activatedRoute && this.$activatedRoute.children && this.$activatedRoute.children.length > 0) {
            const arr = this.$activatedRoute.children[0];
            if (Object.is(arr.routeConfig.path, routeSting.toLowerCase())) {
                refreshView = true;
            }
        }
        return refreshView;
    }

    /**
     * 打开导航子视图
     *
     * @param {*} [item={}]
     * @returns {void}
     * @memberof IBizExpViewController
     */
    public openExpChildView(item: any = {}): void {
        if (!item || Object.keys(item).length === 0) {
            return;
        }
        const view = this.getExpItemView(item.expitem);
        if (!view) {
            return;
        }
        const hasRouter: boolean = this.hasRoute(view.routelink);
        if (!hasRouter) {
            return;
        }

        // tslint:disable-next-line:prefer-const
        let data: any = {};
        Object.assign(data, item.expitem.viewparam);
        if (this.isRefreshView(view.routelink)) {
            Object.assign(data, { refreshView: true });
        }
        const exp = this.getExpBar();
        if (exp) {
            exp.setSelectItem(item);
        }
        this.openView(view.routelink, data);
    }

}
