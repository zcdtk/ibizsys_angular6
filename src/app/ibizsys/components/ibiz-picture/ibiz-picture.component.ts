import { Component, Input } from '@angular/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';

import { IBizComponent } from '../ibiz-component';

@Component({
    selector: 'app-ibiz-picture',
    templateUrl: './ibiz-picture.component.html',
    styleUrls: ['./ibiz-picture.component.less']
})
export class IBizPictureComponent extends IBizComponent {

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

    // constructor() {
    //     super();
    // }


    fileList = [
        {
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
    ];
    previewImage = '';
    previewVisible = false;

    constructor(private msg: NzMessageService) {
        super();
    }

    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

}
