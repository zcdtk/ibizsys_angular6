import { UploadFile } from 'ng-zorro-antd';
import { Component, Input } from '@angular/core';

import { IBizComponent } from '../ibiz-component';
import { IBizEnvironment } from '@env/IBizEnvironment';

@Component({
    selector: 'app-ibiz-file-upload',
    templateUrl: './ibiz-file-upload.component.html',
    styleUrls: ['./ibiz-file-upload.component.less']
})
export class IBizFileUploadComponent extends IBizComponent {

    /**
     * 文件上传参数
     *
     * @type {*}
     * @memberof IBizFileUploadComponent
     */
    @Input() params: any;

    /**
     * 分组名称
     *
     * @type {string}
     * @memberof IBizFileUploadComponent
     */
    @Input() groupname: string;

    /**
     * 上传文件列表
     *
     * @memberof IBizFileUploadComponent
     */
    public fileList = [];

    /**
     * 上传文件后台数据信息
     *
     * @type {Array<any>}
     * @memberof IBizFileUploadComponent
     */
    public $items: Array<any> = [];

    /**
     * 上传url
     *
     * @type {string}
     * @memberof IBizFileUploadComponent
     */
    public url: string;

    /**
     * 加载状态
     *
     * @type {boolean}
     * @memberof IBizFileUploadComponent
     */
    public uploading: boolean = false;

    constructor() {
        super();
        this.url = IBizEnvironment.UploadFile + '?';
        this.url = (IBizEnvironment.LocalDeve ? '' : '..') + this.url;
    }

    /**
     * 设置上传文件值绑定
     *
     * @param {*} val
     * @returns
     * @memberof IBizFileUploadComponent
     */
    public setComponentValue(val: any) {
        if (!val) {
            return;
        }
        try {
            let data = JSON.parse(val);
            [...this.fileList] = data;
            [...this.$items] = data;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 上传结果值处理
     *
     * @param {*} info
     * @returns {void}
     * @memberof IBizFileUploadComponent
     */
    public handleChange(info: any): void {
        const fileList = info.fileList;
        // 2. read from response and show file link
        if (info.file.response && info.file.response.ret === 0 && info.file.response.files && info.file.response.files.length > 0) {
            info.file.url = this.getDownLoadFile(info.file.response.files[0]);
            let _items: Array<any> = [];
            this.$items.forEach(item => {
                _items.push({ name: item.name, id: item.id });
            });
            _items.push(info.file.response.files[0]);
            if (!this.form) {
                return;
            }
            const itemField = this.form.findField(this.name);
            if (itemField) {
                itemField.setValue(_items.length > 0 ? JSON.stringify(_items) : '');
            }
        }

        // 3. filter successfully uploaded files according to response from server
        this.fileList = fileList.filter(item => {
            if (item.response) {
                return item.response.status === 'success';
            }
            return true;
        });
    }

    /**
     * 值删除
     *
     * @memberof IBizFileUploadComponent
     */
    public remove = (file: UploadFile) => {
        const datas = this.$items.filter(item => !Object.is(item.id, file.id));
        if (!this.form) {
            return;
        }
        let _items: Array<any> = [];
        datas.forEach(item => {
            _items.push({ name: item.name, id: item.id });
        });
        const itemField = this.form.findField(this.name);
        if (itemField) {
            itemField.setValue(_items.length > 0 ? JSON.stringify(_items) : '');
        }
        return true;
    }

    /**
     * 获取文件下载url
     *
     * @private
     * @param {*} [file={}]
     * @returns {string}
     * @memberof IBizFileUploadComponent
     */
    private getDownLoadFile(file: any = {}): string {
        let url = IBizEnvironment.ExportFile + '?fileid=' + file.id;
        url = (IBizEnvironment.LocalDeve ? '' : '..') + url;
        if (this.form && this.params && this.params.exportparams && !Object.is(this.params.exportparams, '')) {
            let fields: string[] = this.params.exportparams.split(';');
            fields.forEach((item) => {
                let fieldItem = this.form.findField(item);
                if (fieldItem) {
                    url += '&' + item + '=' + fieldItem.value;
                }
            });
        }
        if (this.form && this.params && typeof this.params.customparams === 'object') {
            const _names: Array<any> = Object.keys(this.params.customparams);
            _names.forEach((key) => {
                url += '&' + key + '=' + this.params.customparams[key];
            });
        }
        return url;
    }
}
