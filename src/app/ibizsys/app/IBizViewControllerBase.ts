import { Observable, Subject } from 'rxjs';
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
     * @private
     * @type {NzModalService}
     * @memberof IBizViewControllerBase
     */
    private nzModalService: NzModalService;

    /**
     * 监控模态框服务对象，回调使用
     *
     * @private
     * @type {NzModalRef}
     * @memberof IBizViewControllerBase
     */
    private nzModalRef: NzModalRef;

    /**
     * 模态视图被订阅观察对象
     *
     * @private
     * @type {Subject<any>}
     * @memberof IBizViewControllerBase
     */
    private modalSubject: Subject<any>;

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
        this.modalSubject = new Subject();
    }

    /**
     * 模态视图数据状态，配合nzModal使用
     *
     * @protected
     * @returns {Observable<any>}
     * @memberof IBizViewControllerBase
     */
    protected modalViewDataState(): Observable<any> {
        if (!this.isModal()) {
            return this.modalSubject;
        }
        return this.modalSubject.asObservable();
    }

    /**
     * 模态视图数据变化，配合nzModal使用
     *
     * @param {*} data
     * @memberof IBizViewControllerBase
     */
    protected modalViewDataChange(data: any): void {
        this.modalSubject.next(data);
    }

    /**
     * 是否是模态视图
     *
     * @returns {boolean}
     * @memberof IBizViewControllerBase
     */
    public isModal(): boolean {
        return false;
    }

    /**
     * 关闭模态框视图
     *
     * @param {string} state
     * @memberof IBizViewControllerBase
     */
    public closeModal(state: string): void {
        this.nzModalRef.destroy(state);
    }

    /**
     * 获取模态框服务对象
     *
     * @returns {NzModalService}
     * @memberof IBizViewControllerBase
     */
    public getModalService(): NzModalService {
        return this.nzModalService;
    }

    /**
     * 获取模态框操作对象
     *
     * @returns {NzModalRef}
     * @memberof IBizViewControllerBase
     */
    public getModalRef(): NzModalRef {
        return this.nzModalRef;
    }
}

