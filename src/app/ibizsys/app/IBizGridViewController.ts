import { IBizMDViewController } from './IBizMDViewController';
import { IBizEvent } from '../IBizEvent';

/**
 * 表格视图控制
 * 
 * @export
 * @class IBizGridViewController
 * @extends {IBizMDViewController}
 */
export class IBizGridViewController extends IBizMDViewController {

    /**
     * 导出数据起始页
     * 
     * @type {number}
     * @memberof IBizGridViewController
     */
    public $exportStartPage: number;

    /**
     * 导出数据结束页
     * 
     * @type {number}
     * @memberof IBizGridViewController
     */
    public $exportEndPage: number;

    /**
     * 导出数据模式
     *  all: 导出全部数据最多1000行
     *  custom: 导出指定页数
     * @type {string}
     * @memberof IBizGridViewController
     */
    public $itemtag: string;

    /**
     * Creates an instance of IBizGridViewController.
     * 创建 IBizGridViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizGridViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 部件初始化
     * 
     * @memberof IBizGridViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();

        const grid = this.getMDCtrl();
        if (grid) {
            // 双击行数据
            grid.on(IBizEvent.IBizDataGrid_ROWDBLCLICK).subscribe((args) => {
                this.onSelectionChange(args);
                if (this.getGridRowActiveMode() === 0) {
                    return;
                }
                this.onDataActivated(args[0]);
            });
            // 单击行数据
            grid.on(IBizEvent.IBizDataGrid_ROWCLICK).subscribe((args) => {
                this.onSelectionChange(args);
                if (this.getGridRowActiveMode() === 1) {
                    this.onDataActivated(args[0]);
                }
            });
            // 表格行数据变化
            grid.on(IBizEvent.IBizDataGrid_UPDATEGRIDITEMCHANGE).subscribe((param) => {
                if (!this.isEnableRowEdit()) {
                    return;
                }
                this.onGridRowChanged(param.name, param.data);
            });
        }
    }

    /**
     * 获取多项数据控件对象
     * 
     * @returns {*} 
     * @memberof IBizGridViewController
     */
    public getMDCtrl(): any {
        return this.getGrid();
    }

    /**
     * 获取表格部件对象
     * 
     * @returns {*} 
     * @memberof IBizGridViewController
     */
    public getGrid(): any {
        return this.$controls.get('grid');
    }

    /**
     * 获取搜索表单对象
     * 
     * @returns {*} 
     * @memberof IBizGridViewController
     */
    public getSearchForm(): any {
        return this.$controls.get('searchform');
    }

    /**
     * 表格行数据激活模式，默认支持双击激活行数据
     * 
     * @returns {number}  0--不激活，1--单击激活模式，2--双击激活行数据
     * @memberof IBizGridViewController
     */
    public getGridRowActiveMode(): number {
        return 2;
    }

    /**
     * 隐藏关系列
     * 
     * @param {any} parentMode 
     * @memberof IBizGridViewController
     */
    public doHideParentColumns(parentMode: any): void {
    }

    /**
     * 隐藏列
     * 
     * @param {any} columnname 
     * @memberof IBizGridViewController
     */
    public hideGridColumn(columnname: any): void {

    }

    /**
     * 删除操作
     * 
     * @param {*} [params={}] 
     * @returns {void} 
     * @memberof IBizGridViewController
     */
    public doRemove(params: any = {}): void {

        if (params && params.srfkey) {
            // if ($.isFunction(this.getMDCtrl().findItem)) {
            //     params = this.getMDCtrl().findItem('srfkey', params.srfkey);
            // }
            // //询问框
            // IBiz.confirm($IGM('GRIDVIEWCONTROLLER.DOREMOVE.INFO', '确认要删除数据，删除操作将不可恢复？'), function (result) {
            //     if (result) {
            //         this.removeData({ srfkeys: params.srfkey });
            //     }
            // });
        } else {
            let selectedData = this.getGrid().getSelection();
            if (!selectedData || selectedData == null || selectedData.length === 0) {
                return;
            }

            let dataInfo = '';

            selectedData.forEach((record, index) => {
                let srfmajortext = record.srfmajortext;
                if (index < 5) {
                    if (!Object.is(dataInfo, '')) {
                        dataInfo += '、';
                    }
                    dataInfo += srfmajortext;
                } else {
                    return false;
                }

            });


            if (selectedData.length < 5) {
                dataInfo = dataInfo + '共' + selectedData.length + '条数据';
            } else {
                dataInfo = dataInfo + '...' + '共' + selectedData.length + '条数据';
            }

            dataInfo = dataInfo.replace(/[null]/g, '').replace(/[undefined]/g, '').replace(/[ ]/g, '');

            // 询问框
            this.$iBizNotification.confirm('警告', '确认要删除 ' + dataInfo + '，删除操作将不可恢复？').subscribe((result) => {
                if (result && Object.is(result, 'OK')) {
                    this.removeData(null);
                }
            });
        }
    }

    /**
     * 删除数据
     * 
     * @param {*} [arg={}] 
     * @returns {void} 
     * @memberof IBizGridViewController
     */
    public removeData(arg: any = {}): void {
        if (!arg) {
            arg = {};
        }

        if (this.getParentMode()) {
            Object.assign(arg, this.getParentMode());
        }

        if (this.getParentData()) {
            Object.assign(arg, this.getParentData());
        }

        if (!arg.srfkeys) {
            // 获取要删除的数据集合
            const selectedData: Array<any> = this.getGrid().getSelection();
            if (!selectedData || selectedData == null || selectedData.length === 0) {
                return;
            }

            let keys = '';
            selectedData.forEach((record) => {
                let key = record.srfkey;
                if (!Object.is(keys, '')) {
                    keys += ';';
                }
                keys += key;
            });
            arg.srfkeys = keys;
        }

        let grid: any = this.getGrid();
        if (grid) {
            grid.remove(arg);
        }
    }

    /**
     * 批量添加数据
     * 
     * @param {Array<any>} selectedDatas 
     * @returns {void} 
     * @memberof IBizGridViewController
     */
    public addDataBatch(selectedDatas: Array<any>): void {
        let arg: any = {};

        if (!selectedDatas || selectedDatas == null || selectedDatas.length === 0) {
            return;
        }

        Object.assign(arg, this.$viewParam);

        if (this.getParentMode()) {
            Object.assign(arg, this.getParentMode());
        }

        if (this.getParentData()) {
            Object.assign(arg, this.getParentData());
        }

        let keys = '';
        selectedDatas.forEach((record) => {
            let key = record.srfkey;
            if (!Object.is(keys, '')) {
                keys += ';';
            }
            keys += key;
        });
        arg.srfkeys = keys;
        let grid: any = this.getGrid();
        if (grid) {
            grid.addBatch(arg);
        }
    }

    /**
     * 编辑操作
     * 
     * @param {*} [params={}] 
     * @returns {void} 
     * @memberof IBizGridViewController
     */
    public doEdit(params: any = {}): void {
        const gridCtrl: any = this.getGrid();
        if (!gridCtrl) {
            return;
        }
        // 获取要编辑的数据集合
        if (params && params.srfkey) {

            const param = gridCtrl.findItem('srfkey', params.srfkey);
            if (!param) {
                return;
            }
            const arg = { data: Object.assign(params, param) };
            this.onEditData(arg);
            return;
        }

        let selectedData = gridCtrl.getSelection();
        if (!selectedData || selectedData == null || selectedData.length === 0) {
            return;
        }

        let arg = { data: selectedData[0] };
        this.onEditData(arg);
    }

    /**
     * 实体界面行为参数
     *
     * @param {*} [uiaction={}] 实体界面行为
     * @returns {*}
     * @memberof IBizGridViewController
     */
    public getBackendUIActionParam(uiaction: any = {}): any {

        if (Object.is(uiaction.actiontarget, 'SINGLEKEY') || Object.is(uiaction.actiontarget, 'MULTIKEY')) {
            let selectedData: Array<any> = this.getGrid().getSelection();
            if (!selectedData && selectedData == null || selectedData.length === 0) {
                return null;
            }

            let vlaueitem = 'srfkey';
            let paramkey = 'srfkeys';
            let paramitems = '';
            let paramjo = null;
            let infoitem = 'srfmajortext';

            if (uiaction.actionparams) {
                let actionparams = uiaction.actionparams;
                vlaueitem = (actionparams.vlaueitem && !Object.is(actionparams.vlaueitem, '')) ? actionparams.vlaueitem.toLowerCase() : vlaueitem;
                paramkey = (actionparams.paramitem && !Object.is(actionparams.paramitem, '')) ? actionparams.paramitem.toLowerCase() : paramkey;
                infoitem = (actionparams.textitem && !Object.is(actionparams.textitem, '')) ? actionparams.textitem.toLowerCase() : infoitem;
                paramjo = actionparams.paramjo ? actionparams.paramjo : {};
            }

            let dataInfo = '';
            let firstOnly: boolean = (Object.is(uiaction.actiontarget, 'SINGLEKEY'));
            selectedData.some((record: any = {}, index: number) => {
                let srfmajortext = record[infoitem];

                if (vlaueitem) {
                    let temp = record[vlaueitem];
                    if (!Object.is(paramitems, '')) {
                        paramitems += ';';
                    }
                    paramitems += temp ? temp : '';
                }

                if (index < 5) {
                    if (!Object.is(dataInfo, '')) {
                        dataInfo += '、';
                    }
                    dataInfo += srfmajortext;
                }
                if (firstOnly) {
                    return false;
                }
            });
            let data = { dataInfo: dataInfo };
            data[paramkey] = paramitems;
            if (paramjo) {
                Object.assign(data, paramjo);
            }
            return data;
        }
        return {};
    }

    /**
     * 导出操作（Excel）
     * 
     * @param {*} params 
     * @memberof IBizGridViewController
     */
    public doExportExcel(params: any): void {
        if (this.getMDCtrl()) {
            this.getMDCtrl().exportData(params);
        }
    }

    /**
     * 表格行数据变化
     *
     * @param {string} name
     * @param {*} [data={}]
     * @memberof IBizGridViewController
     */
    public onGridRowChanged(name: string, data: any = {}): void {
    }
}
