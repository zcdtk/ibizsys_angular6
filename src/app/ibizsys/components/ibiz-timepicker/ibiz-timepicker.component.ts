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


    public $date = new Date();

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

    /**
     * 数据发生改变
     *
     * @param {Date} value
     * @memberof IBizTimepickerComponent
     */
    public valueChange(value: Date): void {
        let val = this.datePipe.transform(value, this.datefmt);
        val = val == null ? '' : val;
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


    public setComponentValue (val) {
        this.$value = '2018-08-27 14:44:12';
    }

}
