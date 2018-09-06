import { IBizTab } from './IBizTab';
import { IBizEvent } from '../IBizEvent';

/**
 * 关系分页部件服务对象
 * 
 * @export
 * @class IBizDRTab
 * @extends {IBizTab}
 */
export class IBizDRTab extends IBizTab {

    /**
     * 父数据对象
     * 
     * @type {*}
     * @memberof IBizDRTab
     */
    public $parentData: any = {};

    /**
     * Creates an instance of IBizDRTab.
     * 创建 IBizDRTab 实例
     * @param {*} [opts={}] 
     * @memberof IBizDRTab
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 设置父数据
     * 
     * @param {*} [data={}] 
     * @memberof IBizDRTab
     */
    public setParentData(data: any = {}): void {
        Object.assign(this.$parentData, data);
    }

    /**
     * 分页部件选中变化
     * 
     * @param {*} [args={}] 
     * @returns {void} 
     * @memberof IBizDRTab
     */
    public onTabSelectionChange(args: any = {}): void {
        const viewid: string = args.name;
        const controller = this.getViewController();

        // tslint:disable-next-line:no-inferrable-types
        let parentKey: string = '';
        if (this.$parentData.srfparentkey) {
            parentKey = this.$parentData.srfparentkey;
        }

        if (!parentKey || Object.is(parentKey, '')) {
            this.$iBizNotification.warning('警告', '请先建立主数据');
            this.setActiveTab(0);
            return;
        }

        if (Object.is(viewid, 'form')) {
            this.fire(IBizEvent.IBizDRTab_SELECTCHANGE, { parentMode: {}, parentData: {}, viewid: viewid });
            this.setActiveTab(0);
            return;
        }

        const dritem: any = { viewid: viewid.toLocaleUpperCase() };
        if (!dritem.viewid || Object.is(dritem.viewid, '')) {
            return;
        }

        const viewItem: any = controller.getDRItemView(dritem);
        if (viewItem == null || !viewItem.viewparam) {
            return;
        }

        const viewParam = viewItem.viewparam;
        // tslint:disable-next-line:prefer-const
        let parentData: any = {};
        if (true) {
            Object.assign(parentData, viewParam);
            Object.assign(parentData, this.$parentData);

            if (viewParam.srfparentdeid) {
                Object.assign(parentData, { srfparentdeid: viewParam.srfparentdeid });
            }
        }

        this.setActiveTab(args.index);
        this.fire(IBizEvent.IBizDRTab_SELECTCHANGE, { parentMode: viewParam, parentData: parentData, viewid: viewid });
    }
}

