import { Input, OnInit } from '@angular/core';

/**
 * 组件基本类
 *
 * @export
 * @class IBizComponent
 */
export class IBizComponent implements OnInit {

    /**
     * 编辑器宽高样式
     *
     * @type {*}
     * @memberof IBizComponent
     */
    public styleCss: any = { width: '100%', height: '100%' };

    /**
     * 编辑器id
     *
     * @type {string}
     * @memberof IBizComponent
     */
    @Input() id: string;

    /**
     * 编辑器名称
     *
     * @type {string}
     * @memberof IBizComponent
     */
    @Input() name: string;

    /**
     * 表单部件对象
     *
     * @type {*}
     * @memberof IBizComponent
     */
    @Input() form: any;

    /**
     * 编辑器高度
     *
     * @type {string}
     * @memberof IBizComponent
     */
    @Input() height: string;

    /**
     * 编辑器宽度
     *
     * @type {string}
     * @memberof IBizComponent
     */
    @Input() width: string;

    /**
     * 编辑器是否启用
     *
     * @type {*}
     * @memberof IBizComponent
     */
    @Input() disabled: any;

    /**
     * 编辑器提示信息
     *
     * @type {string}
     * @memberof IBizComponent
     */
    @Input() placeholder: string;

    /**
     * 编辑器值项名称
     *
     * @type {string}
     * @memberof IBizComponent
     */
    @Input() valueItem: string;

    /**
     * 表格部件对象，行编辑使用
     *
     * @type {*}
     * @memberof IBizComponent
     */
    @Input() grid: any;

    /**
     * 表格行数据，行编辑使用
     *
     * @type {*}
     * @memberof IBizComponent
     */
    @Input() data: any;

    /**
     * 编辑器值文本值
     *
     * @type {string}
     * @memberof IBizComponent
     */
    @Input()
    set value(val: any) {
        this.setComponentValue(val);
    }

    /**
     * 组件值
     *
     * @type {string}
     * @memberof IBizComponent
     */
    public $value: string;

    constructor() { }

    ngOnInit(): void {
        // 初始化宽高
        if (this.width) {
            Object.assign(this.styleCss, { width: this.width });
        }
        if (this.height) {
            Object.assign(this.styleCss, { height: this.height });
        }
    }

    /**
     * 组件值设置
     *
     * @param {*} val
     * @memberof IBizComponent
     */
    public setComponentValue(val: any) {
        this.$value = val;
    }
}
