import { Component, Input } from '@angular/core';

import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-password',
    templateUrl: './ibiz-password.component.html'
})
export class IBizPasswordComponent extends IBizComponent {

    public textType = false;

    public timeOut: any;

    constructor() {
        super();
    }

    /**
     * 切换图片
     * 
     * @memberof IBizPasswordComponent
     */
    changeType(): void {
        this.textType = !this.textType;
    }

    /**
     * 数据发生改变，触发表单项更新
     * 
     * @param {any} newVal 
     * @returns {void} 
     * @memberof IBizPasswordComponent
     */
    valueChange(newVal): void {
        if (this.form) {
            if (this.timeOut) {
                clearTimeout(this.timeOut);
                this.timeOut = undefined;
            }
            this.timeOut = setTimeout(() => {
                if (this.name && !Object.is(this.name, '')) {
                    let itemField = this.form.findField(this.name);
                    if (itemField) {
                        itemField.setValue(newVal);
                    }
                }
            }, 300);
        }
    }

}
