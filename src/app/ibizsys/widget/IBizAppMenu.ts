import { IBizControl } from './IBizControl';
import { IBizEvent } from '../IBizEvent';

/**
 * 应用菜单部件服务对象
 * 
 * @export
 * @class IBizAppMenu
 * @extends {IBizControl}
 */
export class IBizAppMenu extends IBizControl {

    /**
     * 应用功能数据
     *
     * @type {Array<any>}
     * @memberof IBizAppMenu
     */
    public $appFunctions: Array<any> = [];

    /**
     * 菜单数据项
     * 
     * @type {any[]}
     * @memberof IBizAppMenu
     */
    public $items: Array<any> = [];

    /**
     * 选中项
     *
     * @type {*}
     * @memberof IBizAppMenu
     */
    public $selectItem: any = {};

    /**
     * Creates an instance of IBizAppMenu.
     * 创建 IBizAppMenu 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizAppMenu
     */
    constructor(opts: any = {}) {
        super(opts);
        this.setAppFunctions();
    }

    /**
     * 设置应用功能参数
     *
     * @memberof IBizAppMenu
     */
    public setAppFunctions(): void {
    }

    /**
     * 部件加载
     * 
     * @memberof IBizAppMenu
     */
    public load(): void {
        const params: any = { srfctrlid: this.getName(), srfaction: 'FETCH' };
        this.post(params, this.getBackendUrl()).subscribe(success => {
            if (success.ret === 0) {
                this.$items = success.items;
                this.fire(IBizEvent.IBizAppMenu_LOADED, this.$items);
            }
        }, error => {
            console.log(error);
        });
    }

    /**
     * 菜单选中
     *
     * @param {*} [item={}]
     * @returns {*}
     * @memberof IBizAppMenu
     */
    public onSelectChange(item: any = {}): any {
        // tslint:disable-next-line:prefer-const
        let _item = {};
        Object.assign(_item, item);
        const _appFunction: any = this.$appFunctions.find(appfunction => Object.is(appfunction.appfuncid, item.appfuncid));
        if (!_appFunction) {
            return;
        }
        Object.assign(_item, _appFunction);
        this.fire(IBizEvent.IBizAppMenu_MENUSELECTION, _item);
    }

    /**
     * 设置选中菜单
     *
     * @param {*} [item={}]
     * @memberof IBizAppMenu
     */
    public setAppMenuSelected(item: any = {}): void {
    }
}
