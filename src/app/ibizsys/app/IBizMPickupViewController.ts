import { IBizMainViewController } from './IBizMainViewController';
import { IBizMPickupResult } from '../widget/IBizMPickupResult';
import { IBizEvent } from '../IBizEvent';

/**
 * 多项数据选择视图控制器
 * 
 * @export
 * @class IBizMPickupViewController
 * @extends {IBizMainViewController}
 */
export class IBizMPickupViewController extends IBizMainViewController {

    /**
     * 按钮文本--确定
     *
     * @type {string}
     * @memberof IBizMPickupViewController
     */
    public $okBtnText: string = '确定';

    /**
     * 按钮文本--取消
     *
     * @type {string}
     * @memberof IBizMPickupViewController
     */
    public $cancelBtnText: string = '取消';

    /**
     * 多项选择数据集服务对象
     * 
     * @type {IBizMPickupResult}
     * @memberof IBizMPickupViewController
     */
    public MPickupResult: IBizMPickupResult;

    /**
     * Creates an instance of IBizMPickupViewController.
     * 创建 IBizMPickupViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizMPickupViewController
     */
    constructor(opts: any = {}) {
        super(opts);

        this.MPickupResult = new IBizMPickupResult({
            name: 'mpickupresult',
            viewController: this,
            url: this.getBackendUrl(),
            iBizNotification: this.$iBizNotification,
        });
        this.$controls.set('mpickupresult', this.MPickupResult);
    }

    /**
     * 视图部件初始化
     *
     * @memberof IBizMPickupViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();
        const pickupViewPanel = this.getPickupViewPanel();
        if (pickupViewPanel && this.MPickupResult) {
            // 选择视图面板数据选中
            pickupViewPanel.on(IBizEvent.IBizPickupViewPanel_SELECTIONCHANGE).subscribe((args) => {
                this.MPickupResult.setCurSelections(args);
            });
            // 选择视图面板数据激活
            pickupViewPanel.on(IBizEvent.IBizPickupViewPanel_DATAACTIVATED).subscribe((args) => {
                this.MPickupResult.appendDatas(args);
            });
            // 选择视图面板所有数据
            pickupViewPanel.on(IBizEvent.IBizPickupViewPanel_ALLDATA).subscribe((args) => {
                this.MPickupResult.setAllData(args);
            });
        }
    }

    /**
     * 处理视图参数
     * 
     * @memberof IBizMPickupViewController
     */
    public onInit(): void {
        super.onInit();
        if (this.getViewParam() && Array.isArray(this.getViewParam().selectedData)) {
            if (this.MPickupResult) {
                this.MPickupResult.appendDatas(this.getViewParam().selectedData);
            }
        }
    }

    /**
     * 数据选择，确定功能
     * 
     * @memberof IBizPickupViewController
     */
    public onClickOkButton(): void {

        if (this.MPickupResult.$selections.length === 0) {
            return;
        }
        this.modalViewDataChange({ ret: 'DATACHANGE', data: this.MPickupResult.$selections });
        this.closeWindow();
    }


    /**
     * 关闭显示选择视图
     * 
     * @param {*} type 
     * @memberof IBizMPickupViewController
     */
    public onClickCancelButton(type: any): void {
        this.closeModal('');
    }

    /**
     * 获取选中视图面板
     *
     * @returns {*}
     * @memberof IBizMPickupViewController
     */
    public getPickupViewPanel(): any {
        return this.$controls.get('pickupviewpanel');
    }
}

