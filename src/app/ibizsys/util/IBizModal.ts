
import { NzModalService } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { IBizControl } from '../widget/IBizControl';


/**
 * 模态框服务对象
 * 
 * @export
 * @class IBizModal
 * @extends {IBizControl}
 */
export class IBizModal extends IBizControl {

    /**
     * 模态框服务对象
     * 
     * @private
     * @type {NzModalService}
     * @memberof IBizModal
     */
    private $modal: NzModalService;

    /**
     * 模态框处理结果数据
     * 
     * @private
     * @type {*}
     * @memberof IBizModal
     */
    private $result: any = {};

    /**
     * Creates an instance of IBizModal.
     * 创建 IBizModal 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizModal
     */
    constructor(opts: any = {}) {
        super(opts);
        this.$modal = opts.modalCtrl;
    }

    /**
     * 打开模态框, 只返回数据变化后的值
     * 
     * @param {*} [options={}] 
     * @returns {Observable<any>} 
     * @memberof IBizModal
     */
    public openModal(options: any = {}): Observable<any> {
        if (!Object.is(this.viewOpenMode(), 'POPUPMODAL')) {
            this.$iBizNotification.warning('警告', '该视图的打开方式请选择模式弹出！');
            return new Subject();
        }
        // let opt = this.getModalParam(options);
        // return this.$modal.open(opt).map(result => {
        //     if (result.ret && Object.is(result.ret, 'OK')) {
        //         this.$result = {};
        //         Object.assign(this.$result, result);
        //     }
        //     if (result && Object.is(result, 'DATACHANGE')) {
        //         return this.$result;
        //     }
        // });
    }

    /**
     * 获取模态框参数
     * 
     * @param {*} [opt={}] 
     * @param {*} [options] 
     * @returns {*} 
     * @memberof IBizModal
     */
    public getModalParam(opt: any = {}, options?: any): any {
        opt.modalZIndex = opt.modalZIndex ? opt.modalZIndex : 300;
        let zIndex = opt.modalZIndex + 100;

        if (Object.is(options.width, 0)) {
            options.width = this.getModalWidth();
        }

        Object.assign(options, {
            componentParams: {
                modalViewParam: opt.viewParam ? opt.viewParam : {},
                modalZIndex: zIndex,
            },
            zIndex: zIndex
        });
        return options;
    }

    /**
     * 获取窗口对象宽度，默认600
     * 
     * @returns {number} 
     * @memberof IBizModal
     */
    public getModalWidth(): number {
        if (window && window.innerWidth > 200) {
            if (window.innerWidth > 200) {
                return window.innerWidth - 200;
            } else {
                return window.innerWidth;
            }
        }
        return 600;
    }

    /**
     * 视图打开模式
     * 
     * @returns {string} 
     * @memberof IBizModal
     */
    public viewOpenMode(): string {
        return undefined;
    }
}

