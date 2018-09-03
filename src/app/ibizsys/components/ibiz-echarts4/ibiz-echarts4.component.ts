import { IBizEvent } from './../../IBizEvent';
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
    // tslint:disable-next-line:directive-selector
    selector: 'app-ibiz-echarts4',
})
// tslint:disable-next-line:directive-class-suffix
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
     * @type {*}
     * @memberof IBizEcharts4Component
     */
    @Input() ctrl: any;

    /**
     * Creates an instance of IBizEcharts4Component.
     *  创建 IBizEcharts4Component 实例
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
                echartsCtrl.resize();
            });
        } else {
            echartsCtrl.setOption({});
            echartsCtrl.resize();
        }
        window.onresize = function () {
            echartsCtrl.resize();
        };
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

            // 区域图分析
            if (data.series.length) {
                if (Object.is(data.series[0].type, 'area')) {

                    // 如果series是数组的话
                    for (const i in data.series) {
                        if (data.series.hasOwnProperty(i)) {
                            data.series[i].type = 'line';
                            data.series[i].areaStyle = {};
                            Object.assign(data.series[i].areaStyle, { normal: {} });
                        }
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

            // 雷达图分析
            if (data.series.length) {
                if (Object.is(data.series[0].type, 'radar')) {

                    // 1.找到每个角的最大值
                    let max = 0;

                    // 获得每个角的数据
                    // tslint:disable-next-line:prefer-const
                    let arrs: Array<any> = [];
                    for (const i in data.series) {
                        if (data.series.hasOwnProperty(i)) {
                            arrs.push(data.series[i].data);
                        }
                    }
                    const lastarrs: Array<any> = arrs[0].map(function (col, i) {
                        return arrs.map(function (row) {
                            return row[i];
                        });
                    });
                    // tslint:disable-next-line:prefer-const
                    let maxs = [];
                    for (const j in lastarrs) {
                        if (lastarrs.hasOwnProperty(j)) {
                            max = lastarrs[j][0];
                            for (const k in lastarrs[j]) {
                                if (max < lastarrs[j][k]) {
                                    max = lastarrs[j][k];
                                }
                            }
                            maxs.push(max);
                        }
                    }

                    // x轴数据转化成indicator数据
                    // tslint:disable-next-line:prefer-const
                    let indicatorArr: Array<any> = [];
                    for (const i in data.xAxis.data) {
                        if (data.xAxis.data.hasOwnProperty(i)) {
                            for (const j in maxs) {
                                if (i === j) {
                                    indicatorArr.push({ name: data.xAxis.data[i], max: maxs[i] });
                                }
                            }
                        }
                    }

                    data.radar.indicator = [];
                    if (Array.isArray(indicatorArr)) {
                        data.radar.indicator = [...indicatorArr];
                    }
                    data.xAxis = null;

                    // 设置series的data数据
                    for (const i in data.series) {
                        if (data.series.hasOwnProperty(i)) {
                            const valueArray = data.series[i].data;
                            const name = data.series.name;
                            data.series[i].data = [];
                            data.series[i].data.push({ name: name, value: valueArray });
                        }
                    }
                }
            }

        }
        return data;
    }

}

