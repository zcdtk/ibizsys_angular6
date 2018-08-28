import { Component } from '@angular/core';
import { SettingService } from 'ibizsys';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent {

    public isCollapsed: boolean = false;

    constructor(private setting: SettingService) { }

    public toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
        this.setting.collapsed(this.isCollapsed);
    }

}
