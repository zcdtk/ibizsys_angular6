import { IBizControl } from './IBizControl';

/**
 * 
 *
 * @export
 * @class IBizDynamicControl
 * @extends {IBizControl}
 */
export class IBizDynamicControl extends IBizControl {
    private urlOpt: any = {};

    constructor(opt) {
        super(opt);
    }

    /**
     * 加载模型数据
     *
     * @param {*} [opt={}]
     * @returns {Promise<any>}
     * @memberof IBizDynamicControl
     */
    public load(opt: any = {}): Promise<any> {
        return new Promise((resolve, rejcect) => {
            Object.assign(opt, {'srfaction': 'loadmodel'});
            this.post2(opt).subscribe(
                res => {
                    if (res && res.ret === 0) {
                        resolve(res);
                    } else {
                        rejcect(res);
                    }
                },
                err => {
                    rejcect(err);
                }
            );
        });
    }

    /**
     * 设置在请求时url中添加的参数
     *
     * @memberof IBizDynamicControl
     */
    public setUrlOpt(opt: any): void {
        this.urlOpt = opt;
    }
}
