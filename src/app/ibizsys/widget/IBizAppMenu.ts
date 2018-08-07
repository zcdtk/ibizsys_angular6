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
                const data = this.doMenus(success.items);
                this.fire(IBizEvent.IBizAppMenu_LOADED, data);
            }
        }, error => {
            console.log(error);
        });
    }


    /**
     * 处理菜单数据
     * 
     * @private
     * @param {*} items 
     * @returns {*} 
     * @memberof StartupService
     */
    private doMenus(items: Array<any>): any[] {
        let datas: Array<any> = [];
        items.forEach(item => {
            const data = this.renderMenuItemRoute(item.appfuncid);
            if (data) {
                item.link = data.codename ? data.codename : data.funcid;
            }
            if (Object.is(item.iconcls, '')) {
                item.iconcls = 'fa fa-cogs';
            }
            if (Object.is(item.icon, '')) {
                item.icon = item.iconcls;
            }

            item.children = [];
            if (item.items) {
                item.items.forEach(element => {
                    let data1 = this.renderMenuItemRoute(element.appfuncid);
                    if (data1) {
                        element.link = data1.codename ? data1.codename : data1.funcid;
                    }
                    if (Object.is(element.iconcls, '')) {
                        element.iconcls = 'fa fa-cogs';
                    }
                    if (Object.is(element.icon, '')) {
                        element.icon = element.iconcls;
                    }
                    item.children.push(element);

                    element.children = [];
                    if (element.items) {
                        element.items.forEach(eledata => {
                            const data2 = this.renderMenuItemRoute(eledata.appfuncid);
                            if (data2) {
                                eledata.link = data2.codename ? data2.codename : data2.funcid;
                            }
                            if (Object.is(eledata.iconcls, '')) {
                                eledata.iconcls = 'fa fa-cogs';
                            }
                            if (Object.is(eledata.icon, '')) {
                                eledata.icon = eledata.iconcls;
                            }
                            element.children.push(eledata);

                        });

                    }

                });
            }
            const children: Array<any> = [];
            children.push(item);
            datas.push({ children: children });
        });
        return datas;
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
