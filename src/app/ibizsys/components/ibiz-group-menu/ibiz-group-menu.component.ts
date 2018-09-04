import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ibiz-group-menu',
    templateUrl: './ibiz-group-menu.component.html',
    styleUrls: ['./ibiz-group-menu.component.less']
})
export class IBizGroupMenuComponent {

    /**
	 * 选中的菜单对象
	 * 
	 * @memberof IBizGroupMenuComponent
	 */
    public selectData = {};

    /**
     * 菜单数据
     *
     * @type {Array<any>}
     * @memberof IBizGroupMenuComponent
     */
    public $items: Array<any> = [];

    /**
     * 应用菜单数据
     *
     * @type {any[]}
     * @memberof IBizGroupMenuComponent
     */
    @Input()
    set menus(val: Array<any>) {
        if (val) {
            this.formateMenu(this.$items, val);
        }
    }
    /**
     * 应用菜单部件对象
     *
     * @type {*}
     * @memberof IBizGroupMenuComponent
     */
    @Input() menuCtrl: any;

    constructor() { }

    /**
     * 选中菜单项
     *
     * @param {*} select
     * @memberof IBizGroupMenuComponent
     */
    public onSelect(select: any) {
        if (this.menuCtrl) {
            this.selectData = select;
            this.menuCtrl.onSelectChange(select);
        }
    }

    /**
     * 处理应用菜单数据
     *
     * @private
     * @param {Array<any>} items
     * @param {Array<any>} menus
     * @memberof IBizGroupMenuComponent
     */
    private formateMenu(items: Array<any>, menus: Array<any>) {
        menus.forEach((menu) => {
            if (menu.items) {
                this.formateMenu(items, menu.items);
                delete menu.items;
            }
            items.push(menu);
        });
    }
}
