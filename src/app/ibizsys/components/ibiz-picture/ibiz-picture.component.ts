import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';

import { IBizEnvironment } from '@env/IBizEnvironment';
import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-picture',
    templateUrl: './ibiz-picture.component.html',
    styleUrls: ['./ibiz-picture.component.less']
})
export class IBizPictureComponent extends IBizComponent implements OnInit {

    /**
     * 文件上传参数
     *
     * @type {*}
     * @memberof IBizPictureComponent
     */
    @Input() params: any;

    /**
     * 分组名称
     *
     * @type {string}
     * @memberof IBizPictureComponent
     */
    @Input() groupname: string;

    /**
     * 上传url
     * 
     * @type {string}
     * @memberof IBizPictureComponent
     */
    public url: string;

    /**
     * 上传图片列表
     * 
     * @memberof IBizPictureComponent
     */
    public fileList = [];

    /**
     * 上传文件后台数据信息
     * 
     * @type {Array<any>}
     * @memberof IBizPictureComponent
     */
    public $items: Array<any> = [];

    /**
     * 模态框是否显示
     * 
     * @memberof IBizPictureComponent
     */
    public previewVisible = false;

    /**
     * 预览图片url
     * 
     * @memberof IBizPictureComponent
     */
    public previewImage = '';

    /**
     * 储存下载路径
     * 
     * @memberof IBizPictureComponent
     */
    public downloadUrl = '';

    constructor() {
        super();
        this.url = IBizEnvironment.UploadFile + '?';
        this.url = (IBizEnvironment.LocalDeve ? '' : '..') + this.url;
    }

    /**
     * 设置上传url
     * 
     * @memberof IBizFileUploadComponent
     */
    public ngOnInit(): void {
        super.ngOnInit();
        let uploadUrl = this.url;
        if (this.form && this.params && this.params.uploadparams && !Object.is(this.params.uploadparams, '')) {
            let fields: string[] = this.params.uploadparams.split(';');
            fields.forEach((item) => {
                let fieldItem = this.form.findField(item);
                if (fieldItem) {
                    uploadUrl += '&' + item + '=' + fieldItem.value;
                }
            });
        }
        if (this.form && this.params && typeof this.params.customparams === 'object') {
            const _names: Array<any> = Object.keys(this.params.customparams);
            _names.forEach((key) => {
                uploadUrl += '&' + key + '=' + this.params.customparams[key];
            });
        }
        this.url = uploadUrl;
    }

    /**
     * 设置上传文件值绑定
     * 
     * @param {*} val 
     * @returns 
     * @memberof IBizPictureComponent
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
     * @memberof IBizPictureComponent
     */
    public handleChange(info: any): void {
        const fileList = info.fileList;
        if (info.file.response && info.file.response.ret === 0 && info.file.response.files && info.file.response.files.length > 0) {
            info.file.url = this.getDownLoadFile(info.file.response.files[0]);
            let _items: Array<any> = [];
            this.$items.forEach(item => {
                _items.push({ name: item.name, id: item.id, url: item.url });
            });
            _items.push(Object.assign(info.file.response.files[0], { url: info.file.url }));
            if (!this.form) {
                return;
            }
            const itemField = this.form.findField(this.name);
            if (itemField) {
                itemField.setValue(_items.length > 0 ? JSON.stringify(_items) : '');
            }
        }
        this.fileList = fileList.filter(item => {
            if (item.response) {
                return item.response.status === 'success';
            }
            return true;
        });
    }

    /**
     * 获取文件下载url
     * 
     * @private
     * @param {*} [file={}] 
     * @returns {string} 
     * @memberof IBizPictureComponent
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

    /**
     * 点击文件链接或预览图标时的回调
     * 
     * @memberof IBizPictureComponent
     */
    handlePreview = (file: UploadFile) => {
        this.downloadUrl = file.url;
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

    /**
     * 值删除
     * 
     * @memberof IBizPictureComponent
     */
    public remove = (file: UploadFile) => {
        const datas = this.$items.filter(item => !Object.is(item.id, file.id));
        if (!this.form) {
            return;
        }
        let _items: Array<any> = [];
        datas.forEach(item => {
            _items.push({ name: item.name, id: item.id, url: item.url });
        });
        const itemField = this.form.findField(this.name);
        if (itemField) {
            itemField.setValue(_items.length > 0 ? JSON.stringify(_items) : '');
        }
        return true;
    }

    /**
     * 下载图片
     * 
     * @memberof IBizPictureComponent
     */
    public downloadImg(): void {
        window.open(this.downloadUrl);
    }

}
