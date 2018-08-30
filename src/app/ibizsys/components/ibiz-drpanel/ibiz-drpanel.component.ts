import { Component, OnInit, Input } from '@angular/core';
import { IBizEvent } from '../../IBizEvent';

@Component({
    selector: 'app-ibiz-drpanel',
    templateUrl: './ibiz-drpanel.component.html',
    styleUrls: ['./ibiz-drpanel.component.less']
})
export class IBizDRPanelComponent implements OnInit {

    /**
     * 关系数据类型
     * 
     * @type {string}
     * @memberof IBizDRPanelComponent
     */
    @Input() RelationalDataType: string;

    /**
     * 刷新数据项
     * 
     * @type {*}
     * @memberof IBizDRPanelComponent
     */
    @Input() refreshitems: string;

    /**
     * 表单对象
     * 
     * @type {*}
     * @memberof IBizDRPanelComponent
     */
    @Input() form: any;

    /**
     * 刷新数据
     * 
     * @private
     * @type {*}
     * @memberof IBizDRPanelComponent
     */
    private hookItems: any = {};

    /**
     * 统计刷新项
     * 
     * @private
     * @type {*}
     * @memberof IBizDRPanelComponent
     */
    public count: any = 0;

    /**
     * 父数据主键
     * 
     * @type {string}
     * @memberof IBizDRPanelComponent
     */
    public srfparentkey: string;

    /**
     * 表单活动数据
     * 
     * @type {*}
     * @memberof IBizDRPanelComponent
     */
    public activeData: any = {};

    /**
     * 开启遮罩
     * 
     * @type {boolean}
     * @memberof IBizDRPanelComponent
     */
    public blockUI: boolean = false;

    /**
     * 遮罩提示信息
     * 
     * @type {string}
     * @memberof IBizDRPanelComponent
     */
    public blockUITipInfo: string = '请先保存主数据';


    /**
     * 是否是关系系数据
     * 
     * @private
     * @type {boolean}
     * @memberof IBizDRPanelComponent
     */
    private isRelationalData: boolean = true;

    constructor() { }

    ngOnInit() {
        this.initDRPanel();
    }

    /**
     * 初始化关系部件
     * 
     * @private
     * @memberof IBizDRPanelComponent
     */
    private initDRPanel(): void {

        if (this.form) {
            const form: any = this.form;
            form.on(IBizEvent.IBizForm_FORMLOADED).subscribe((data) => {
                this.refreshDRUIPart();
            });
            form.on(IBizEvent.IBizForm_FORMSAVED).subscribe((data) => {
                this.refreshDRUIPart();
            });

            const items: Array<any> = this.refreshitems.split(';');

            if (items.length > 0) {
                items.forEach(item => {
                    this.hookItems[item.toLowerCase()] = true;
                });
                form.on(IBizEvent.IBizForm_FORMFIELDCHANGED).subscribe((data) => {
                    if (form.$ignoreformfieldchange) {
                        return;
                    }

                    if (!data) {
                        return;
                    }
                    const fieldname = data.name;

                    if (this.isRefreshItem(fieldname)) {
                        this.refreshDRUIPart();
                    }
                });
            }
        }
    }

    /**
     * 保存关系数据，继续父数据保存，返回true,否则返回false
     * 
     * @returns {boolean} 
     * @memberof IBizDRPanelComponent
     */
    public saveDRData(): boolean {
        // var me=this;
        // if(.isFunction(me.drController.saveDRData)){
        // 	return me.drController.saveDRData();
        // }
        return true;
    }

    /**
     * 
     * 
     * @param {string} name 
     * @returns {boolean} 
     * @memberof IBizDRPanelComponent
     */
    public isRefreshItem(name: string): boolean {
        if (!name || name === '') {
            return false;
        }

        if (this.hookItems[name.toLowerCase()]) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 刷新关系数据
     * 
     * @returns {void} 
     * @memberof IBizDRPanelComponent
     */
    public refreshDRUIPart(): void {

        if (Object.is(this.RelationalDataType, 'CUSTOM')) {
            this.isRelationalData = false;
        }

        const form = this.form;
        const _field = form.findField('srfkey');
        if (!_field) {
            return;
        }
        const _value = _field.getValue();
        if (this.isRelationalData) {
            if (!_value || _value == null || Object.is(_value, '')) {
                this.blockUIStart();
                return;
            } else {
                this.blockUIStop();
            }
        }

        const activeData = form.getActiveData();

        setTimeout(() => {
            this.srfparentkey = _value;
            Object.assign(this.activeData, activeData);
            this.count += 1;
        }, 10);
    }

    /**
     * 开启遮罩
     * 
     * @private
     * @memberof IBizDRPanelComponent
     */
    private blockUIStart(): void {
        this.blockUI = true;
    }

    /**
     * 关闭遮罩
     * 
     * @private
     * @memberof IBizDRPanelComponent
     */
    private blockUIStop(): void {
        this.blockUI = false;
    }

}
