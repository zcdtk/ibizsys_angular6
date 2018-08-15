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
    private _user: any = {};

    /**
     * 布局信息
     *
     * @private
     * @type {*}
     * @memberof SettingService
     */
    private _layout: any = {};

    /**
     * 获取用户信息
     *
     * @memberof SettingService
     */
    get user() {
        return this._user;
    }

    /**
     * 设置用户信息
     *
     * @memberof SettingService
     */
    set user(data) {
        Object.assign(this._user, data);
    }

    /**
     * 获取布局信息
     *
     * @readonly
     * @memberof SettingService
     */
    get layout() {
        return this._layout;
    }

    /**
     * 设置布局
     *
     * @memberof SettingService
     */
    set layout(obj) {
        if (!obj.name || Object.is(obj.name, '')) {
            return;
        }
        this._layout[obj.name] = obj.value;
    }

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
}
