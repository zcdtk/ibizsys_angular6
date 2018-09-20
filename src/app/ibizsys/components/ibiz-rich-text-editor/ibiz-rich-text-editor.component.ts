import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { IBizEnvironment } from '@env/ibiz-environment';
import { IBizComponent } from '../ibiz-component';


import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/link';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/table';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/preview';


declare let tinymce: any;

@Component({
    selector: 'app-ibiz-rich-text-editor',
    template: `<textarea [id]="elementID"></textarea>`,
    styles: []
})
export class IBizRichTextEditorComponent extends IBizComponent implements AfterViewInit, OnDestroy {

    /**
     * 语言
     * 
     * @type {string}
     * @memberof IBizRichTextEditorComponent
     */
    public langu: string = 'zh_CN';

    /**
     * 标签节点ID
     *
     * @type {string}
     * @memberof IBizRichTextEditorComponent
     */
    @Input() elementID: string;

    /**
     * 编辑器
     *
     * @private
     * @memberof IBizRichTextEditorComponent
     */
    private editor;

    /**
     * 表单项值
     *
     * @type {*}
     * @memberof IBizRichTextEditorComponent
     */
    public setComponentValue(val: any) {
        if (val) {
            tinymce.remove('#' + this.elementID);
            this.Init(val);
        }
    }

    /**
     * Creates an instance of IBizRichTextEditorComponent.
     * 创建 IBizRichTextEditorComponent 实例
     * 
     * @param {IBizHttp} ibizhttp
     * @memberof IBizRichTextEditorComponent
     */
    constructor(private http: HttpClient) {
        super();
    }

    /**
     * 视图部件初始化完成
     *
     * @memberof IBizRichTextEditorComponent
     */
    public ngAfterViewInit(): void {
        if (!this.editor) {
            let timeNum = setInterval(() => {
                if (this.editor) {
                    clearInterval(timeNum);
                }
                this.Init('');
            }, 100);
        }
    }

    /**
     * 初始化
     *
     * @param {*} val
     * @returns {void}
     * @memberof IBizRichTextEditorComponent
     */
    public Init(val: any): void {
        const richtexteditor = this;
        if (!tinymce) {
            return;
        }
        tinymce.init({
            selector: '#' + this.elementID,
            width: parseInt(this.width, 10),
            height: parseInt(this.height, 10),
            min_height: (this.height && parseInt(this.height, 10) > 350) ? this.height : 350,
            min_width: (this.width && parseInt(this.width, 10) > 400) ? this.height : 400,
            branding: false,
            plugins: ['link', 'paste', 'table', 'image', 'codesample', 'code', 'fullscreen', 'preview'],
            codesample_languages: [
                { text: 'HTML/XML', value: 'markup' },
                { text: 'JavaScript', value: 'javascript' },
                { text: 'CSS', value: 'css' },
                { text: 'PHP', value: 'php' },
                { text: 'Ruby', value: 'ruby' },
                { text: 'Python', value: 'python' },
                { text: 'Java', value: 'java' },
                { text: 'C', value: 'c' },
                { text: 'C#', value: 'csharp' },
                { text: 'C++', value: 'cpp' }
            ],
            skin_url: 'src/assets/tinymce/skins/lightgray',
            language_url: `src/assets/tinymce/langs/${this.langu}.js`,
            codesample_content_css: 'src/assets/tinymce/prism.css',
            setup: editor => {
                this.editor = editor;
                editor.on('blur', () => {
                    const content = editor.getContent();
                    if (!richtexteditor.form) {
                        return;
                    }

                    let _field = richtexteditor.form.findField(richtexteditor.name);
                    if (!_field) {
                        return;
                    }
                    _field.setValue(content);
                });
            },
            images_upload_handler: function (bolbinfo, success, failure) {
                const formData = new FormData();
                formData.append('file', bolbinfo.blob(), bolbinfo.filename());
                const _url = (IBizEnvironment.LocalDeve ? '' : '..') + IBizEnvironment.UploadFile;
                richtexteditor.uploadFile(_url, formData).subscribe((response) => {
                    if (response.ret === 0 && response.files.length > 0) {
                        const id: string = response.files[0].id;
                        const url: string = `${IBizEnvironment.ExportFile}?fileid=${id}`
                        success(url);
                    }
                }, (error) => {
                    console.log(error);
                });
            },
            init_instance_callback: (editor) => {
                this.editor = editor;
                let value = (val && val.length > 0) ? val : '';
                if (this.editor) {
                    this.editor.setContent(value);
                }
                if (this.disabled) {
                    this.editor.setMode('readonly');
                }
            }

        });
    }

    /**
     * 文件上传处理
     * 
     * @private
     * @param {string} url
     * @param {*} formData
     * @returns {Observable<any>}
     * @memberof IBizRichTextEditorComponent
     */
    private uploadFile(url: string, formData: any): Observable<any> {
        let headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "image/png");
        return this.http.post(url, formData, { headers: headers });
    }

    /**
     * 部件销毁
     *
     * @memberof IBizRichTextEditorComponent
     */
    public ngOnDestroy(): void {
        tinymce.remove(this.editor);
    }

}

