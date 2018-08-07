import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { IBizEnvironment } from '@env/IBizEnvironment';
import { IBizAppService } from '@ibizsys/IBizAppService';

/**
 * 根节点路由守卫
 * 
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    /**
     * Creates an instance of AuthGuard.
     * 创建 AuthGuard 实例
     * @param {HttpClient} httpClient
     * @param {ITokenService} tokenService
     * @memberof AuthGuard
     */
    constructor(private httpClient: HttpClient, private ibizappservice: IBizAppService) { }

    /**
     * 根据主题UI 服务对象判断是否登录
     * 
     * @param {ActivatedRouteSnapshot} route 
     * @param {RouterStateSnapshot} state 
     * @returns {boolean} 
     * @memberof AuthGuard
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | Observable<boolean> | boolean {
        return new Observable<boolean>(observer => {
            this.post(route, observer);
        });
    }

    /**
     * 子路由守卫
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {boolean}
     * @memberof AuthGuard
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | Observable<boolean> | boolean {
        return true;
    }

    /**
     * 
     *
     * @private
     * @param {ActivatedRouteSnapshot} route
     * @param {Subscriber<boolean>} observer
     * @memberof AuthGuard
     */
    private post(route: ActivatedRouteSnapshot, observer: Subscriber<boolean>): void {
        let url: string = '';
        if (route.data && route.data.hasOwnProperty('backendurl')) {
            url = route.data.backendurl;
        } else {
            observer.next(true);
        }

        let opt: any = { srfaction: 'loadappdata' };
        if (route.params && Object.keys(route.params).length > 0) {
            Object.assign(opt, route.params);
        }
        if (IBizEnvironment.LocalDeve) {
            // const userInfo: any = this.tokenService.get();
            // Object.assign(opt, { srfloginkey: userInfo.token });
        }
        let post = this.httpClient.post('..' + url, new HttpParams({ 'fromObject': opt }), {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            })
        });
        post.subscribe((data: any) => {
            if (data && data.ret === 0) {
                if (data.remotetag) {
                    this.ibizappservice.setAppData(data.remotetag);
                }
            }
            observer.next(true);
        }, () => {
            observer.next(true);
        });
    }
}