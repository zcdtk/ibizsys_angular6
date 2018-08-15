import { Component } from '@angular/core';
import { SettingService } from '@core/setting.service';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.less']
})
export class LayoutDefaultComponent {

    /**
     * 是否展开菜单
     *
     * @type {boolean}
     * @memberof LayoutDefaultComponent
     */
    public isCollapsed: boolean = false;

    /**
     * Creates an instance of LayoutDefaultComponent.
     * 创建 LayoutDefaultComponent 实例
     * 
     * @param {SettingService} setting
     * @memberof LayoutDefaultComponent
     */
    constructor(private setting: SettingService) { }

    /**
     * 菜单收缩
     *
     * @memberof LayoutDefaultComponent
     */
    public toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
        this.setting.collapsed(this.isCollapsed);
    }

}
