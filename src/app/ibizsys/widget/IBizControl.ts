import { Observable, Subject } from 'rxjs';
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
     * 部件http请求状态
     *
     * @type {boolean}
     * @memberof IBizControl
     */
    public $isLoading: boolean = false;

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
        if (this.$url) {
            url = this.$url;
        }
        if (this.getViewController()) {
            if (!url) {
                url = this.getViewController().getBackendUrl();
            }
        }
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
        const subject = new Subject();
        this.beginLoading();

        const post = this.$iBizHttp.post(_url, param);
        post.subscribe((success) => {
            this.endLoading();
            subject.next(success);
        }, (error) => {
            this.endLoading();
            subject.error(error);
        });
        return subject.asObservable();
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

    /** 
     * 部件http请求
     *
     * @private
     * @memberof IBizControl
     */
    private beginLoading(): void {
        this.$isLoading = true;
    }

    /**
     * 部件结束http请求
     *
     * @private
     * @memberof IBizControl
     */
    private endLoading(): void {
        this.$isLoading = false;
    }
}
