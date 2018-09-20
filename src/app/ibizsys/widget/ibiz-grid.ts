import { IBizUtil } from './../util/ibiz-util';
import { IBizEvent } from './../ibiz-event';
import { IBizMDControl } from './ibiz-mdcontrol';

/**
 * 表格部件服务对象
 * 
 * @export
 * @class IBizGrid
 * @extends {IBizMDControl}
 */
export class IBizGrid extends IBizMDControl {

    /**
     * 查询开始条数
     * 
     * @memberof IBizGrid
     */
    public $start = 0;

    /**
     * 每次加载条数
     * 
     * @memberof IBizGrid
     */
    public $limit = 20;

    /**
     * 总条数
     * 
     * @memberof IBizGrid
     */
    public $totalrow = 0;

    /**
     * 当前显示页码
     * 
     * @memberof IBizGrid
     */
    public $curPage = 1;

    /**
     * 是否全选
     * 
     * @memberof IBizGrid
     */
    public $allChecked = false;

    /**
     * 表格行选中动画
     * 
     * @memberof IBizGrid
     */
    public $indeterminate = false;

    /**
     * 是否分页设置
     * 
     * @type {boolean}
     * @memberof IBizGrid
     */
    public $pageChangeFlag: boolean;

    /**
     * 表格全部排序字段
     * 
     * @type {Array<any>}
     * @memberof IBizGrid
     */
    public $gridSortField: Array<any> = [];

    /**
     * 行多项选中设置，用于阻塞多次触发选中效果
     *
     * @private
     * @type {boolean}
     * @memberof IBizGrid
     */
    private $rowsSelection: boolean = false;

    /**
     * 是否支持多项
     * 
     * @type {boolean}
     * @memberof IBizGrid
     */
    public $multiSelect: boolean = true;

    /**
     * 是否启用行编辑
     *
     * @type {boolean}
     * @memberof IBizGrid
     */
    public $isEnableRowEdit: boolean = false;

    /**
     * 打开行编辑
     *
     * @type {boolean}
     * @memberof IBizGrid
     */
    public $openRowEdit: boolean = false;

    /**
     * 表格编辑项集合
     *
     * @type {*}
     * @memberof IBizGrid
     */
    public $editItems: any = {};

    /**
     * 编辑行数据处理
     *
     * @type {*}
     * @memberof IBizGrid
     */
    public $state: any = {};

    /**
     * 备份数据
     *
     * @type {Array<any>}
     * @memberof IBizGrid
     */
    public $backupData: Array<any> = [];

    /**
     * 最大导出行数
     *
     * @type {number}
     * @memberof IBizGrid
     */
    public $maxExportRow: number = 1000;

    /**
     * Creates an instance of IBizGrid.
     * 创建 IBizGrid 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizGrid
     */
    constructor(opts: any = {}) {
        super(opts);
        this.regEditItems();
    }

    /**
     * 加载数据
     *
     * @param {*} [arg={}]
     * @returns {void}
     * @memberof IBizGrid
     */
    public load(arg: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let opt: any = {};
        Object.assign(opt, arg);
        if (this.$isLoading) {
            return;
        }
        Object.assign(opt, { srfctrlid: this.getName(), srfaction: 'fetch' });
        if (!opt.start) {
            Object.assign(opt, { start: (this.$curPage - 1) * this.$limit });
        }
        if (!opt.limit) {
            Object.assign(opt, { limit: this.$limit });
        }

        Object.assign(opt, { sort: JSON.stringify(this.$gridSortField) });

        // 发送加载数据前事件
        this.fire(IBizEvent.IBizMDControl_BEFORELOAD, opt);

        this.$allChecked = false;
        this.$indeterminate = false;
        this.$selection = [];
        this.fire(IBizEvent.IBizMDControl_SELECTIONCHANGE, this.$selection);

        this.post(opt).subscribe(response => {
            if (!response.items || response.ret !== 0) {
                if (response.errorMessage) {
                    this.$iBizNotification.error('', response.errorMessage);
                }
                return;
            }
            this.$items = this.rendererDatas(response.items);
            this.$totalrow = response.totalrow;
            this.fire(IBizEvent.IBizMDControl_LOADED, response.items);
        }, error => {
            console.log(error.info);
        });
    }

    /**
     * 刷新数据
     * 
     * @param {*} [arg={}] 
     * @returns {void} 
     * @memberof IBizGrid
     */
    public refresh(arg: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let opt: any = {};
        Object.assign(opt, arg);
        if (this.$isLoading) {
            return;
        }
        Object.assign(opt, { srfctrlid: this.getName(), srfaction: 'fetch' });
        if (!opt.start) {
            Object.assign(opt, { start: (this.$curPage - 1) * this.$limit });
        }
        if (!opt.limit) {
            Object.assign(opt, { limit: this.$limit });
        }

        Object.assign(opt, { sort: JSON.stringify(this.$gridSortField) });

        // 发送加载数据前事件
        this.fire(IBizEvent.IBizMDControl_BEFORELOAD, opt);

        this.$allChecked = false;
        this.$indeterminate = false;
        this.$selection = [];
        this.fire(IBizEvent.IBizMDControl_SELECTIONCHANGE, this.$selection);

        this.post(opt).subscribe(response => {
            if (!response.items || response.ret !== 0) {
                if (response.errorMessage) {
                    this.$iBizNotification.error('', response.errorMessage);
                }
                return;
            }

            this.fire(IBizEvent.IBizMDControl_LOADED, response.items);
            this.$items = this.rendererDatas(response.items);
            this.$totalrow = response.totalrow;
        }, error => {
            console.log(error.info);
        });
    }

    /**
     * 删除数据
     * 
     * @param {*} [arg={}] 
     * @memberof IBizGrid
     */
    public remove(arg: any = {}): void {
        const params: any = {};
        Object.assign(params, arg);
        Object.assign(params, { srfaction: 'remove', srfctrlid: this.getName() });
        this.post(params).subscribe(response => {
            if (response.ret !== 0) {
                this.$iBizNotification.error('', '删除数据失败,' + response.info);
                return;
            }
            if (this.$allChecked) {
                const rows = this.$curPage * this.$limit;
                if (this.$totalrow <= rows) {
                    this.$curPage = this.$curPage - 1;
                    if (this.$curPage === 0) {
                        this.$curPage = 1;
                    }
                }
            }
            this.load({});
            this.fire(IBizEvent.IBizDataGrid_REMOVED, {});
            if (response.info && response.info !== '') {
                this.$iBizNotification.success('', '删除成功!');
            }
            this.$selection = [];
            IBizUtil.processResult(response);
        }, error => {
            this.$iBizNotification.error('', '删除数据失败');
        });
    }

    /**
     * 行数据复选框单选
     * 
     * @param {boolean} value 
     * @param {*} [item={}] 
     * @returns {void} 
     * @memberof IBizGrid
     */
    public onItemSelect(value: boolean, item: any = {}): void {
        if (item.disabled) {
            return;
        }
        if (this.$isEnableRowEdit && this.$openRowEdit) {
            return;
        }

        const index: number = this.$selection.findIndex(data => Object.is(data.srfkey, item.srfkey));
        if (index === -1) {
            this.$selection.push(item);
        } else {
            this.$selection.splice(index, 1);
        }

        if (!this.$multiSelect) {
            this.$selection.forEach(data => {
                data.checked = false;
            });
            this.$selection = [];
            if (index === -1) {
                this.$selection.push(item);
            }
        }
        this.$rowsSelection = true;
        this.$allChecked = this.$selection.length === this.$items.length ? true : false;
        this.$indeterminate = (!this.$allChecked) && (this.$selection.length > 0);
        item.checked = value;
        this.fire(IBizEvent.IBizMDControl_SELECTIONCHANGE, this.$selection);
    }

    /**
     * 行数据复选框全选
     * 
     * @param {boolean} value 
     * @memberof IBizMDControl
     */
    public selectAll(value: boolean): void {
        if (this.$isEnableRowEdit && this.$openRowEdit) {
            return;
        }

        if (!this.$multiSelect) {
            setTimeout(() => {
                this.$allChecked = false;
            });
            return;
        }
        this.$items.forEach(item => {
            if (!item.disabled) {
                item.checked = value;
            }
        });
        this.$selection = [];
        if (value) {
            this.$selection = [...this.$items];
        }
        this.$indeterminate = (!value) && (this.$selection.length > 0);
        this.fire(IBizEvent.IBizMDControl_SELECTIONCHANGE, this.$selection);
    }

    /**
     * 导出数据
     * 
     * @param {any} params 
     * @memberof IBizGrid
     */
    public exportData(arg: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let params: any = {};
        this.fire(IBizEvent.IBizMDControl_BEFORELOAD, params);
        if (params.search) {
            Object.assign(params, { query: params.search });
        }
        Object.assign(params, { srfaction: 'exportdata', srfctrlid: this.getName() });

        if (Object.is(arg.itemTag, 'all')) {
            Object.assign(params, { start: 0, limit: this.$maxExportRow });
        } else if (Object.is(arg.itemTag, 'custom')) {
            const nStart = arg.exportPageStart;
            const nEnd = arg.exportPageEnd;
            if (nStart < 1 || nEnd < 1 || nStart > nEnd) {
                this.$iBizNotification.warning('警告', '请输入有效的起始页');
                return;
            }
            Object.assign(params, { start: (nStart - 1) * this.$limit, limit: nEnd * this.$limit });
        } else {
            Object.assign(params, { start: (this.$curPage * this.$limit) - this.$limit, limit: this.$curPage * this.$limit });
        }
        this.post(params).subscribe(res => {
            if (res.ret !== 0) {
                this.$iBizNotification.warning('警告', res.info);
                return;
            }
            if (res.downloadurl) {
                let downloadurl: string = res.downloadurl;
                if (downloadurl.indexOf('/') === 0) {
                    downloadurl = downloadurl.substring(downloadurl.indexOf('/') + 1, downloadurl.length);
                } else {
                    downloadurl = downloadurl;
                }
                IBizUtil.download(downloadurl);
            }
        }, error => {
            console.log(error.info);
        });
    }

    /**
     * 重置分页
     *
     * @memberof IBizGrid
     */
    public resetStart(): void {
        this.$start = 0;
    }

    /**
     * 分页页数改变
     * 
     * @memberof IBizGrid
     */
    public pageIndexChange() {
        this.refresh();
    }

    /**
     * 每页显示条数
     * 
     * @memberof IBizGrid
     */
    public pageSizeChange(): void {
        this.$curPage = 1;
        this.refresh();
    }

    /**
     * 单击行选中
     *
     * @param {*} [data={}]
     * @memberof IBizGrid
     */
    public clickRowSelect(data: any = {}): void {
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizEvent.IBizDataGrid_ROWCLICK, this.$selection);
    }

    /**
     * 双击行选中
     *
     * @param {*} [data={}]
     * @memberof IBizGrid
     */
    public dblClickRowSelection(data: any = {}): void {
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizEvent.IBizDataGrid_ROWDBLCLICK, this.$selection);
    }

    /**
     * 表格排序
     * 
     * @param {string} name 字段明显
     * @param {string} type 排序类型
     * @returns {void} 
     * @memberof IBizGrid
     */
    public sort(name: string, type: string): void {
        // tslint:disable-next-line:prefer-const
        let item: any = this.$gridSortField.find(_item => Object.is(_item.property, name));
        if (item === undefined) {
            if (Object.is('ascend', type)) {
                this.$gridSortField.push({ property: name, direction: 'asc' });
            } else if (Object.is('descend', type)) {
                this.$gridSortField.push({ property: name, direction: 'desc' });
            } else {
                return;
            }
        }

        const index = this.$gridSortField.findIndex((field) => {
            return Object.is(field.property, name);
        });

        if (Object.is('ascend', type)) {
            this.$gridSortField[index].direction = 'asc';
        } else if (Object.is('descend', type)) {
            this.$gridSortField[index].direction = 'desc';
        } else {
            this.$gridSortField.splice(index, 1);
        }

        this.refresh({});
    }

    /**
     * 设置表格数据当前页
     * 
     * @param {number} page 分页数量
     * @memberof IBizGrid
     */
    public setCurPage(page: number): void {
        this.$curPage = page;
    }

    /**
     * 设置是否支持多选
     * 
     * @param {boolean} state 是否支持多选
     * @memberof IBizGrid
     */
    public setMultiSelect(state: boolean): void {
        this.$multiSelect = state;
    }

    /**
     * 界面行为
     *
     * @param {string} tag
     * @param {*} [data={}]
     * @memberof IBizGrid
     */
    public uiAction(tag: string, data: any = {}) {
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizEvent.IBizMDControl_UIACTION, { tag: tag, data: data });
    }

    /**
     * 处理非复选框行数据选中,并处理是否激活数据
     *
     * @private
     * @param {*} [data={}]
     * @returns {boolean} 是否激活
     * @memberof IBizGrid
     */
    private doRowDataSelect(data: any = {}): boolean {
        if (this.$isEnableRowEdit && this.$openRowEdit) {
            return;
        }
        if (this.$rowsSelection) {
            this.$rowsSelection = false;
            return true;
        }
        this.$selection.forEach((item) => {
            item.checked = false;
        });
        this.$selection = [];
        data.checked = true;
        this.$selection.push(data);
        this.$indeterminate = (!this.$allChecked) && (this.$selection.length > 0);
        return false;
    }

    /**
     * 渲染绘制多项数据
     *
     * @param {Array<any>} items
     * @returns {Array<any>}
     * @memberof IBizGrid
     */
    public rendererDatas(items: Array<any>): Array<any> {
        super.rendererDatas(items);
        items.forEach(item => {
            const names: Array<any> = Object.keys(item);
            names.forEach(name => { item[name] = item[name] ? item[name] : ''; });
        });
        if (this.$isEnableRowEdit) {
            items.forEach((item: any) => { item.openeditrow = (this.$isEnableRowEdit) ? true : false; });
        }
        return items;
    }

    /**
     * 注册表格所有编辑项
     *
     * @memberof IBizGrid
     */
    public regEditItems(): void {
    }

    /**
     * 注册表格编辑项
     *
     * @param {*} [item={}]
     * @returns {void}
     * @memberof IBizGrid
     */
    public regEditItem(item: any = {}): void {
        if (Object.keys(item).length === 0) {
            return;
        }
        this.$editItems[item.name] = item;
    }

    /**
     * 设置编辑项状态
     *
     * @param {string} srfkey
     * @returns {void}
     * @memberof IBizGrid
     */
    public setEditItemState(srfkey: string): void {
        if (!this.$state) {
            return;
        }
        if (!srfkey) {
            this.$iBizNotification.warning('警告', '数据异常');
        }
        // tslint:disable-next-line:prefer-const
        let editItems: any = {};
        const itemsName: Array<any> = Object.keys(this.$editItems);
        itemsName.forEach(name => {
            // tslint:disable-next-line:prefer-const
            let item: any = {};
            const _editor = JSON.stringify(this.$editItems[name]);
            Object.assign(item, JSON.parse(_editor));
            editItems[name] = item;
        });
        this.$state[srfkey] = editItems;
    }

    /**
     * 删除信息编辑项状态
     *
     * @param {string} srfkey
     * @memberof IBizGrid
     */
    public deleteEditItemState(srfkey: string): void {
        if (srfkey && this.$state.hasOwnProperty(srfkey)) {
            delete this.$state.srfkey;
        }
    }

    /**
     * 设置编辑项是否启用
     *
     * @param {string} srfkey
     * @param {number} type
     * @memberof IBizGrid
     */
    public setEditItemDisabled(srfkey: string, type: number): void {
        if (this.$state && this.$state.hasOwnProperty(srfkey)) {
            // tslint:disable-next-line:prefer-const
            let item = this.$state[srfkey];
            const itemsName = Object.keys(item);
            itemsName.forEach(name => {
                const disabled: boolean = (item[name].enabledcond === 3 || item[name].enabledcond === type);
                item[name].disabled = !disabled;
            });
            Object.assign(this.$state[srfkey], item);
        }
    }

    /**
     * 获取行编辑状态
     *
     * @returns {boolean}
     * @memberof IBizGrid
     */
    public getOpenEdit(): boolean {
        return this.$openRowEdit;
    }

    /**
     * 保存表格所有编辑行 <在插件模板中提供重写>
     *
     * @memberof IBizGrid
     */
    public saveAllEditRow(): void {
    }

    /**
     * 是否启用行编辑
     *
     * @param {string} tag
     * @memberof IBizGrid
     */
    public isOpenEdit(tag: string): void {
        if (!this.$isEnableRowEdit) {
            this.$iBizNotification.info('提示', '未启用行编辑');
            return;
        }
        this.$openRowEdit = !this.$openRowEdit;
        if (this.$openRowEdit) {
            this.$items.forEach((item: any) => { item.openeditrow = true; });

            this.$selection.forEach((data) => {
                data.checked = false;
            });
            this.$selection = [];
            this.$indeterminate = false;
            this.fire(IBizEvent.IBizMDControl_SELECTIONCHANGE, this.$selection);
            this.$items.forEach(item => {
                const { ...data } = item;
                this.$backupData.push(data);
                this.setEditItemState(item.srfkey);
            });
        } else {
            this.$items = [];
            this.$backupData.forEach(data => {
                this.$items.push(data);
            });
            this.$backupData = [];
            this.$state = {};
        }
    }

    /**
     * 编辑行数据
     *
     * @param {*} [data={}]
     * @param {number} rowindex
     * @memberof IBizGrid
     */
    public editRow(data: any = {}, rowindex: number): void {
        data.openeditrow = !data.openeditrow;
        this.setEditItemState(data.srfkey);
        if (data.openeditrow) {
            const index: number = this.$backupData.findIndex(item => Object.is(item.srfkey, data.srfkey));
            if (index !== -1) {
                Object.assign(data, this.$backupData[index]);
            }
            if (Object.is(data.srfkey, '')) {
                this.$items.splice(rowindex, 1);
            }
        } else {
            this.setEditItemDisabled(data.srfkey, 2);
        }
    }

    /**
     * 保存编辑行数据
     *
     * @param {*} [data={}]
     * @param {number} rowindex
     * @memberof IBizGrid
     */
    public editRowSave(data: any = {}, rowindex: number): void {
        const _index: number = this.$backupData.findIndex(item => Object.is(item.srfkey, data.srfkey));
        const srfaction: string = (_index !== -1) ? 'update' : 'create';
        // tslint:disable-next-line:prefer-const
        let params: any = { srfaction: srfaction, srfctrlid: 'grid' };
        const _names: Array<any> = Object.keys(data);
        _names.forEach(name => {
            data[name] = data[name] ? data[name] : '';
        });
        Object.assign(params, data);
        this.post(params).subscribe((responce: any) => {
            if (responce.ret === 0) {
                data.openeditrow = !data.openeditrow;
                const index: number = this.$backupData.findIndex(item => Object.is(data.srfkey, item.srfkey));
                if (index !== -1) {
                    Object.assign(this.$backupData[index], responce.data);
                } else {
                    this.deleteEditItemState(data.srfkey);
                    this.setEditItemState(responce.data.srfkey);
                    this.$backupData.push(data);
                }
                Object.assign(data, responce.data);
                this.$iBizNotification.info('提示', '保存成功');
            }
        }, (error: any) => {
            let info = '';
            if (error.error && (error.error.items && Array.isArray(error.error.items))) {
                const items: Array<any> = error.error.items;
                items.forEach((item, index) => {
                    if (index > 0) {
                        info += '\n';
                    }
                    info += item.info;
                    Object.assign(this.$state[data.srfkey][item.id].styleCss, { 'border': '1px solid #f04134', 'border-radius': '4px' });
                });
            }
            this.$iBizNotification.error('错误', !Object.is(info, '') ? info : '行编辑保存失败');
        });
    }

    /**
     * 行编辑文本框光标移出事件
     *
     * @param {*} $event
     * @param {string} name
     * @param {*} [data={}]
     * @returns {void}
     * @memberof IBizGrid
     */
    public onBlur($event: any, name: string, data: any = {}): void {
        if ((!$event) || Object.keys(data).length === 0) {
            return;
        }
        if (Object.is($event.target.value, data[name])) {
            return;
        }
        this.colValueChange(name, $event.target.value, data);
    }

    /**
     * 行编辑文本框键盘事件
     *
     * @param {*} $event
     * @param {string} name
     * @param {*} [data={}]
     * @returns {void}
     * @memberof IBizGrid
     */
    public onKeydown($event: any, name: string, data: any = {}): void {
        if ((!$event) || Object.keys(data).length === 0) {
            return;
        }
        if ($event.keyCode !== 13) {
            return;
        }
        if (Object.is($event.target.value, data[name])) {
            return;
        }
        this.colValueChange(name, $event.target.value, data);
    }

    /**
     * 行编辑单元格值变化
     *
     * @param {string} name
     * @param {*} data
     * @memberof IBizGrid
     */
    public colValueChange(name: string, value: string, data: any): void {
        const srfkey = data.srfkey;
        const _data = this.$backupData.find(back => Object.is(back.srfkey, srfkey));
        if (_data && !Object.is(_data[name], value)) {
            Object.assign(this.$state[srfkey][name].styleCss, { 'border': '1px solid #49a9ee', 'border-radius': '4px' });
        } else {
            Object.assign(this.$state[srfkey][name].styleCss, { 'border': '0px', 'border-radius': '0px' });
        }
        data[name] = value;
        this.fire(IBizEvent.IBizDataGrid_UPDATEGRIDITEMCHANGE, { name: name, data: data });
    }

    /**
     * 更新表格编辑列值
     *
     * @param {string} srfufimode
     * @param {*} [data={}]
     * @memberof IBizGrid
     */
    public updateGridEditItems(srfufimode: string, data: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let opt = { srfaction: 'updategridedititem', srfufimode: srfufimode, srfctrlid: 'grid' };
        const _names: Array<any> = Object.keys(data);
        _names.forEach(name => {
            data[name] = data[name] ? data[name] : '';
        });
        Object.assign(opt, { srfactivedata: JSON.stringify(data) });
        this.post(opt).subscribe((success) => {
            if (success.ret === 0) {
                const index: number = this.$items.findIndex(item => Object.is(item.srfkey, data.srfkey));
                if (index !== -1) {
                    Object.assign(this.$items[index], success.data);
                }
            } else {
                this.$iBizNotification.error('错误', success.info);
            }
        }, (error) => {
            this.$iBizNotification.error('错误', error.info);
        });
    }

    /**
     * 新建编辑行
     *
     * @param {*} [param={}]
     * @memberof IBizGrid
     */
    public newRowAjax(param: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let opt: any = {};
        Object.assign(opt, param);
        this.fire(IBizEvent.IBizMDControl_BEFORELOAD, opt);
        Object.assign(opt, { srfaction: 'loaddraft', srfctrlid: 'grid' });
        this.post(opt).subscribe(success => {
            if (success.ret === 0) {
                const srfkey: string = (Object.is(success.data.srfkey, '')) ? IBizUtil.createUUID() : success.data.srfkey;
                success.data.srfkey = srfkey;
                this.setEditItemState(srfkey);
                this.setEditItemDisabled(srfkey, 1);
                this.$items.push(Object.assign(success.data, { openeditrow: false }));
            } else {
                this.$iBizNotification.error('错误', `获取默认数据失败, ${success.info}`);
            }
        }, error => {
            this.$iBizNotification.error('错误', `获取默认数据失败, ${error.info}`);
        });
    }
}

