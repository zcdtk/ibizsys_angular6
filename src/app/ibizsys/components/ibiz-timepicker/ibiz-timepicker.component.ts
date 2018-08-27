import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-timepicker',
    templateUrl: './ibiz-timepicker.component.html',
    styleUrls: ['./ibiz-timepicker.component.less']
})
export class IBizTimepickerComponent extends IBizComponent {

    /**
     * 时间编辑器格式
     *
     * @type {string}
     * @memberof IBizTimepickerComponent
     */
    @Input()
    datefmt: string;


    public $time: Date | null = null;

    /**
     * Creates an instance of IBizTimepickerComponent.
     * 创建 IBizTimepickerComponent 实例
     * 
     * @param {DatePipe} datePipe
     * @memberof IBizTimepickerComponent
     */
    constructor(private datePipe: DatePipe) {
        super();
    }

    public openChange(flag: Boolean): void {
        if (!flag) {
            let timeStr = (this.$time.toTimeString()).substring(0, 8);
            if (!timeStr) {
                return;
            }
            let val = timeStr == null ? '' : timeStr;
            if (this.form) {
                let itemField = this.form.findField(this.name);
                if (itemField) {
                    itemField.setValue(val);
                }
            }
            if (this.grid) {
                this.grid.colValueChange(this.name, val, this.data);
            }
        }
    }

    public setComponentValue(val) {
        if (!val) {
            return;
        }
        this.$time = new Date(0, 0, 0, 0, 0, 0, 0);
        if (Object.is(this.datefmt, 'HH:mm:ss')) {
            let times: Array<any> = val.split(":");
            this.$time.setHours(times[0]);
            this.$time.setMinutes(times[1]);
            this.$time.setSeconds(times[2]);
        }
        if (Object.is(this.datefmt, 'HH:mm')) {
            let times: Array<any> = val.split(":");
            this.$time.setHours(times[0]);
            this.$time.setMinutes(times[1]);
        }
        if (Object.is(this.datefmt, 'HH')) {
            let times: Array<any> = val.split(":");
            this.$time.setHours(times[0]);
        }
        if (Object.is(this.datefmt, 'mm')) {
            let times: Array<any> = val.split(":");
            this.$time.setMinutes(times[1]);
        }
        if (Object.is(this.datefmt, 'ss')) {
            let times: Array<any> = val.split(":");
            this.$time.setSeconds(times[2]);
        }

    }

}
