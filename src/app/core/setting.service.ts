import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingService {

    /**
     * 用户信息
     *
     * @private
     * @type {*}
     * @memberof SettingService
     */
    private _user: string = 'USER';

    /**
     * 布局信息
     *
     * @private
     * @type {*}
     * @memberof SettingService
     */
    private _layout: string = 'LAYOUT';

    /**
     * token信息
     *
     * @private
     * @type {string}
     * @memberof SettingService
     */
    private _token: string = 'TOKEN';

    /**
     * 
     *
     * @private
     * @type {Subject<any>}
     * @memberof SettingService
     */
    private subject: Subject<any> = new Subject();

    /**
     * 
     *
     * @private
     * @type {Subject<any>}
     * @memberof SettingService
     */
    private userSubject: Subject<any>;

    /**
     * 
     *
     * @private
     * @type {Subject<any>}
     * @memberof SettingService
     */
    private layoutSubject: Subject<any>;

    /**
     * 
     *
     * @private
     * @type {Subject<any>}
     * @memberof SettingService
     */
    private menuSubject: Subject<any>;

    constructor() {
        this.userSubject = new Subject();
        this.layoutSubject = new Subject();
        this.menuSubject = new Subject();
    }

    /**
     * 设置值变化
     *
     * @returns {Observable<any>}
     * @memberof SettingService
     */
    public settingChange(): Observable<any> {
        return this.subject.asObservable();
    }

    /**
     * 
     *
     * @returns {Observable<any>}
     * @memberof SettingService
     */
    public menuCollapsed(): Observable<any> {
        return this.menuSubject.asObservable();
    }

    /**
     * 
     *
     * @param {boolean} state
     * @memberof SettingService
     */
    public collapsed(state: boolean): void {
        this.menuSubject.next(state);
    }

    /**
     * 获取缓存信息
     *
     * @private
     * @param {string} key
     * @returns {*}
     * @memberof SettingService
     */
    private get(key: string): any {
        return JSON.parse(localStorage.getItem(key) || 'null') || null;
    }

    /**
     * 设置信息
     *
     * @private
     * @param {string} key
     * @param {*} value
     * @memberof SettingService
     */
    private set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public setToken(token: any = {}): void {
        this.set(this._token, token);
    }

    public getToken(): any {
        return this.get(this._token);
    }

    public setUser(user: any = {}): void {
        this.set(this._user, user);
    }

    public getUser(): any {
        return this.get(this._user);
    }

    public setLayout(layout: any = {}): void {
        this.set(this._layout, layout);
    }

    public getLayout(): any {
        return this.get(this._layout);
    }
}
