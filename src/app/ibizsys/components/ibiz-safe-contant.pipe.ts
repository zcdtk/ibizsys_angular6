import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * 去掉xss保护，默认字符串拼接代码为安全的html
 *
 * @export
 * @class IbizSafeContantPipe
 * @implements {PipeTransform}
 */
@Pipe({
    name: 'iBizSafeContant'
})
export class IBizSafeContantPipe implements PipeTransform {

    /**
     * Creates an instance of IbizSafeContantPipe.
     * 创建 IbizSafeContantPipe 实例
     * 
     * @param {DomSanitizer} sanitizer
     * @memberof IbizSafeContantPipe
     */
    constructor(private sanitizer: DomSanitizer) {
    }

    /**
     * 安全内容过滤
     *
     * @param {string} code 内容
     * @param {string} type 内容类型
     * @returns {*}
     * @memberof IbizSafeContantPipe
     */
    transform(contant: string, type: string): any {
        if (Object.is(type, 'html')) {
            return this.sanitizer.bypassSecurityTrustHtml(contant);
        } else if (Object.is(type, 'style')) {
            return this.sanitizer.bypassSecurityTrustStyle(contant);
        } else if (Object.is(type, 'script')) {
            return this.sanitizer.bypassSecurityTrustScript(contant);
        } else if (Object.is(type, 'url')) {
            return this.sanitizer.bypassSecurityTrustUrl(contant);
        } else if (Object.is(type, 'resourceurl')) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(contant);
        }
    }

}
