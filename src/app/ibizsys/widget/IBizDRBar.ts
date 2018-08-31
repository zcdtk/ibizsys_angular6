import { IBizControl } from './IBizControl';
import { IBizEvent } from '../IBizEvent';

/**
 * 数据关系区(IBizEditView2)
 * 
 * @export
 * @class IBizDRBar
 * @extends {IBizControl}
 */
export class IBizDRBar extends IBizControl {

    /**
     * 关系部件是否收缩，默认展开
     * 
     * @type {boolean}
     * @memberof IBizDRBar
     */
    public $isCollapsed: boolean = true;

    /**
     * 关系数据项
     * 
     * @type {Array<any>}
     * @memberof IBizDRBar
     */
    public $items: Array<any> = [];

    /**
     * 选中项
     * 
     * @type {*}
     * @memberof IBizDRBar
     */
    public $selectItem: any = {};

    /**
     * 默认选中项
     * 
     * @type {*}
     * @memberof IBizDRBar
     */
    public $defaultItem: any = {};

    /**
     * Creates an instance of IBizDRBar.
     * 创建IBizDRBar实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizDRBar
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 加载关系数据
     * 
     * @param {*} [arg={}] 
     * @returns {void} 
     * @memberof IBizDRBar
     */
    public load(arg: any = {}): void {
        if (!this.$iBizHttp) {
            return;
        }
        // tslint:disable-next-line:prefer-const
        let param: any = {};
        param.srfaction = 'fetch';
        param.srfctrlid = this.getName();
        Object.assign(param, arg);

        this.$iBizHttp.post(this.getBackendUrl(), param).subscribe(result => {
            if (result.ret === 0) {
                this.$items = result.items;
                this.doSelectItem(this.$items);
                this.fire(IBizEvent.IBizDRBar_DRBARLOADED, this.$items);
            }
        }, error => {
            console.log(error);
        });
    }


    /**
     * 获取默认选中项
     * 
     * @private
     * @param {Array<any>} _items 
     * @returns {*} 
     * @memberof IBizDRBar
     */
    private doSelectItem(_items: Array<any>): any {
        let checkState = false;
        _items.forEach(item => {
            if (item.checked) {
                item.bchecked = true;
                checkState = true;
                Object.assign(this.$defaultItem, item);
            } else {
                item.bchecked = false;
            }

            if (item.items) {
                const hasItemCheck = this.doSelectItem(item.items);
                if (hasItemCheck) {
                    item.expanded = true;
                }
                item.hassubmenu = true;
            } else {
                item.hassubmenu = false;
            }
            item.expanded = true;

        });
    }

    /**
     * 菜单节点选中处理
     * 
     * @param {*} [item={}] 
     * @returns {void} 
     * @memberof IBizDRBar
     */
    public expandedAndSelectSubMenu(item: any = {}): void {
        if (!item.expanded) {
            this.closeSubItems(item);
        }

        const viewController: any = this.getViewController();
        // tslint:disable-next-line:prefer-const
        let routeString: string = item.id;

        if (Object.is(routeString.toLowerCase(), 'form')) {
            this.fire(IBizEvent.IBizDRBar_DRBARSELECTCHANGE, item);
        } else {
            if (viewController) {
                const hasRoute: boolean = viewController.hasRoute(routeString.toLowerCase());
                if (hasRoute) {
                    this.fire(IBizEvent.IBizDRBar_DRBARSELECTCHANGE, item);
                }
            }
        }
    }

    /**
     * 收缩子菜单
     * 
     * @param {*} [item={}] 
     * @memberof IBizDRBar
     */
    public closeSubItems(item: any = {}): void {
        item.expanded = true;
        item.items.forEach(subItem => {
            if (subItem.items && subItem.items.length > 0) {
                this.closeSubItems(subItem);
            }
        });
    }


    /**
     * 菜单项选中事件
     * 
     * @param {*} item 
     * @returns {void} 
     * @memberof IBizTreeExpBarService
     */
    public selection(item: any): void {

        if (item.items && item.items.length > 0) {
            return;
        }

        const viewController: any = this.getViewController();
        // tslint:disable-next-line:prefer-const
        let routeString: string = item.id;

        if (routeString) {
            const hasRoute = viewController.hasRoute(routeString.toLowerCase());
            if (!hasRoute) {
                return;
            }
            this.fire(IBizEvent.IBizDRBar_DRBARSELECTCHANGE, item);
        }
    }

    /**
     * 重新加载关系数据
     * 
     * @memberof IBizDRBar
     */
    public reLoad(arg: any = {}): void {
        this.load(arg);
    }

    /**
     * 获取所有关系数据项
     * 
     * @returns {Array<any>} 
     * @memberof IBizDRBar
     */
    public getItems(): Array<any> {
        return this.$items;
    }

    /**
     * 获取某一数据项
     * 
     * @param {string} id 
     * @param {Array<any>} _arr 
     * @returns {*} 
     * @memberof IBizDRBar
     */
    public getItem(id: string, _arr: Array<any>): any {
        // tslint:disable-next-line:prefer-const
        let _item: any = {};
        _arr.some((item: any) => {
            if (Object.keys(_item).length !== 0) {
                return false;
            }
            if (Object.is(id.toLocaleLowerCase(), item.id.toLocaleLowerCase())) {
                Object.assign(_item, item);
                return true;
            }
            if (!id && !Object.is(item.id.toLocaleLowerCase(), 'form')) {
                Object.assign(_item, item);
                return true;
            }

            if (item.items) {
                const _subItem: any = this.getItem(id, item.items);
                if (Object.keys(_subItem).length === 0) {
                    return false;
                }
                Object.assign(_item, _subItem);
                return true;
            }
        });
        return _item;
    }

    /**
     * 设置关系数据默认选中项
     * 
     * @param {*} [_item={}] 
     * @memberof IBizDRBar
     */
    public setDefaultSelectItem(_item: any = {}): void {
        if (!Object.is(this.$selectItem.id, _item.id)) {
            this.$selectItem = {};
            Object.assign(this.$selectItem, _item);
        }
    }

}
