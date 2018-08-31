import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IBizEditViewController } from './IBizEditViewController';
import { IBizEvent } from '../IBizEvent';

/**
 * 左右编辑视图控制器
 * 
 * @export
 * @class IBizEditView2Controller
 * @extends {IBizEditViewController}
 */
export class IBizEditView2Controller extends IBizEditViewController {

    /**
     * 默认选中项,展示表单
     * 
     * @memberof IBizEditView2Controller
     */
    public $selectIndex = 0;

    /**
     * 导航路由事件
     *
     * @private
     * @type {*}
     * @memberof IBizEditView2Controller
     */
    private $expRouteRvents: any;

    /**
     * Creates an instance of IBizEditView2Controller.
     * 创建IBizEditView2Controller实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizEditView2Controller
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 初始化部件
     * 
     * @memberof IBizEditView2Controller
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const drBar: any = this.getDRBar();
        if (drBar) {
            // 关系数据部件加载完成
            drBar.on(IBizEvent.IBizDRBar_DRBARLOADED, (item) => {
                this.DRBarLoaded(item);
            });
            // 关系部件选中变化
            drBar.on(IBizEvent.IBizDRBar_DRBARSELECTCHANGE, (item) => {
                this.DRBarItemChangeSelect(item);
            });
        }

        this.$expRouteRvents = this.$router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe((evt: NavigationEnd) => {
            const _drBar: any = this.getDRBar();
            if ((!_drBar) || (!this.isInited()) || (Object.keys(this.$activatedRouteData).length === 0)) {
                return;
            }

            // tslint:disable-next-line:prefer-const
            let _item: any = {};

            const childRouteData: any = this.$iBizApp.getActivatedRouteDatas(this.$activatedRouteData.index + 1);
            if (Object.keys(childRouteData).length > 0) {
                return;
            } else if (this.isHideEditForm()) {
                let children: Array<any> = [];
                if (this.$activatedRoute && this.$activatedRoute.routeConfig && this.$activatedRoute.routeConfig.children !== null) {
                    children = [...this.$activatedRoute.routeConfig.children];
                }
                if (children.length > 0) {
                    Object.assign(_item, _drBar.getItem(children[0].path, _drBar.getItems()));
                }
            } else {
                Object.assign(_item, _drBar.getItem('form', _drBar.getItems()));
            }
            if (Object.keys(_item).length === 0) {
                return;
            }

            if (Object.is(_item.id.toLocaleLowerCase(), 'form')) {
                this.$selectIndex = 0;
            } else {
                this.$selectIndex = 100;
                this.DRBarItemChangeSelect(_item);
            }
            drBar.setDefaultSelectItem(_item);
        });
    }

    /**
     * 视图加载，处理视图是否有表单主键
     * 
     * @returns {void} 
     * @memberof IBizEditView2Controller
     */
    public onLoad(): void {
        if (!this.getForm()) {
            this.$iBizNotification.error('错误', '视图表单不存在！');
            return;
        }
        super.onLoad();

    }

    /**
     * 视图销毁
     *
     * @memberof IBizEditView2Controller
     */
    public onDestroy(): void {
        super.onDestroy();
        if (this.$expRouteRvents) {
            this.$expRouteRvents.unsubscribe();
        }
    }

    /**
     * 关系数据项加载完成
     * 
     * @private
     * @param {*} [item={}] 
     * @returns {void} 
     * @memberof IBizEditView2Controller
     */
    private DRBarLoaded(items: Array<any>): void {
        const form = this.getForm();
        if (form.findField('srfkey') && !Object.is(form.findField('srfkey').getValue(), '')) {
            if (this.isHideEditForm()) {
                this.$selectIndex = 1;
            }
        } else if (this.isHideEditForm()) {
            this.$iBizNotification.error('错误', '新建模式，编辑表单不允许隐藏!');
            return;
        } else {
            this.$selectIndex = 0;
        }
        if (items.length !== 0) {
            this.DRBarItemChangeSelect(items[0]);
        }
    }

    /**
     * 表单部件加载完成
     * 
     * @param {any} params 
     * @memberof IBizEditView2Controller
     */
    public onFormLoaded(): void {
        super.onFormLoaded();
        const drBar: any = this.getDRBar();
        if (drBar) {
            drBar.load();
        }
    }

    /**
     * 是否影藏编辑表单
     * 
     * @returns {boolean} 
     * @memberof IBizEditView2Controller
     */
    public isHideEditForm(): boolean {
        return false;
    }

    /**
     * 关联数据更新
     * 
     * @returns {void} 
     * @memberof IBizEditView2Controller
     */
    public updateViewInfo(): void {
        super.updateViewInfo();
        const form = this.getForm();
        if (!form) {
            return;
        }
        const field = form.findField('srfkey');
        if (!field) {
            return;
        }
        let keyvalue = field.getValue();

        const srforikey = form.findField('srforikey');
        if (field) {
            const keyvalue2 = field.getValue();
            if (keyvalue2 && !Object.is(keyvalue2, '')) {
                keyvalue = keyvalue2;
            }
        }
        let deid = '';
        const deidfield = form.findField('srfdeid');
        if (deidfield) {
            deid = deidfield.getValue();
        }
        // tslint:disable-next-line:prefer-const
        let parentData: any = { srfparentkey: keyvalue };
        if (!Object.is(deid, '')) {
            parentData.srfparentdeid = deid;
        }
        // me.getDRBar().setParentData(parentData);
    }

    /**
     * 数据项选中变化
     * 
     * @private
     * @param {*} [item={}] 
     * @memberof IBizEditView2Controller
     */
    private DRBarItemChangeSelect(item: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let viewParam: any = item.dritem.viewparam;

        if (!Object.is(item.id, 'form')) {
            this.$selectIndex = 10;
            const form = this.getForm();
            if (!form) {
                this.$selectIndex = 0;
                this.$iBizNotification.error('错误', '视图异常，表单不存在!');
                this.setDrBarSelect('form');
                return;
            }

            const _srfkeyFiled = form.findField('srfkey');
            if (!_srfkeyFiled) {
                this.$selectIndex = 0;
                this.$iBizNotification.error('警告', '表单主数据不存在!');
                this.setDrBarSelect('form');
                return;
            }
            const srfkey = _srfkeyFiled.getValue();
            if (Object.is(srfkey, '')) {
                this.$selectIndex = 0;
                this.$iBizNotification.error('警告', '表单未保存!');
                this.setDrBarSelect('form');
                return;
            }

            viewParam.srfparentkey = srfkey;
            this.$isShowToolBar = false;
        } else {
            this.$selectIndex = 0;
            this.$isShowToolBar = true;
        }
        this.setDrBarSelect(item.id);
        this.openView(item.id, viewParam);
    }



    /**
     * 获取数据关系部件
     * 
     * @returns {any} 
     * @memberof IBizEditView2Controller
     */
    public getDRBar(): any {
        return this.$controls.get('drbar');
    }

    /**
     * 设置关系数据选中项
     * 
     * @param {string} subRouterLink 
     * @memberof IBizEditView2Controller
     */
    public setDrBarSelect(subRouterLink: string): void {
        const drBar: any = this.getDRBar();
        if (!drBar) {
            return;
        }
        const _item: any = drBar.getItem(subRouterLink, drBar.getItems());

        if (Object.keys(_item).length !== 0) {
            drBar.setDefaultSelectItem(_item);
        }
    }

    /**
     * 节点路由是否存在
     *
     * @param {string} routeLink
     * @returns {boolean}
     * @memberof IBizEditView2Controller
     */
    public hasRoute(routeLink: string): boolean {
        let hasRoute = false;
        if (this.$activatedRoute && this.$activatedRoute.routeConfig && this.$activatedRoute.routeConfig.children != null) {
            const router: Array<any> = this.$activatedRoute.routeConfig.children.filter(item => Object.is(item.path.toLowerCase(), routeLink.toLowerCase()));

            if (router.length > 0) {
                hasRoute = true;
            }
        }
        return hasRoute;
    }
}

