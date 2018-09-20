import { IBizTab } from './ibiz-tab';

/**
 * 多视图面板服务对象
 * 
 * @export
 * @class IBizViewPanel
 * @extends {IBizTab}
 */
export class IBizViewPanel extends IBizTab {

    /**
     * Creates an instance of IBizViewPanel.
     * 创建 IBizViewPanel 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizViewPanel
     */
    constructor(opts: any = {}) {
        super(opts);
    }
}
