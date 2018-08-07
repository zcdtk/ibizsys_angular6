import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { IBizEnvironment } from '@env/IBizEnvironment';
import { IBizAppService } from '@ibizsys/IBizAppService';

/**
 * IBizHttp
 * 
 * @export
 * @class HttpProvider
 */
@Injectable()
export class IBizHttp {

    /**
     * 是否加载
     *
     * @type {boolean}
     * @memberof IBizHttp
     */
    public $isLoading: boolean = false;

    /**
     * 当前请求启动的Loading数量
     *
     * @type {number}
     * @memberof IBizHttp
     */
    public $loadingCount: number = 0;

    /**
     * 工程应用路径
     *
     * @private
     * @memberof IBizHttp
     */
    private Base = '..';

    /**
     * Creates an instance of IBizHttp. 
     * 创建 IBizHttp 实例
     * 
     * @param {HttpClient} httpClient
     * @param {ITokenService} tokenService
     * @memberof IBizHttp
     */
    constructor(private httpClient: HttpClient, private ibizappservice: IBizAppService) { }

    /**
     * 全局http post方法，处理loading状态
     *
     * @param {string} url
     * @param {*} [opt={}]
     * @returns {Observable<any>}
     * @memberof IBizHttp
     */
    public post(url: string, opt: any = {}): Observable<any> {
        if (IBizEnvironment.LocalDeve) {
            // const userInfo: any = this.tokenService.get();
            // Object.assign(opt, { srfloginkey: userInfo.token });
        }
        if (this.ibizappservice.getAppData()) {
            Object.assign(opt, { srfappdata: this.ibizappservice.getAppData() });
        }
        let subject = new Subject();
        this.beginLoading();
        let post = this.httpClient.post(this.Base + url, new HttpParams({ 'fromObject': opt }), {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            })
        });
        post.subscribe((data: any) => {
            this.endLoading();
            if (data.notlogin) {
                return;
            }
            if (data.ret === 0) {
                subject.next(data);
            } else {
                subject.error(data);
            }
        }, (error: any) => {
            this.endLoading();
            subject.error(error);
        });
        return subject.asObservable();
    }

    /**
     * 全局http post2方法，不处理loading状态
     *
     * @param {string} url
     * @param {*} [opt={}]
     * @returns {Observable<any>}
     * @memberof IBizHttp
     */
    public post2(url: string, opt: any = {}): Observable<any> {
        if (IBizEnvironment.LocalDeve) {
            // const userInfo: any = this.tokenService.get();
            // Object.assign(opt, { srfloginkey: userInfo.token });
        }
        if (this.ibizappservice.getAppData()) {
            Object.assign(opt, { srfappdata: this.ibizappservice.getAppData() });
        }
        let subject = new Subject();

        let post2 = this.httpClient.post(this.Base + url, new HttpParams({ 'fromObject': opt }), {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            })
        });

        post2.subscribe((data: any) => {
            if (data.notlogin) {
                return;
            }
            if (data.ret === 0) {
                subject.next(data);
            } else {
                subject.error(data);
            }
        }, (error: any) => {
            subject.error(error);
        });

        return subject.asObservable();
    }

    /**
     * 全局HTTP get方法
     *
     * @param {string} url
     * @returns {Observable<any>}
     * @memberof IBizHttp
     */
    public get(url: string): Observable<any> {
        let subject = new Subject();
        this.beginLoading();
        let get = this.httpClient.get(this.Base + url);
        get.subscribe((data: any) => {
            this.endLoading();
            if (data.notlogin) {
                return;
            }
            if (data.ret === 0) {
                subject.next(data);
            } else {
                subject.error(data);
            }
        }, (error: any) => {
            this.endLoading();
            subject.error(error);
        });
        return subject.asObservable();
    }

    /**
     * 开始加载
     *
     * @memberof IBizHttp
     */
    public beginLoading(): void {
        if (this.$loadingCount === 0) {
            setTimeout(() => {
                this.$isLoading = true;
            });
        }
        this.$loadingCount++;
    }

    /**
     * 加载结束
     *
     * @memberof IBizHttp
     */
    public endLoading(): void {
        this.$loadingCount--;
        if (this.$loadingCount === 0) {
            setTimeout(() => {
                this.$isLoading = false;
            });
        }
    }
}
