import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { IBizEnvironment } from '@env/IBizEnvironment';
import { SettingService } from './setting.service';
import { IBizApp } from './ibiz-app';


/**
 * IBizHttp
 * 
 * @export
 * @class HttpProvider
 */
@Injectable()
export class IBizHttp {

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
    constructor(private httpClient: HttpClient, private iBizApp: IBizApp, private setting: SettingService) { }

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
            const token: any = this.setting.getToken();
            Object.assign(opt, token ? { srfloginkey: token.token } : {});
        }
        if (this.iBizApp.getAppData()) {
            Object.assign(opt, { srfappdata: this.iBizApp.getAppData() });
        }
        const subject = new Subject();
        const post = this.httpClient.post(this.Base + url, new HttpParams({ 'fromObject': opt }), {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            })
        });
        post.subscribe((data: any) => {
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
     * 全局http post2方法，不处理loading状态
     *
     * @param {string} url
     * @param {*} [opt={}]
     * @returns {Observable<any>}
     * @memberof IBizHttp
     */
    public post2(url: string, opt: any = {}): Observable<any> {
        if (IBizEnvironment.LocalDeve) {
            const token: any = this.setting.getToken();
            Object.assign(opt, token ? { srfloginkey: token.token } : {});
        }
        if (this.iBizApp.getAppData()) {
            Object.assign(opt, { srfappdata: this.iBizApp.getAppData() });
        }
        const subject = new Subject();

        const post2 = this.httpClient.post(this.Base + url, new HttpParams({ 'fromObject': opt }), {
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
        const subject = new Subject();
        const get = this.httpClient.get(this.Base + url);
        get.subscribe((data: any) => {
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
}
