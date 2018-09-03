import { IBizMainViewController } from './IBizMainViewController';
import { IBizEvent } from '../IBizEvent';

/**
 * Portal视图控制器
 * 
 * @export
 * @class IBizPortalViewController
 * @extends {IBizMainViewController}
 */
export class IBizPortalViewController extends IBizMainViewController {

    /**
     * 门户部件
     *
     * @type {Map<String, any>}
     * @memberof IBizPortalViewController
     */
    public $portalCtrls: Map<String, any> = new Map();

    /**
     * Creates an instance of IBizPortalViewController.
     * 创建 IBizPortalViewController 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizPortalViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    /**
     * 初始化视图
     * 
     * @memberof IBizPortalViewController
     */
    public onInit(): void {
        this.regPortalCtrls();
        super.onInit();
    }

    /**
     * 部件初始化
     * 
     * @memberof IBizPortalViewController
     */
    public onInitComponents(): void {
        super.onInitComponents();

        for (const key in this.$portalCtrls) {
            if (this.$portalCtrls.has(key)) {
                const portalCtrl: any = Object.getOwnPropertyDescriptor(this.$portalCtrls, key).value;
                // portalCtrl.on(IBizStaticVariables.LOADED, (data) => {
                //     this.portalCtrlLoaded(data);
                // });
                portalCtrl.on(IBizEvent.IBizAppMenu_MENUSELECTION, (data) => {
                    this.onMenuSelection(data);
                });
            }
        }
    }

    /**
     * 视图加载
     *
     * @memberof IBizPortalViewController
     */
    public onLoad(): void {
        super.onLoad();
        this.$portalCtrls.forEach((key) => {
            const portalCtrl = this.$portalCtrls.get(key);
            if (typeof portalCtrl.load !== 'undefined' && portalCtrl.load instanceof Function) {
                portalCtrl.load(this.$viewParam);
            }
        });
    }

    /**
     * 部件加载完成
     * 
     * @param {Array<any>} data 
     * @memberof IBizPortalViewController
     */
    public portalCtrlLoaded(data: Array<any>): void {

    }

    /**
     * 注册所有Portal部件
     *
     * @memberof IBizPortalViewController
     */
    public regPortalCtrls(): void {

    }

    /**
     * 菜单选中跳转路由
     * 
     * @param {*} data 
     * @memberof IBizPortalViewController
     */
    public onMenuSelection(data: any) {
        if (data && data.link) {
            if (this.$activatedRoute['_routerState']) {
                const url = this.$activatedRoute['_routerState'].snapshot.url;
                this.$router.navigate([url + '/' + data.link, {}]);
            }
        }
    }

}


