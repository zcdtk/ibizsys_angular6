import { NzModalService, NzModalRef } from 'ng-zorro-antd';
import { IBizObject } from '../IBizObject';

/**
 * 部件服务对象基类，处理ng-zorro-antd组件模态框对象
 * 
 * @export
 * @class IBizControlBase
 * @extends {IBizObject}
 */
export class IBizControlBase extends IBizObject {

    /**
     * 打开模态框服务对象
     * 
     * @type {NzModalService}
     * @memberof IBizControlBase
     */
    public nzModalService: NzModalService;

    /**
     * 监控模态框服务对象，回调使用
     * 
     * @type {NzModalRef}
     * @memberof IBizControlBase
     */
    public nzModalRef: NzModalRef;

    /**
     * Creates an instance of IBizControlBase.
     * 创建 IBizControlBase 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizControlBase
     */
    constructor(opts: any = {}) {
        super(opts);
        this.nzModalService = opts.nzModalService;
        this.nzModalRef = opts.nzModalRef;
    }
}

