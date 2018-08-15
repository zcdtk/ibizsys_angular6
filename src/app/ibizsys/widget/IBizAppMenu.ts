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
     * 菜单数据项
     * 
     * @type {any[]}
     * @memberof IBizAppMenu
     */
    public $items: any[];

    /**
     * Creates an instance of IBizAppMenu.
     * 创建 IBizAppMenu 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizAppMenu
     */
    constructor(opts: any = {}) {
        super(opts);
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
     * 处理表单项，在服务对象中重写
     * 
     * @param {string} appfuncid 
     * @returns {*} 
     * @memberof IBizAppMenu
     */
    public renderMenuItemRoute(appfuncid: string): any {
        return undefined;
    }

    /**
     * 菜单选中
     * 
     * @param {*} select 
     * @returns {*} 
     * @memberof IBizAppMenu
     */
    public onSelectChange(select: any): any {
        this.fire(IBizEvent.IBizAppMenu_MENUSELECTION, select);
    }
}
