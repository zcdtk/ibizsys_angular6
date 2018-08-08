
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { IBizViewControllerBase } from './IBizViewControllerBase';
import { IBizUtil } from '../util/IBizUtil';
import { IBizEvent } from '../IBizEvent';
import { IBizCodeList } from '../util/IBizCodeList';
import { IBizUICounter } from '../util/IBizUICounter';


/**
 * 根视图控制器
 * 
 * @export
 * @class IBizViewController
 * @extends {IBizViewControllerBase}
 */
export class IBizViewController extends IBizViewControllerBase implements OnInit, OnDestroy, OnChanges {

    /**
     * 关系参数变化
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    @Input()
    set relationParam(data) {
        this.viewParamChange(data);
    }

    /**
     * 注入视图参数
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    @Input()
    viewParam: any;

    /**
     * 模态框打开视图注入参数
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    @Input()
    modalViewParam: any;

    /**
     * 模态框打开视图注入视图层级参数
     * 
     * @memberof IBizViewController
     */
    @Input()
    modalZIndex = 300;

    /**
     * 视图控制器父对象数据
     *
     * @type {*}
     * @memberof IBizViewController
     */
    public $parentData: any = {};

    /**
     * 视图控制器父对象模型
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    public $parentMode: any = {};

    /**
     * 视图控制器是否初始化
     * 
     * @type {boolean}
     * @memberof IBizViewController
     */
    public $bInited: boolean;

    /**
     * 视图控制器代码表
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    public $codelists: any = {};

    /**
     * 视图部件控制器
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    public $controls: Map<string, any> = new Map();

    /**
     * 视图控制器实体界面行为
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    public $uiactions: any = {};

    /**
     * 视图控制器计数器
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    public $uiCounters: Map<string, any> = new Map();

    /**
     * 视图控制器url
     *
     * @private
     * @type {string}
     * @memberof IBizViewController
     */
    private $url: string;

    /**
     * 视图控制器参数
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    public $viewParam: any = {};

    /**
     * 路由对象
     * 
     * @type {Router}
     * @memberof IBizViewController
     */
    public $router: Router;

    /**
     * 路由状态
     * 
     * @type {ActivatedRoute}
     * @memberof IBizViewController
     */
    public $activatedRoute: ActivatedRoute;

    /**
     * url历史记录对象
     * 
     * @type {LocationStrategy}
     * @memberof IBizViewController
     */
    public $locationStrategy: LocationStrategy;

    /**
     * 视图控制器标识
     * 
     * @private
     * @type {string}
     * @memberof IBizViewController
     */
    private $uuid: string;

    /**
     * 激活路由守卫数据
     * 
     * @type {*}
     * @memberof IBizViewController
     */
    public $activatedRouteData: any = {};

    /**
     *Creates an instance of IBizViewController.
     * 创建 IBizViewController 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizViewController
     */
    constructor(opts: any = {}) {
        super(opts);

        this.$url = opts.url;
        this.$router = opts.router;
        this.$activatedRoute = opts.activatedRoute;
        this.$locationStrategy = opts.locationStrategy;
        this.$iBizHttp = opts.iBizHttp;
        this.$iBizNotification = opts.iBizNotification;
        this.$uuid = IBizUtil.createUUID();
    }

    /**
     * Angular生命周期
     * 在ngOnChanges钩子之后执行，如果组件的某些初始化依赖输入属性，那么依赖输入属性的初始化一定要放在ngOnInit中执行
     * 
     * @memberof IBizViewController
     */
    ngOnInit(): void {
        this.parseViewParams();
        this.onInit();
        this.onInited();
    }

    /**
     * Angular生命周期
     * 在组件被销毁的时候调用。
     * 
     * @memberof IBizViewController
     */
    ngOnDestroy(): void {
        this.onDestroy();
    }

    /**
     * 视图组件销毁时调用
     * 
     * @memberof IBizViewController
     */
    public onDestroy(): void {
        if (this.$iBizApp) {
            this.$iBizApp.deleteViewController(this.getUUID());
        }
        this.unRegUICounters();
    }

    /**
     * Angular生命周期
     * @input 值变化时调用
     * 
     * @param {*} change 
     * @memberof IBizViewController
     */
    public ngOnChanges(change: any) {
    }

    /**
     * 获取UUID
     * 
     * @returns {string} 
     * @memberof IBizViewController
     */
    public getUUID(): string {
        return this.$uuid;
    }


    /**
     * 视图参数变化，嵌入表单，手动刷新数据
     * 
     * @param {*} change 
     * @memberof IBizViewController
     */
    public viewParamChange(change: any) {
        if (change.srfparentkey && !Object.is(change.srfparentkey, '')) {
            this.addViewParam(change);
            this.refresh();
        }
    }

    /**
     * 视图初始化
     * 
     * @memberof IBizViewController
     */
    public onInit(): void {
        this.regUIActions();
        this.regUICounters();
        this.regCodeLists();
        this.onInitComponents();
        this.onLoad();
        this.fire(IBizEvent.IBizViewController_INITED, this);
    }

    /**
     * 部件初始化
     * 
     * @memberof IBizViewController
     */
    public onInitComponents(): void {
    }

    /**
     * 
     * 数据加载
     * @memberof IBizViewController
     */
    public onLoad(): void {

    }


    /**
     * 视图控制器初始化完成
     * 
     * @memberof IBizViewController
     */
    public onInited(): void {
        this.$bInited = true;
        if (this.$iBizApp) {
            this.$iBizApp.setViewController(this);
        }
    }

    /**
     * 关闭
     * 
     * @returns {boolean} 
     * @memberof IBizViewController
     */
    public isClosed(): boolean {
        return true;
    }

    /**
     * 
     * 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public unloaded(): any {
        return null;
    }

    /**
     * 是否初始化完毕
     * 
     * @returns {boolean} 
     * @memberof IBizViewController
     */
    public isInited(): boolean {
        return this.$bInited;
    }

    /**
     * 注册子控制器对象
     * 
     * @param {*} ctrler 
     * @memberof IBizViewController
     */
    public regController(ctrler: any): void {
    }

    /**
     * 获取子控制器对象
     * 
     * @param {string} id 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getController(id: string): any {
        return undefined;
    }

    /**
     * 获取父控件
     * 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getPController(): any {
        if (this.$iBizApp) {
            return this.$iBizApp.getParentViewController(this.getUUID());
        }
        return undefined;
    }

    /**
     * 注销子控制器对象
     * 
     * @param {*} ctrler 
     * @memberof IBizViewController
     */
    public unRegController(ctrler: any): void {
    }

    /**
     * 注册代码表
     * 
     * @param {*} codelist 
     * @memberof IBizViewController
     */
    public regCodeList(codelist: any): void {
        if (!this.$codelists) {
            this.$codelists = {};
        }
        this.$codelists[codelist.getId()] = codelist;
    }

    /**
     * 获取代码表
     * 
     * @param {string} codelistId 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getCodeList(codelistId: string): IBizCodeList {
        if (!this.$codelists) {
            return undefined;
        }

        if (this.$codelists[codelistId]) {
            return this.$codelists[codelistId];
        }
        return undefined;
    }

    /**
     * 注册界面行为
     * 
     * @param {*} [uiaction={}] 
     * @memberof IBizViewController
     */
    public regUIAction(uiaction: any = {}): void {
        if (!this.$uiactions) {
            this.$uiactions = {};
        }
        if (uiaction) {
            this.$uiactions[uiaction.tag] = uiaction;
        }
    }

    /**
     * 获取界面行为
     * 
     * @param {string} uiactionId 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getUIAction(uiactionId: string): any {

        if (!this.$uiactions) {
            return undefined;
        }

        if (this.$uiactions[uiactionId]) {
            return this.$uiactions[uiactionId];
        }

        return undefined;
    }

    /**
     * 刷新全部界面计数器
     * 
     * @memberof IBizViewController
     */
    public reloadUICounters(): void {
        if (this.$uiCounters.size > 0) {
            for (const tag in this.$uiCounters) {
                if (this.$uiCounters.hasOwnProperty(tag)) {
                    const uicounter: IBizUICounter = this.$uiCounters.get(tag);
                    if (uicounter) {
                        uicounter.reload();
                    }
                }
            }
        }

        const pController = this.getPController();
        if (pController) {
            pController.reloadUICounters();
        }
    }

    /**
     * 获取窗口对象
     * 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getWindow(): any {

        return window;
    }

    /**
     * 是否支持视图模型
     * 
     * @returns {boolean} 
     * @memberof IBizViewController
     */
    public isEnableViewModel(): boolean {
        return false;
    }

    /**
     * 获取后台地址
     * 
     * @returns {string} 
     * @memberof IBizViewController
     */
    public getBackendUrl(): string {
        if (this.$url) {
            return this.$url;
        }
        return undefined;
    }

    /**
     * 获取动态视图参数
     *
     * @returns {(any | undefined)}
     * @memberof IBizViewController
     */
    public getDynamicParams(): any {
        return {};
    }

    /**
     * 销毁 
     * 
     * @memberof IBizViewController
     */
    public destroy(): void {
    }

    /**
     * 刷新
     * 
     * @private
     * @memberof IBizViewController
     */
    private refresh(): void {
        this.onRefresh();
    }

    /**
     * 视图刷新方法，继承视图控制器重写
     * 
     * @memberof IBizViewController
     */
    public onRefresh(): void {

    }

    /**
     * 刷新子项
     * 
     * @param {string} name 
     * @memberof IBizViewController
     */
    public refreshItem(name: string): void {
    }

    /**
     * 设置父数据
     * 
     * @param {*} [data={}] 
     * @memberof IBizViewController
     */
    public setParentData(data: any = {}): void {
        this.$parentData = {};
        Object.assign(this.$parentData, data);
        this.onSetParentData();
        this.reloadUpdatePanels();
    }

    /**
     * 设置父数据
     * 
     * @memberof IBizViewController
     */
    public onSetParentData(): void {
    }

    /**
     * 获取父数据
     * 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getParentData(): any {
        return this.$parentData;
    }

    /**
     * 获取父模式
     * 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getParentMode(): any {
        return this.$parentMode;
    }

    /**
     * 获取引用数据
     * 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getReferData(): any {
        return undefined;
    }

    /**
     * 获取引用数据
     * 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getViewParam(): any {

        return this.$viewParam;
    }

    /**
     * 正常代码表模式
     * 
     * @param {string} codeListId 代码表ID
     * @param {string} value 数据值
     * @param {string} emtpytext 空值显示数据
     * @returns {string} 
     * @memberof IBizViewController
     */
    public renderCodeList_Normal(codeListId: string, value: string, emtpytext: string): string {
        if (!value) {
            return emtpytext;
        }
        const codelist: IBizCodeList = this.getCodeList(codeListId);
        if (codelist) {
            let result = '';
            const values = value.split(';');
            values.forEach(value => {
                const item = codelist.getItemByValue(value);
                if (item) {
                    result += '、' + item.text;
                }
            });
            if (result.length > 1) {
                result = result.substring(1);
            }
            return result;
        }
        return '';
    }

    /**
     * 代码表数字或处理
     * 
     * @param {string} codeListId 代码表ID
     * @param {string} value 数据值
     * @param {string} emtpytext 空值显示信息
     * @param {string} textSeparator 文本拼接方式
     * @returns {string} 
     * @memberof IBizViewController
     */
    public renderCodeList_NumOr(codeListId: string, value: string, emtpytext: string, textSeparator: string): string {
        if (!textSeparator || Object.is(textSeparator, '')) {
            textSeparator = '、';
        }
        let strTextOr = '';
        if (!value) {
            return emtpytext;
        }
        const nValue = parseInt(value, 10);
        const codelist: IBizCodeList = this.getCodeList(codeListId);
        if (codelist) {
            codelist.$data.forEach(ele => {
                const codevalue = ele.value;
                if ((parseInt(codevalue, 10) & nValue) > 0) {
                    if (strTextOr.length > 0) {
                        strTextOr += (textSeparator);
                    }
                    strTextOr += codelist.getCodeItemText(ele);
                }
            });
        }

        return strTextOr;
    }

    /**
     * 代码表文本或处理
     * 
     * @param {string} codeListId 代码表ID
     * @param {*} value 数据值
     * @param {*} emtpytext 空值显示信息
     * @param {*} textSeparator 文本凭借方式
     * @param {*} valueSeparator 数据值分割方式
     * @returns {string} 
     * @memberof IBizViewController
     */
    public renderCodeList_StrOr(codeListId: string, value: any, emtpytext: any, textSeparator: any, valueSeparator: any): string {
        if (!textSeparator || Object.is(textSeparator, '')) {
            textSeparator = '、';
        }
        if (!value) {
            return emtpytext;
        }

        let strTextOr = '';
        const codelist = this.getCodeList(codeListId);
        const arrayValue: Array<any> = value.split(valueSeparator);

        arrayValue.forEach((value) => {
            let strText = '';
            strText = this.renderCodeList_Normal(codeListId, value, emtpytext);
            if (strTextOr.length > 0) {
                strTextOr += (textSeparator);
            }
            strTextOr += strText;
        });

        return strTextOr;
    }

    /**
     * 
     * 
     * @memberof IBizViewController
     */
    public initViewLogic(): void {
    }

    /**
     * 
     * 
     * @memberof IBizViewController
     */
    public onPrepareViewLogics(): void {

    }

    /**
     * 
     * 
     * @param {*} logic 
     * @memberof IBizViewController
     */
    public regViewLogic(logic: any): void {
    }

    /**
     * 
     * 
     * @param {*} tag 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getViewLogic(tag: any): any {
        return undefined;
    }

    /**
     * 
     * 
     * @param {any} ctrlid 
     * @param {any} command 
     * @param {any} arg 
     * @memberof IBizViewController
     */
    public invokeCtrl(ctrlid, command, arg): void {
    }

    /**
     * 注册界面更新面板
     * 
     * @param {*} updatepanel 
     * @memberof IBizViewController
     */
    public regUpdatePanel(updatepanel: any): void {
    }

    /**
     * 获取界面更新面板
     * 
     * @param {string} updatepanelId 
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getUpdatePanel(updatepanelId: string): any {
        return undefined;
    }

    /**
     * 刷新全部界面更新面板
     * 
     * @memberof IBizViewController
     */
    public reloadUpdatePanels(): void {

    }

    /**
     * 填充更新面板调用参数
     * 
     * @param {*} [params={}] 
     * @memberof IBizViewController
     */
    public onFillUpdatePanelParam(params: any = {}): void {
    }

    /**
     * 初始化注册界面行为
     * 
     * @memberof IBizViewController
     */
    public regUIActions(): void {

    }

    /**
     * 初始化注册计数器
     * 
     * @memberof IBizViewController
     */
    public regUICounters(): void {
    }

    /**
     * 销毁计数器
     *
     * @memberof IBizViewController
     */
    public unRegUICounters(): void {
        if (this.$uiCounters.size === 0) {
            return;
        }
        this.$uiCounters.forEach((name: string) => {
            const _counter: IBizUICounter = this.$uiCounters.get(name);
            if (_counter) {
                _counter.close();
            }
        });
    }
    /**
     * 初始化代码表
     * 
     * @memberof IBizViewController
     */
    public regCodeLists(): void {

    }

    /**
     * 解析url参数，初始化调用
     * 
     * @private
     * @memberof IBizViewController
     */
    private parseViewParams(): void {
        if (this.modalViewParam) {
            this.addViewParam(this.modalViewParam);
        } else if (this.viewParam) {
            this.addViewParam(this.viewParam);
        } else {
            const routeActice = this.$activatedRoute;
            if (routeActice) {
                routeActice.paramMap.subscribe((paramMap: ParamMap) => {
                    let full_screen: boolean = false;
                    if (paramMap && paramMap.keys.length > 0) {
                        let params: any = {};
                        //  全屏参数
                        if (paramMap.get('fullscreen') && Object.is(paramMap.get('fullscreen'), 'true')) {
                            full_screen = true;
                        }
                        paramMap.keys.forEach((key) => {
                            params[key] = paramMap.get(key);
                        });
                        this.addViewParam(params);
                    }

                    if (this.$iBizApp) {
                        this.$iBizApp.setFullScreen(full_screen);
                    }
                });
            }
        }

    }

    /**
     * 添加视图参数, 处理视图刷新操作
     *
     * @param {*} [param={}]
     * @memberof IBizViewController
     */
    public addViewParam(param: any = {}): void {
        Object.assign(this.$viewParam, param);

        if (this.isInited()) {
            if (this.$viewParam.refreshView) {
                delete this.$viewParam.refreshView;
                this.onLoad();
            }
        }

    }

    /**
     * 打开数据视图,模态框打开
     * 
     * @param {*} [view={}] 视图参数
     * @returns {Observable<any>} 
     * @memberof IBizViewController
     */
    public openModal(view: any = {}): Observable<any> {
        const modalService: any = this.getModalService(view.className);
        if (modalService) {
            let opt: any = {};
            const modalZIndex = this.modalZIndex ? this.modalZIndex : 1000;
            opt.modalZIndex = modalZIndex;
            opt.viewParam = view.viewParam;
            return modalService.openModal(opt);
        }
    }

    /**
     * 获取打开视图模态框服务文件
     * 
     * @param {string} viewname  视图代码名称
     * @returns {*} 
     * @memberof IBizViewController
     */
    public getModalService(viewname: string): any {

    }

    /**
     * 打开数据视图;打开方式,路由打开
     * 
     * @param {string} routeString 相对路由地址
     * @param {*} [routeParam={}] 激活路由参数
     * @param {*} [queryParams] 路由全局查询参数
     * @memberof IBizViewController
     */
    public openView(routeString: string, routeParam: any = {}, queryParams?: any) {
        let params: any = {};

        //  全屏参数
        this.$activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap && paramMap.keys.length > 0) {
                if (paramMap.get('fullscreen') && Object.is(paramMap.get('fullscreen'), 'true')) {
                    params['fullscreen'] = true;
                }
            }
        });

        Object.assign(params, routeParam);

        const params_name: Array<any> = Object.keys(params);
        params_name.forEach((name) => {
            if (params[name] === undefined || Object.is(params[name], '')) {
                delete params[name];
            }
        });

        if (!queryParams) {
            queryParams = {};
        }
        //  订阅参数
        this.$activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.keys.length > 0) {
                paramMap.keys.forEach((key) => {
                    queryParams[key] = paramMap.get(key);
                });
            }
        });

        const navigationExtras: NavigationExtras = {
            queryParams: queryParams,
            relativeTo: this.$activatedRoute
        };
        this.$router.navigate([routeString.toLowerCase(), params], navigationExtras);
    }

    /**
     * 判断给定路径是否在传入的路由对象中
     * 
     * @param {ActivatedRoute} routeActive 路由对象
     * @param {string} path 对比路径
     * @returns 
     * @memberof IBizViewController
     */
    public isRoutePathItem(routeActive: ActivatedRoute, path: string) {
        if (routeActive && routeActive.routeConfig) {
            let routes = routeActive.routeConfig.children;
            if (routes && routes instanceof Array) {
                for (let i = 0; i < routes.length; i++) {
                    if (Object.is(routes[i].path, path)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
    * 视图是否是模态框对象
    * 
    * @returns {boolean} 
    * @memberof IBizViewController
    */
    public isModal(): boolean {
        if (this.modalViewParam) {
            return true;
        }
        return false;
    }

    /**
     * 获取实体名称
     * 
     * @returns {string} 
     * @memberof IBizViewController
     */
    public getDEName(): string {
        return '';
    }

    /**
     * 返回历史记录
     * 
     * @memberof IBizViewController
     */
    public goBack(): void {
        if (Object.keys(this.$activatedRouteData).length === 0) {
            return;
        }

        let activatedRouteData: any = {};
        if (this.$activatedRouteData.index === 0) {
            return;
        }

        Object.assign(activatedRouteData, this.$iBizApp.getActivatedRouteDatas(this.$activatedRouteData.index - 1));
        if (Object.keys(activatedRouteData).length === 0) {
            return;
        }

        Object.assign(activatedRouteData, { breadcrumbs: true });
        this.$iBizApp.updateActivatedRouteDatas(activatedRouteData);
        this.$router.navigateByUrl(activatedRouteData.routerurl);
    }
}
