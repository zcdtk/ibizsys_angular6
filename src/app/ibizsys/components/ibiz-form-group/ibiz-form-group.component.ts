import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-ibiz-form-group',
    templateUrl: './ibiz-form-group.component.html',
    styleUrls: ['./ibiz-form-group.component.less'],
})
export class IBizFormGroupComponent implements OnInit {

	/**
	 * 分组内容收缩标识
	 * 
	 * @memberof IBizFormGroupComponent
	 */
    public flex = false;

	/**
	 * 指定部件对象
	 * 
	 * @type {*}
	 * @memberof IBizFormGroupComponent
	 */
    public contentChild: any;

    @Input()
    text: string;
    @Input()
    form: any;
    @Input()
    groupname: string;
    @Input()
    firstChild: string;
    @Input()
    isShowMore: boolean;
    @Input()
    isShowNew: boolean;
    @Input()
    showheader: boolean;

    @Input()
    visible: boolean;

    constructor() { }

    ngOnInit() {
        if (this.form) {
            let groupField = this.form.findField(this.groupname);
            groupField.regEditor(this.groupname, this);
        }
    }

	/**
	 * 分组内容收缩
	 * 
	 * @memberof IBizFormGroupComponent
	 */
    public onFlex(): void {
        this.flex = !this.flex;
    }

	/**
	 * 显示指定部件扩展功能菜单
	 * 
	 * @memberof IBizFormGroupComponent
	 */
    public showMore(): void {
        if (this.form && !this.contentChild) {
            let groupField = this.form.findField(this.groupname);
            this.contentChild = groupField.getEditor(this.firstChild);
        }
    }

	/**
	 * 触发指定部件新建功能
	 * 
	 * @memberof IBizFormGroupComponent
	 */
    public onNewAction(): void {
        this.showMore();
        if (typeof this.contentChild.doNewAction === 'function') {
            this.contentChild.doNewAction();
        }
    }
	/**
	 * 触发指定部件扩展功能
	 * 
	 * @param {*} action 
	 * @memberof IBizFormGroupComponent
	 */
    public onMoreAction(action: any): void {
        if (typeof this.contentChild.doMoreAction === 'function') {
            this.contentChild.doMoreAction(action);
        }
    }
}
