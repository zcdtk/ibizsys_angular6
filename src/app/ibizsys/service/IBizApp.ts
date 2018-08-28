import { Injectable } from '@angular/core';

/**
 * Ibiz 全局 app 对象
 * 
 * 管理初始化的视图控制器对象 
 * 
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class IBizApp {

    /**
     * 是否全屏，默认显示菜单与头部导航文件
     * 
     * @private
     * @type {boolean}
     * @memberof IBizApp
     */
    private $fullScreen: boolean = false;

    /**
     * 显示菜单
     *
     * @private
     * @type {boolean}
     * @memberof IBizApp
     */
    private $showMenu: boolean = true;

    /**
     * 已加载视图控制器对象
     * 
     * @type {Array<any>}
     * @memberof IBizApp
     */
    public $ibizViewControllers: Array<any> = [];

    /**
     * 所有激活路由参数
     * 
     * @type {Array<any>}
     * @memberof IBizApp
     */
    public $activatedRouteDatas: Array<any> = [];

    /**
     * 应用数据
     *
     * @private
     * @type {string}
     * @memberof IBizApp
     */
    private $appData: string;

    /**
     * Creates an instance of IBizApp.
     * 创建 IBizApp 实例
     * 
     * @param {SettingsService} themeSettings 
     * @memberof IBizApp
     */
    constructor() { }

    /**
     * 设置当前视图控制对象
     * 
     * @param {*} viewController 
     * @memberof IBizApp
     */
    public setViewController(viewController: any): void {
        this.$ibizViewControllers.push(viewController);
    }

    /**
     * 获取父视图控制对象
     *
     * @param {string} uuid 
     * @returns {*}
     * @memberof IBizApp
     */
    public getParentViewController(uuid: string): any {
        const index: number = this.$ibizViewControllers.findIndex(item => Object.is(uuid, item.getUUID()));
        if (index > -1 && index !== 0) {
            return this.$ibizViewControllers[index - 1];
        }
        return undefined;
    }

    /**
     * 清除当前视图控制器对象
     *
     * @param {string} uuid
     * @memberof IBizApp
     */
    public deleteViewController(uuid: string): void {
        const index: number = this.$ibizViewControllers.findIndex(item => Object.is(uuid, item.getUUID()));
        if (index !== -1) {
            this.$ibizViewControllers.splice(index, 1);
        }
    }

    /**
     * 设置是否全屏参数
     * 
     * @param {*} full_srceen 
     * @memberof IBizApp
     */
    public setFullScreen(fullScreen: boolean): void {
        setTimeout(() => {
            this.$fullScreen = fullScreen;
            // this.themeSettings.setLayout('collapsed', this.$fullScreen);
        });
    }

    /**
     * 获取是否全屏参数
     * 
     * @returns {boolean} 
     * @memberof IBizApp
     */
    public getFullScreen(): boolean {
        return this.$fullScreen;
    }

    /**
     * 设置激活路由参数，返回当前激活路由地址
     *
     * @param {*} [_data={}] 路由数据
     * @returns {*} 当前路由数据
     * @memberof IBizApp
     */
    public addActivatedRouteDatas(_data: any = {}): any {

        if (Object.keys(_data).length === 0) {
            return undefined;
        }

        let data: any = {};
        Object.assign(data, _data);
        if (data.routerurl) {
            let routerurl: string = data.routerurl;
            const routerurl_arr: Array<any> = routerurl.split('/');
            let sub_url: Array<any> = [];

            const allData_lenght: number = this.$activatedRouteDatas.length;
            if (routerurl_arr.length - allData_lenght > 0) {
                sub_url = [...routerurl_arr.slice(0, allData_lenght + 2)];
            }
            data.routerurl = sub_url.join('/');
        }
        const _arr: Array<any> = this.$activatedRouteDatas.filter(item => Object.is(item.routerurl, data.routerurl));
        if (_arr.length !== 0) {
            return undefined;
        }
        data.index = this.$activatedRouteDatas.length;
        this.$activatedRouteDatas.push(data);
        return data;
    }

    /**
     * 删除激活路由数据
     * 
     * @param {*} [data={}] 
     * @returns {void} 
     * @memberof IBizApp
     */
    public deleteActivatedRouteDatas(data: any = {}): void {
        if (Object.keys(data).length === 0) {
            return;
        }

        const index: number = this.$activatedRouteDatas.findIndex(item =>
            Object.is(data.routerurl, item.routerurl) && Object.is(data.index, item.index)
        );
        if (index !== -1) {
            this.$activatedRouteDatas.splice(index, 1);
        }
    }

    /**
     * 更新激活路由数据，根据当前路由全路径为key值
     * 
     * @param {*} [data={}] 
     * @returns {void} 
     * @memberof IBizApp
     */
    public updateActivatedRouteDatas(data: any = {}): void {
        if (Object.keys(data).length === 0) {
            return;
        }

        const index: number = this.$activatedRouteDatas.findIndex(item =>
            Object.is(data.routerurl, item.routerurl) && Object.is(data.index, item.index)
        );
        if (index !== -1) {
            let _data = this.$activatedRouteDatas[index];
            Object.assign(_data, data);
            this.$activatedRouteDatas[index] = _data;
        }
    }

    /**
     * 获取激活数据项
     * 
     * @param {number} index 
     * @returns {*} 
     * @memberof IBizApp
     */
    public getActivatedRouteDatas(index: number): any {
        let data: any = {};
        if (this.$activatedRouteDatas[index]) {
            Object.assign(data, this.$activatedRouteDatas[index]);
        }
        return data;
    }

    /**
     * 设置主菜单状态
     *
     * @param {boolean} state
     * @memberof IBizApp
     */
    public setMainMenuState(state: boolean): void {
        setTimeout(() => {
            this.$showMenu = state;
        });
    }

    /**
     * 获取主菜单状态
     *
     * @returns {boolean}
     * @memberof IBizApp
     */
    public getMainMenuState(): boolean {
        return this.$showMenu;
    }

    public getAppData(): string {
        return this.$appData;
    }

    public setAppData(appdata: string): void {
        this.$appData = appdata;
    }
}
