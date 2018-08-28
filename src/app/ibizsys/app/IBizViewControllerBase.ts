
import { NzModalService, NzModalRef } from 'ng-zorro-antd';
import { IBizObject } from '../IBizObject';

/**
 * 根视图控制器基类，处理ng-zorro-antd组件模态框对象
 * 
 * @export
 * @class IBizViewControllerBase
 * @extends {IBizObject}
 */
export class IBizViewControllerBase extends IBizObject {

    /**
     * 打开模态框服务对象
     * 
     * @type {NzModalService}
     * @memberof IBizViewControllerBase
     */
    public nzModalService: NzModalService;

    /**
     * 监控模态框服务对象，回调使用
     * 
     * @type {NzModalRef}
     * @memberof IBizViewControllerBase
     */
    public nzModalRef: NzModalRef;

    /**
     * Creates an instance of IBizViewControllerBase.
     * 创建 IBizViewControllerBase 实例 
     * 
     * @param {*} [opts={}] 
     * @memberof IBizViewControllerBase
     */
    constructor(opts: any = {}) {
        super(opts);
        this.nzModalService = opts.nzModalService;
        this.nzModalRef = opts.nzModalRef;
    }
}

