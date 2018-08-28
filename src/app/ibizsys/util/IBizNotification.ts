import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

/**
 * 消息提示工具类
 * 参考地址： https://ng-zorro.github.io/#/components/notification
 * 
 * @export
 * @class IBizNotification
 */
@Injectable()
export class IBizNotification {

    /**
     * Creates an instance of IBizNotification.
     * 创建 IBizNotification 实例
     * 
     * @param {NzNotificationService} nznotification
     * @param {NzModalService} Modal
     * @memberof IBizNotification
     */
    constructor(private nznotification: NzNotificationService, private Modal: NzModalService) { }

    /**
     * 不带图标的提示
     * 
     * @param {string} title 标题
     * @param {string} content 内容
     * @param {Object} [options]  其他参数
     * @memberof IBizNotification
     */
    public blank(title: string, content: string, options?: Object) {
        this.nznotification.blank(title, content, options);
    }

    /**
     * 成功提示
     * 
     * @param {string} title 标题
     * @param {string} content 内容
     * @param {Object} [options]  其他参数
     * @memberof IBizNotification
     */
    public success(title: string, content: string, options?: Object) {
        this.nznotification.success(title, content, options);
    }

    /**
     * 失败提示
     * 
     * @param {string} title 标题
     * @param {string} content 内容
     * @param {Object} [options]  其他参数
     * @memberof IBizNotification
     */
    public error(title: string, content: string, options?: Object) {
        this.nznotification.error(title, content, options);
    }

    /**
     * 警告提示
     * 
     * @param {string} title 标题
     * @param {string} content 内容
     * @param {Object} [options]  其他参数
     * @memberof IBizNotification
     */
    public warning(title: string, content: string, options?: Object) {
        this.nznotification.warning(title, content, options);
    }

    /**
     * 信息提示
     * 
     * @param {string} title 标题
     * @param {string} content 内容
     * @param {Object} [options]  其他参数
     * @memberof IBizNotification
     */
    public info(title: string, content: string, options?: Object) {
        this.nznotification.info(title, content, options);
    }

    /**
     * 移除特定id的消息，当id为空时，移除所有消息
     * 
     * @param {string} [id] ID
     * @memberof IBizNotification
     */
    public remove(id?: string) {
        this.nznotification.remove(id);
    }

    /**
     * 信息确认框
     * 
     * @param {string} title 
     * @param {string} content 
     * @returns 
     * @memberof IBizNotification
     */
    public confirm(title: string, content: string): Observable<any> {
        const subject: Subject<any> = new Subject();
        this.Modal.confirm({
            nzTitle: title,
            nzContent: content,
            nzOnOk: () => {
                subject.next('OK');
            }
        });
        return subject.asObservable();
    }
}
