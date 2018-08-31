import { IBizMainViewController } from './IBizMainViewController';
import { IBizEvent } from '../IBizEvent';

/**
 * 搜索视图控制器
 * 
 * @export
 * @class IBizSearchViewController
 * @extends {IBizMainViewController}
 */
export class IBizSearchViewController extends IBizMainViewController {

    /**
     * 父数据改变
     * 
     * @memberof IBizSearchViewController
     */
    public $parentDataChanged = true;

    /**
     * 快速搜索值变化
     * 
     * @type {*}
     * @memberof IBizSearchViewController
     */
    public $bQuickSearchValue: any;

    /**
     * Creates an instance of IBizSearchViewController.
     * 创建 IBizSearchViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizSearchViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 部件初始化
     * 
     * @memberof IBizSearchViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();

        const searchform = this.getSearchForm();
        if (searchform) {
            // 表单加载完成
            searchform.on(IBizEvent.IBizForm_FORMLOADED).subscribe((data) => {
                this.onSearchFormSearched(this.isLoadDefault());
            });
            // 表单搜索，手动触发
            searchform.on(IBizEvent.IBizSearchForm_FORMSEARCHED).subscribe((data) => {
                this.onSearchFormSearched(true);
            });
            // 表单重置
            searchform.on(IBizEvent.IBizSearchForm_FORMRESETED).subscribe((data) => {
                this.onSearchFormReseted();
            });
            // 表单值变化
            searchform.on(IBizEvent.IBizForm_FORMFIELDCHANGED).subscribe((data) => {
                if (data == null) {
                    this.onSearchFormFieldChanged('');
                } else {
                    this.onSearchFormFieldChanged(data.name);
                    this.onSearchFormFieldValueCheck(data.name, data.field.getValue());
                }
            });
            // 设置表单是否开启
            searchform.setOpen(!this.isEnableQuickSearch());
        }
    }

    /**
     * 视图加载
     * 
     * @memberof IBizSearchViewController
     */
    public onLoad(): void {
        super.onLoad();
        const searchform = this.getSearchForm();
        if (searchform) {
            searchform.autoLoad({});
        }
    }

    /**
     * 获取搜索表单对象
     * 
     * @returns {*} 
     * @memberof IBizSearchViewController
     */
    public getSearchForm(): any {
        return this.$controls.get('searchform');
    }

    /**
     * 搜索表单属性值发生变化
     *
     * @param {string} fieldname
     * @memberof IBizSearchViewController
     */
    public onSearchFormFieldChanged(fieldname: string): void {

    }

    /**
     * 表单项值检测
     *
     * @param {string} fieldname
     * @param {string} value
     * @memberof IBizSearchViewController
     */
    public onSearchFormFieldValueCheck(fieldname: string, value: string): void {

    }

    /**
     * 搜索表单重置
     * 
     * @memberof IBizSearchViewController
     */
    public onSearchFormReseted(): void {

    }

    /**
     * 视图是否默认加载
     * 
     * @returns {boolean} 
     * @memberof IBizSearchViewController
     */
    public isLoadDefault(): boolean {
        return true;
    }

    /**
     * 是否支持快速搜索
     * 
     * @returns {boolean} 
     * @memberof IBizSearchViewController
     */
    public isEnableQuickSearch(): boolean {
        return true;
    }

    /**
     * 获取搜索表单值
     * 
     * @returns {*} 
     * @memberof IBizSearchViewController
     */
    public getSearchCond(): any {
        if (this.getSearchForm()) {
            return this.getSearchForm().getValues();
        }
        return {};
    }

    /**
     * 搜索表单搜索执行
     * 
     * @param {boolean} isload 是否加载
     * @memberof IBizSearchViewController
     */
    public onSearchFormSearched(isload: boolean): void {

    }

    /**
     * 数据加载之前
     * 
     * @param {*} [args={}] 
     * @memberof IBizSearchViewController
     */
    public onStoreBeforeLoad(args: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let fetchParam: any = {};
        if (this.getViewParam()) {
            Object.assign(fetchParam, this.getViewParam());
        }
        if (this.getParentMode()) {
            Object.assign(fetchParam, this.getParentMode());
        }
        if (this.getParentData()) {
            Object.assign(fetchParam, this.getParentData());
        }
        if ((this.getSearchCond() && this.getSearchForm().isOpen()) || !this.isEnableQuickSearch()) {
            Object.assign(fetchParam, this.getSearchCond());
        }
        // 获取快速搜索里的搜索参数
        if (this.isEnableQuickSearch() && this.$bQuickSearchValue !== undefined) {
            args.search = this.$bQuickSearchValue;
        }
        Object.assign(args, fetchParam);
    }

    /**
     * 数据加载完成
     * 
     * @param {*} data 
     * @memberof IBizSearchViewController
     */
    public onStoreLoad(data: any): void {
        this.$parentDataChanged = false;
        this.reloadUICounters();
    }

    /**
     *设置父数据
     * 
     * @memberof IBizSearchViewController
     */
    public onSetParentData(): void {
        super.onSetParentData();
        this.$parentDataChanged = true;
    }

    /**
     * 数据被激活<最典型的情况就是行双击>
     * 
     * @memberof IBizSearchViewController
     */
    public onDataActivated(): void {

    }
}
