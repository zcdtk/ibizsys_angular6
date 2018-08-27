import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ibiz-datepicker',
  templateUrl: './ibiz-datepicker.component.html',
  styleUrls: ['./ibiz-datepicker.component.less']
})
export class IbizDatepickerComponent {

  /**
   * 日期控件格式
   *
   * @type {string}
   * @memberof IBizDatepickerComponent
   */
  public fmt: string;

  /**
   * 表单部件对象
   *
   * @type {*}
   * @memberof IBizDatepickerComponent
   */
  @Input()
  form: any;

  /**
   * 是否展示时间
   * 
   * @type {boolean}
   * @memberof IbizDatepickerComponent
   */
  showtime: boolean;

  /**
   * 表格部件服务对象，行编辑使用
   *
   * @type {*}
   * @memberof IBizDatepickerComponent
   */
  @Input()
  grid: any;

  /**
   * 表格行数据，行编辑使用
   *
   * @type {*}
   * @memberof IBizDatepickerComponent
   */
  @Input()
  data: any;

  /**
   * 编辑器值
   *
   * @type {string}
   * @memberof IBizDatepickerComponent
   */
  @Input()
  itemvalue: string;

  /**
   * 编辑器名称
   *
   * @type {string}
   * @memberof IBizDatepickerComponent
   */
  @Input()
  name: string;

  /**
   * 编辑器样式
   *
   * @type {*}
   * @memberof IBizDatepickerComponent
   */
  @Input()
  styleCss: any;

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
   * 编辑器是否启用
   *
   * @type {string}
   * @memberof IBizDatepickerComponent
   */
  @Input()
  disabled: string;

  /**
   * 编辑器提示信息
   *
   * @type {string}
   * @memberof IBizDatepickerComponent
   */
  @Input()
  placeholder: string;

  /**
   * Creates an instance of IBizDatepickerComponent.
   * 创建 IBizDatepickerComponent 实例
   * 
   * @param {DatePipe} datePipe
   * @memberof IBizDatepickerComponent
   */
  constructor(private datePipe: DatePipe) { }

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
