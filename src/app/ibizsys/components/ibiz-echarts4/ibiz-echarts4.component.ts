import { IBizEvent } from './../../IBizEvent';
import { IBizChart } from 'app/ibizsys/widget/IBizChart';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import echarts from 'echarts';


/**
 * echarts 图表指令
 * 
 * @export
 * @class IBizEcharts4Component
 * @implements {OnInit}
 */
@Directive({
    selector: 'app-ibiz-echarts4',
})
export class IBizEcharts4Component implements OnInit {

	/**
	 * 图表类型
	 * 
	 * @type {*}
	 * @memberof IBizEcharts4Component
	 */
    @Input() chartType: any;

	/**
	 * 图表部件服务对象
	 * 
	 * @type {IBizChartService}
	 * @memberof IBizEcharts4Component
	 */
    @Input() ctrl: IBizChart;

	/**
	 * Creates an instance of IBizEcharts4Component.
	 * 创建 IBizEcharts4Component 实例
	 * 
	 * @param {ElementRef} el 
	 * @memberof IBizEcharts4Component
	 */
    constructor(private el: ElementRef) {
    }

	/**
	 * 指令初始化
	 * 
	 * @memberof IBizEcharts4Component
	 */
    public ngOnInit(): void {
        const echartsCtrl = echarts.init(this.el.nativeElement);
        if (this.ctrl) {
            this.ctrl.on(IBizEvent.IBizChart_LOADED).subscribe((data) => {
                const opt = this.renderData(data);
                echartsCtrl.setOption(opt);
            });
        } else {
            echartsCtrl.setOption({});
        }
        window.onresize = function () {
            echartsCtrl.resize();
        }
    }

	/**
	 * 指令数据处理
	 * 
	 * @private
	 * @param {*} data 
	 * @returns {*} 
	 * @memberof IBizEcharts4Component
	 */
    private renderData(data: any): any {
        if (data.series) {

            //区域图分析
            if (data.series.length) {
                if (Object.is(data.series[0].type, 'area')) {

                    //如果series是数组的话
                    for (let i in data.series) {
                        data.series[i].type = 'line';
                        data.series[i].areaStyle = {};
                        Object.assign(data.series[i].areaStyle, { normal: {} });
                    }
                    return data;
                }
            } else {
                if (Object.is(data.series.type, 'area')) {
                    data.series.type = 'line';
                    data.series.areaStyle = {};
                    Object.assign(data.series.areaStyle, { normal: {} });
                    return data;
                }
            }

            //雷达图分析
            if (data.series.length) {
                if (Object.is(data.series[0].type, 'radar')) {

                    //1.找到每个角的最大值
                    let max: number = 0;

                    //获得每个角的数据
                    let arrs: Array<any> = [];
                    for (let i in data.series) {
                        arrs.push(data.series[i].data);
                    }
                    const lastarrs: Array<any> = arrs[0].map(function (col, i) {
                        return arrs.map(function (row) {
                            return row[i];
                        })
                    });
                    let maxs = [];
                    for (let j in lastarrs) {
                        max = lastarrs[j][0];
                        for (let k in lastarrs[j]) {
                            if (max < lastarrs[j][k]) {
                                max = lastarrs[j][k];
                            }
                        }
                        maxs.push(max);
                    }

                    // x轴数据转化成indicator数据
                    let indicatorArr: Array<any> = [];
                    for (let i in data.xAxis.data) {
                        for (let j in maxs) {
                            if (i === j) {
                                indicatorArr.push({ name: data.xAxis.data[i], max: maxs[i] });
                            }
                        }
                    }
                    data.radar.indicator = [];
                    if (Array.isArray(indicatorArr)) {
                        data.radar.indicator = [...indicatorArr];
                    }
                    data.xAxis = null;

                    // 设置series的data数据
                    for (let i in data.series) {
                        const valueArray = data.series[i].data;
                        const name = data.series.name;
                        data.series[i].data = [];
                        data.series[i].data.push({ name: name, value: valueArray });
                    }
                }
            }

        }
        return data;
    }

}

