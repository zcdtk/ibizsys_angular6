import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse,
    HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
// import { _HttpClient } from '@delon/theme';
import { IBizEnvironment } from '@env/IBizEnvironment';
import { NzModalService } from 'ng-zorro-antd';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private nzModalService: NzModalService) { }

    /**
     * 设置登录
     * 
     * @private
     * @memberof DefaultInterceptor
     */
    private goLogin() {
        const router = this.injector.get(Router);

        this.nzModalService.closeAll();
        const curUrl = decodeURIComponent(window.location.href);
        if (IBizEnvironment.UacAuth) {
            if (window.location.href.indexOf('/uacclient/uaclogin.do') === -1) {
                window.location.href = `../uacclient/uaclogin.do?RU=${curUrl}`;
            }
        } else if (!IBizEnvironment.LocalDeve) {
            if (window.location.href.indexOf('/ibizutil/login.html') === -1) {
                window.location.href = `..${IBizEnvironment.LoginRedirect}?RU=${curUrl}`;
            }
        } else {
            if (router.url && router.url.indexOf('/passport/login') === -1) {
                this.injector.get(Router).navigate(['/passport/login', { callback: curUrl.substr(window.location.origin.length + 2) }]);
            }
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        // 统一加上服务端前缀
        let url = req.url;
        // if (!url.startsWith('https://') && !url.startsWith('http://')) {
        //     url = environment.SERVER_URL + url;
        // }

        const newReq = req.clone({
            url: url
        });
        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
                if (event instanceof HttpResponse && event.status === 200) {
                    return this.handleData(event);
                }

                // 若一切都正常，则后续操作
                return of(event);
            }),
            catchError((err: HttpErrorResponse) => this.handleData(err))
        );
    }


    private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
        // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
        // this.injector.get(he).end();
        // 过滤部分请求
        const url: string = event.url;
        if (url.indexOf(IBizEnvironment.AppLogin) !== -1) {
            return of(event);
        }
        // 业务处理：一些通用操作
        switch (event.status) {
            case 200:
                const body: any = event instanceof HttpResponse && event.body;
                if (body && body.ret === 2 && body.notlogin) {
                    this.goLogin();
                }
                break;
            case 401: // 未登录状态码
                // this.goLogin();
                break;
            case 403:
            case 404:
            case 500:
                // this.goLogin();
                break;
        }
        return of(event);
    }

}
