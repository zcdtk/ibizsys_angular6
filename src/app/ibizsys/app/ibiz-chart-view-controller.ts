import { IBizSearchViewController } from './ibiz-search-view-controller';
import { IBizEvent } from '../ibiz-event';

/**
 * 数据图表视图控制器
 * 
 * @export
 * @class IBizChartViewController
 * @extends {IBizSearchViewController}
 */
export class IBizChartViewController extends IBizSearchViewController {

    /**
     * Creates an instance of IBizChartViewController.
     * 创建 IBizChartViewController 对象
     * 
     * @param {*} [opts={}] 
     * @memberof IBizChartViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 视图部件初始化
     * 
     * @memberof IBizChartViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const chart = this.getChart();
        if (chart) {
            // 数据加载完成
            chart.on(IBizEvent.IBizChart_LOADED).subscribe((data) => {
                this.onStoreLoad(data);
            });
            // 图表加载之前
            chart.on(IBizEvent.IBizChart_BEFORELOAD).subscribe((data) => {
                this.onStoreBeforeLoad(data);
            });
            // 双击图表
            chart.on(IBizEvent.IBizChart_DBLCLICK).subscribe((data) => {
                this.onDataActivated();
            });
        }
    }

    /**
     * 视图加载
     * 
     * @memberof IBizChartViewController
     */
    public onLoad(): void {
        super.onLoad();
        if (!this.getSearchForm() && this.getChart() && this.isLoadDefault()) {
            this.getChart().load();
        }
    }

    /**
     * 获取图表部件
     * 
     * @returns {*} 
     * @memberof IBizChartViewController
     */
    public getChart(): any {
        return this.$controls.get('chart');
    }

    /**
     * 搜索表单触发加载
     * 
     * @param {boolean} isload 是否加载
     * @memberof IBizChartViewController
     */
    public onSearchFormSearched(isload: boolean): void {
        if (this.getChart() && isload) {
            this.getChart().load();
        }
    }

    /**
     * 表单重置完成
     * 
     * @memberof IBizChartViewController
     */
    public onSearchFormReseted(): void {
        if (this.getChart()) {
            this.getChart().load();
        }
    }

    /**
     * 视图部件刷新
     * 
     * @memberof IBizChartViewController
     */
    public onRefresh(): void {
        super.onRefresh();
        if (this.getChart()) {
            this.getChart().load();
        }
    }
}
