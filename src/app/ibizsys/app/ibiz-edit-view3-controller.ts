import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IBizEditViewController } from './ibiz-edit-view-controller';
import { IBizEvent } from '../ibiz-event';

/**
 * 分页编辑视图
 * 
 * @export
 * @class IBizEditView3Controller
 * @extends {IBizEditViewController}
 */
export class IBizEditView3Controller extends IBizEditViewController {

    /**
     * Creates an instance of IBizEditView3Controller.
     * 创建 IBizEditView3Controller 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizEditView3Controller
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 视图部件初始化，注册所有事件
     * 
     * @memberof IBizEditView3Controller
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const drTab: any = this.getDRTab();
        if (drTab) {
            // 关系分页部件数据变化
            drTab.on(IBizEvent.IBizDRTab_SELECTCHANGE).subscribe((data) => {
                this.doDRTabSelectChange(data);
            });
        }
    }

    /**
     * 表单加载完成
     * 
     * @memberof IBizEditView3Controller
     */
    public onFormLoaded(): void {
        super.onFormLoaded();

        const _form = this.getForm();
        const drtab: any = this.getDRTab();
        if (this.isHideEditForm()) {
            const _field = _form.findField('srfkey');
            const _srfuf = _form.findField('srfuf');
            if (!_field) {
                return;
            }
            if (Object.is(_srfuf.getValue(), 0) && Object.is(_field.getValue(), '')) {
                this.$iBizNotification.warning('警告', '新建模式，表单主数据不存在');
                if (drtab) {
                    drtab.setActiveTab(0);
                }
                return;
            }
        }

        if (_form.findField('srfkey') && !Object.is(_form.findField('srfkey').getValue(), '')) {
            const index: number = this.getDRTabIndex();
            if (drtab) {
                drtab.setActiveTab(index);
            }

        }

        this.$router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe((evt: NavigationEnd) => {
            if (_form.findField('srfkey') && !Object.is(_form.findField('srfkey').getValue(), '')) {
                const index: number = this.getDRTabIndex();
                if (drtab) {
                    drtab.setActiveTab(index);
                }

            }
        });
    }

    /**
     * 是否隐藏编辑表单
     * 
     * @returns {boolean} 
     * @memberof IBizEditView3Controller
     */
    public isHideEditForm(): boolean {
        return false;
    }

    /**
     * 视图信息更新
     * 
     * @returns {void} 
     * @memberof IBizEditView3Controller
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
        if (this.getDRTab()) {
            this.getDRTab().setParentData(parentData);
        }
    }

    /**
     * 关系分页部件选择变化处理
     * 
     * @param {*} [data={}] 
     * @memberof IBizEditView3Controller
     */
    public doDRTabSelectChange(data: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let params: any = {};
        const _isShowToolBar: boolean = Object.is(data.viewid, 'form') ? true : false;
        setTimeout(() => {
            this.$isShowToolBar = _isShowToolBar;
        });
        Object.assign(params, data.parentMode);
        Object.assign(params, data.parentData);
        this.openView(data.viewid, params);
    }

    /**
     * 获取关系视图参数
     * 
     * @param {*} [arg={}] 
     * @returns {*} 
     * @memberof IBizEditView3Controller
     */
    public getDRItemView(arg: any = {}): any {

    }

    /**
     * 刷新视图
     * 
     * @memberof IBizEditView3Controller
     */
    public onRefresh(): void {
        if (this.getDRTab()) {
            this.getDRTab().refresh();
        }
    }

    /**
     * 获取关系分页部件
     * 
     * @returns {*} 
     * @memberof IBizEditView3Controller
     */
    public getDRTab(): any {
        return this.$controls.get('drtab');
    }

    private getDRTabIndex(): number {
        // tslint:disable-next-line:no-inferrable-types
        let _tab: number = 0;

        const url: string = this.$router.url;
        if (!this.$activatedRoute || !this.$activatedRoute.routeConfig || !this.$activatedRoute.routeConfig.children) {
            return _tab;
        }

        const router: Array<any> = this.$activatedRoute.routeConfig.children.filter(item => url.includes(item.path));

        if (router.length !== 1) {
            return _tab;
        }

        const subRouterConfig: any = router[0];
        const _index: number = url.indexOf(subRouterConfig.path);
        let subUrl: string = url.substring(_index + subRouterConfig.path.length + 1);
        let _end: number = subUrl.indexOf('/');
        if (_end === -1) {
            _end = subUrl.length;
        }

        const form = this.getForm();
        subUrl = subUrl.substring(0, _end);

        const _srfparentkey = `srfparentkey=+${form.findField('srfkey').getValue()}+`;
        if (subUrl.indexOf(_srfparentkey)) {
            const drtab: any = this.getDRTab();
            const _tabItem: any = drtab.getTab(subRouterConfig.path);
            if (_tabItem) {
                _tab = _tabItem.index;
            }
        }
        return _tab;


    }
}
