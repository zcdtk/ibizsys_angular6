import { Observable } from 'rxjs';
import { IBizControlBase } from './IBizControlBase';


/**
 * 部件服务对象
 * 
 * @export
 * @class IBizControl
 * @extends {IBizControlBase}
 */
export class IBizControl extends IBizControlBase {

    /**
     * 部件名称
     * 
     * @private
     * @type {string}
     * @memberof IBizControl
     */
    private $name: string;

    /**
     * 后台交互URL
     * 
     * @private
     * @type {string}
     * @memberof IBizControl
     */
    private $url: string;

    /**
     * 视图控制器对象
     * 
     * @private
     * @type {*}
     * @memberof IBizControl
     */
    private $viewController: any;

    /**
     * Creates an instance of IBizControl.
     * 创建 IBizControl 实例。 
     * 
     * @param {*} [opts={}] 
     * @memberof IBizControl
     */
    constructor(opts: any = {}) {
        super(opts);
        this.$name = opts.name;
        this.$url = opts.url;
        this.$iBizNotification = opts.iBizNotification;
        this.$viewController = opts.viewController;
        if (this.$viewController) {
            this.$iBizHttp = this.$viewController.$iBizHttp;
        }
    }

    /**
     * 获取部件名称
     * 
     * @returns {String}
     * @memberof IBizControl
     */
    public getName(): string {
        return this.$name;
    }

    /**
     * 获取后台路径
     * 
     * @returns {*} 
     * @memberof IBizControl
     */
    public getBackendUrl(): string {
        let url: string = '';
        let dynamicParams: any = {};
        if (this.$url) {
            url = this.$url;
        }
        if (this.getViewController()) {
            if (!url) {
                url = this.getViewController().getBackendUrl();
            }

            // 动态视图参数
            dynamicParams = this.getViewController().getDynamicParams();
            if (dynamicParams && Object.keys(dynamicParams).length > 0) {
                url = this.addOptionsForUrl(url, dynamicParams);
            }
        }
        return url;
    }

    /**
     * 添加参数到指定的url中
     *
     * @param {string} url 路径
     * @param {*} [opt={}] 参数
     * @returns {string}
     * @memberof IBizDynamicService
     */
    public addOptionsForUrl(url: string, opt: any = {}): string {
        const keys: string[] = Object.keys(opt);
        const isOpt: number = url.indexOf('?');
        keys.forEach((key, index) => {
            if (index === 0 && isOpt === -1) {
                url += `?${key}=${opt[key]}`;
            } else {
                url += `&${key}=${opt[key]}`;
            }
        }
        );
        return url;
    }

    /**
     * 获取视图控制器
     * 
     * @returns {*} 
     * @memberof IBizControl
     */
    public getViewController(): any {
        if (this.$viewController) {
            return this.$viewController;
        }
        return undefined;
    }

    /**
     * 有loading动画的post请求
     * 
     * @param {*} param 请求携带的参数
     * @param {string} [url] 请求地址.(ps：不填写时采用视图默认url)
     * @returns {Observable<any>} 
     * @memberof IBizControl
     */
    public post(param: any, url?: string): Observable<any> {
        let _url: string;
        if (url) {
            _url = url;
        } else {
            _url = this.getBackendUrl();
        }
        return this.$iBizHttp.post(_url, param);
    }

    /**
     * 无loading动画的post请求
     * 
     * @param {*} param 请求携带的参数
     * @param {string} [url] 请求地址.(ps：不填写时采用视图默认url)
     * @returns {Observable<any>} 
     * @memberof IBizControl
     */
    public post2(param: any, url?: string): Observable<any> {
        let _url: string;
        if (url) {
            _url = url;
        } else {
            _url = this.getBackendUrl();
        }
        return this.$iBizHttp.post2(_url, param);
    }
}
