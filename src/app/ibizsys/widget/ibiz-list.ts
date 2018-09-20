import { IBizEvent } from './../ibiz-event';
import { IBizMDControl } from './ibiz-mdcontrol';

/**
 * 列表部件控制器服务对象
 * 
 * @export
 * @class IBizList
 * @extends {IBizMDControl}
 */
export class IBizList extends IBizMDControl {

    /**
     * 
     * 
     * @memberof IBizList
     */
    public $isOpenMultiselect = true;

    /**
     * 
     * 
     * @memberof IBizList
     */
    public $isCheckedAll = false;

    /**
     * 
     * 
     * @type {any[]}
     * @memberof IBizList
     */
    public $listSelectedDatas: any[] = [];

    /**
     * Creates an instance of IBizList.
     * 创建 IBizList 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizList
     */
    constructor(opts: any = {}) {
        super(opts);
    }


    /**
     * 数据加载
     * 
     * @param {*} [arg={}] 
     * @returns {void} 
     * @memberof IBizList
     */
    public load(arg: any = {}): void {
        // tslint:disable-next-line:prefer-const
        let opt: any = {};
        Object.assign(opt, arg);
        if (this.$isLoading) {
            return;
        }
        Object.assign(opt, { 'srfctrlid': this.getName(), 'srfaction': 'fetch' });

        // 发送加载数据前事件
        this.fire(IBizEvent.IBizMDControl_BEFORELOAD, opt);
        // this.mask();
        // this.fillPostParams(opt);
        this.$iBizHttp.post(this.getBackendUrl(), opt)
            .subscribe(
                response => {
                    // this.unmask();
                    if (!response.items || response.ret !== 0) {
                        if (response.errorMessage) {
                            this.$iBizNotification.error('', response.errorMessage);
                        }
                        // this.ignoreUFI = false;
                        // this.ignoreformfieldchange = false;
                        return;
                    }
                    //                if (Object.is(this.$start, 0)) {
                    this.$items = response.items;
                    //                } else {
                    //                    this.$items.push(...response.items);
                    //                }
                    this.fire(IBizEvent.IBizMDControl_LOADED, response.items);
                },
                error => {
                    // this.unmask();
                    // this.showToast(this.$showErrorToast, '', '数据加载失败,请检查网络连接或投诉');
                    console.log(error.info);
                }
            );
    }


    /**
     * 判断全选按钮是否勾选
     * 
     * @memberof IBizList
     */
    public isCheckedAllChange(): void {
        if (this.$listSelectedDatas.length === this.$items.length) {
            this.$isCheckedAll = true;
        } else {
            this.$isCheckedAll = false;
        }
    }
    /**
     * 列表多选是否开启改变
     * 
     * @memberof IBizList
     */
    public isOpenMultiselectChange(): void {
        this.$isOpenMultiselect = !this.$isOpenMultiselect;
    }
    /**
     * 全选触发事件
     * 
     * @memberof IBizList
     */
    public checkChangeAll(): void {
        this.$items.forEach((item) => {
            item.checked = this.$isCheckedAll;
        });
        this.$listSelectedDatas = [...this.$items];
        this.isCheckedAllChange();
    }
    /**
     * 列表反选
     * 
     * @memberof IBizList
     */
    public listReverseSelection(): void {
        this.$listSelectedDatas = [];
        this.$items.forEach((item) => {
            if (item.checked) {
                item.checked = false;
            } else {
                item.checked = true;
                this.$listSelectedDatas.push(item);
            }
        });
        this.isCheckedAllChange();
    }
    /**
     * 列表选中触发事件
     * 
     * @memberof IBizList
     */
    public selectedChange(item: any): void {
        if (item.checked) {
            this.$listSelectedDatas.push(item);
        } else {
            this.$listSelectedDatas.forEach((element, index) => {
                if (Object.is(element.srfkey, item.srfkey)) {
                    this.$listSelectedDatas.splice(index, 1);
                }
            });
        }
        this.isCheckedAllChange();
    }
    /**
     * 删除单条数据
     * 
     * @param {*} item 
     * @memberof IBizList
     */
    public doRemove(item: any): void {
        if (item) {
            // this.confirm('删除', '确认删除该条数据吗?', () => {
            //     let arg: any = {};
            //     arg.item = item;
            //     arg.isRemove = 0;
            //     this.fire(this.$staticVariables.BEFORREMOVE, arg);
            //     if(Object.is(arg.isRemove, 1)) {
            //         return;
            //     }
            //     super.remove({ 'srfkeys': item.srfkey});
            // });
        }
    }
    /**
     * 删除所选数据
     * 
     * @memberof IBizList
     */
    public doRemoveAll(): void {
        if (this.$listSelectedDatas.length > 0) {
            // this.confirm('删除', '确认删除已选择的数据吗?', () => {
            //     let arg: any = {};
            //     arg.selectedDatas = this.$listSelectedDatas;
            //     arg.isRemove = 0;
            //     this.fire(this.$staticVariables.BEFORREMOVE, arg);
            //     if(Object.is(arg.isRemove, 1)) {
            //         return;
            //     }
            //     let keys: string = '';
            //     this.$listSelectedDatas.forEach((element) => {
            //         let key = element.srfkey;
            //         if(!Object.is(keys, '')){
            //             keys += ';';
            //         }
            //         keys += key;
            //     });
            //     super.remove({ 'srfkeys': keys});
            // });
        } else {
            // this.showToast('请先选中数据');
        }
    }
    /**
     * 获取已选择的数据
     * 
     * @returns {*} 
     * @memberof IBizList
     */
    public getSelection(): any {
        return this.$listSelectedDatas;
    }
}

