import { IBizControl } from './IBizControl';
import { IBizEvent } from '../IBizEvent';

/**
 * 工具栏部件服务对象
 * 
 * @export
 * @class IBizToolbar
 * @extends {IBizControl}
 */
export class IBizToolbar extends IBizControl {

    /**
     * 导出起始页
     * 
     * @type {string}
     * @memberof IBizToolbar
     */
    public $exportStartPage: any;

    /**
     * 导出结束页
     * 
     * @type {string}
     * @memberof IBizToolbar
     */
    public $exportEndPage: any;

    /**
     * 工具栏按钮
     * 
     * @type {Array<any>}
     * @memberof IBizToolbar
     */
    public $items: any = {};

    /**
     * Creates an instance of IBizToolbar.
     * 创建IBizToolbar的一个实例。
     * 
     * @param {*} [opts={}] 
     * @memberof IBizToolbar
     */
    constructor(opts: any = {}) {
        super(opts);
        this.regToolBarItems();
    }

    /**
     * 注册所有工具栏按钮
     * 
     * @memberof IBizToolbar
     */
    public regToolBarItems(): void {

    }

    /**
     * 注册工具栏按钮
     * 
     * @param {*} [item={}] 
     * @memberof IBizToolbar
     */
    public regToolBarItem(item: any = {}): void {
        if (!this.$items) {
            this.$items = {};
        }
        if (Object.keys(item).length > 0 && !Object.is(item.name, '')) {
            item.dataaccaction = true;
            this.$items[item.name] = item;
        }
        if (item.menu && item.menu.length > 0) {
            const _menus: Array<any> = [...item.menu];
            _menus.forEach((menu) => {
                this.regToolBarItem(menu);
            });
        }
    }

    /**
     * 获取工具栏按钮
     * 
     * @returns {Array<any>} 
     * @memberof IBizToolbar
     */
    public getItems(): any {
        if (!this.$items) {
            this.$items = {};
        }
        return this.$items;
    }

    /**
     * 设置工具栏按钮项是否启用
     * 
     * @param {string} name 
     * @param {boolean} disabled 
     * @memberof IBizToolbar
     */
    public setItemDisabled(name: string, disabled: boolean): void {
        if (this.$items[name]) {
            this.$items[name].disabled = disabled;
        }
    }

    /**
     * 更新权限
     * 
     * @param {any} action 
     * @memberof IBizToolbar
     */
    public updateAccAction(action: any = {}): void {
        const _itemsName: Array<any> = Object.keys(this.$items);
        _itemsName.forEach((name: string) => {
            const priv = this.$items[name].priv;
            if ((priv && !Object.is(priv, '')) && (action && Object.keys(action).length > 0 && action[priv] !== 1)) {
                this.$items[name].dataaccaction = false;
            } else {
                this.$items[name].dataaccaction = true;
            }
        });
    }

    /**
     * 工具栏导出功能设置
     * 
     * @param {string} type 
     * @param {string} [itemTag] 
     * @memberof IBizToolbar
     */
    public itemExportExcel(type: string, itemTag?: string): void {
        let params: any = { tag: type };
        if (itemTag && Object.is(itemTag, 'all')) {
            Object.assign(params, { itemTag: 'all' });
        } else if (itemTag && Object.is(itemTag, 'custom')) {
            if (!this.$exportStartPage || !this.$exportEndPage) {
                this.$iBizNotification.warning('警告', '请输入起始页');
                return;
            }
            const startPage: any = Number.parseInt(this.$exportStartPage, 10);
            const endPage: any = Number.parseInt(this.$exportEndPage, 10);
            if (Number.isNaN(startPage) || Number.isNaN(endPage)) {
                this.$iBizNotification.warning('警告', '请输入有效的起始页');
                return;
            }

            if (startPage < 1 || endPage < 1 || startPage > endPage) {
                this.$iBizNotification.warning('警告', '请输入有效的起始页');
                return;
            }
            Object.assign(params, { exportPageStart: startPage, exportPageEnd: endPage, itemTag: 'custom' });
        }
        this.fire(IBizEvent.IBizToolbar_ITEMCLICK, params);
    }

    /**
     * 点击按钮
     * 
     * @param {string} type  界面行为类型
     * @memberof IBizToolbar
     */
    public itemclick(name: string, type: string): void {
        if (Object.is(type, 'ToggleRowEdit')) {
            this.$items[name].rowedit = !this.$items[name].rowedit;
            this.$items[name].caption = this.$items[name].rowedit ? '启用行编辑' : '关闭行编辑';
        }
        this.fire(IBizEvent.IBizToolbar_ITEMCLICK, { tag: type });
    }
}

