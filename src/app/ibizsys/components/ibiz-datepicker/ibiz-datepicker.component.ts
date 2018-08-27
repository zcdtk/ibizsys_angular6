import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-datepicker',
    templateUrl: './ibiz-datepicker.component.html',
    styleUrls: ['./ibiz-datepicker.component.less']
})
export class IBizDatepickerComponent extends IBizComponent {

    /**
     * 日期控件格式
     *
     * @type {string}
     * @memberof IBizDatepickerComponent
     */
    public fmt: string;

    /**
     * 是否展示时间
     * 
     * @type {boolean}
     * @memberof IBizDatepickerComponent
     */
    showtime: boolean;

    /**
     * 时间格式
     *
     * @memberof IBizDatepickerComponent
     */
    @Input()
    set datefmt(val: string) {
        this.fmt = val;
        this.showtime = (val.indexOf('HH') >= 0) ? true : false;
    }

    /**
     * Creates an instance of IBizDatepickerComponent.
     * 创建 IBizDatepickerComponent 实例
     * 
     * @param {DatePipe} datePipe
     * @memberof IBizDatepickerComponent
     */
    constructor(private datePipe: DatePipe) {
        super();
    }

    /**
     * 数据发生改变
     *
     * @param {*} value
     * @memberof IBizDatepickerComponent
     */
    public valueChange(value: any): void {
        let val = this.datePipe.transform(value, this.fmt.replace('YYYY', 'yyyy').replace('DD', 'dd'));
        val = val == null ? '' : val;
        if (this.form) {
            const itemField = this.form.findField(this.name);
            if (itemField) {
                itemField.setValue(val);
            }
        }
        if (this.grid) {
            this.grid.colValueChange(this.name, val, this.data);
        }
    }

}
