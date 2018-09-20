import { IBizEvent } from './../ibiz-event';
import { IBizControl } from './ibiz-control';

/**
 * 图表部件服务对象
 * 
 * @export
 * @class IBizChart
 * @extends {IBizControl}
 */
export class IBizChart extends IBizControl {

    /**
     * 图表数据
     * 
     * @type {Array<any>}
     * @memberof IBizChart
     */
    public $data: Array<any> = [];

    /**
     * Creates an instance of IBizChart.
     * 创建 IBizChart 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizChart
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 加载报表数据
     * 
     * @memberof IBizChart
     */
    public load(): void {
        this.buildChart();
    }

    /**
     * 处理图表内容
     * 
     * @memberof IBizChart
     */
    private buildChart(): void {
        // tslint:disable-next-line:prefer-const
        let params: any = {};
        this.fire(IBizEvent.IBizChart_BEFORELOAD, params);
        Object.assign(params, { srfrender: 'ECHARTS3', srfaction: 'FETCH', srfctrlid: this.getName() });
        this.post(params, this.getBackendUrl()).subscribe((result) => {
            if (result.ret === 0) {
                this.$data = result.data;
                const data = this.getChartConfig();
                // tslint:disable-next-line:prefer-const
                let target = {};
                Object.assign(target, data, this.$data);
                this.fire(IBizEvent.IBizChart_LOADED, target);
            } else {
                this.$iBizNotification.error('系统异常', result.info);
            }
        }, (error) => {
            this.$iBizNotification.error('系统异常', error.info);
        });
    }

    /**
     * 获取图表基础配置数据
     */
    public getChartConfig(): any {
        const opts: any = {};
        return opts;
    }
}



