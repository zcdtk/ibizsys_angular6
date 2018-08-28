import { Observable, Subject } from 'rxjs';
import { IBizApp } from './service/IBizApp';
import { IBizHttp } from './service/IBizHttp';
import { IBizNotification } from './service/IBizNotification';


/**
 * IbizSys控制器借口对象
 * 
 * @export
 * @abstract
 * @class IBizObject
 */
export abstract class IBizObject {

    /**
     * 对象事件集合
     *
     * @private
     * @type {Map<string, any>}
     * @memberof IBizObject
     */
    private $events: Map<string, any> = new Map();

    /**
     * app服务对象
     *
     * @type {IBizApp}
     * @memberof IBizObject
     */
    public $iBizApp: IBizApp;

    /**
     * app http 服 对象 
     *
     * @type {IBizHttp}
     * @memberof IBizObject
     */
    public $iBizHttp: IBizHttp;

    /**
     * app 信息提示消息
     *
     * @type {IBizNotification}
     * @memberof IBizObject
     */
    public $iBizNotification: IBizNotification;

    /**
     * Creates an instance of IBizObject.
     * 创建 IBizObject 实例 
     * 
     * @param {*} [opts={}]
     * @memberof IBizObject
     */
    constructor(opts: any = {}) {
        this.$iBizApp = opts.iBizApp;
        this.$iBizHttp = opts.iBizHttp;
        this.$iBizNotification = opts.iBizNotification;
    }

    /**
     * 注册Rx订阅事件
     *
     * @param {string} eventName
     * @returns {Observable<any>}
     * @memberof IBizObject
     */
    public on(eventName: string): Observable<any> {
        let subject: Subject<any>;
        if (eventName && !Object.is(eventName, '')) {
            if (!this.$events.get(eventName)) {
                subject = new Subject();
                this.$events.set(eventName, subject);
            } else {
                subject = this.$events.get(eventName);
            }
            return subject.asObservable();
        }
    }

    /**
     * Rx事件流触发
     *
     * @param {string} eventName
     * @param {*} data
     * @memberof IBizObject
     */
    public fire(eventName: string, data: any): void {
        const subject: Subject<any> = this.$events.get(eventName);
        if (subject) {
            subject.next(data);
        }
    }
}

