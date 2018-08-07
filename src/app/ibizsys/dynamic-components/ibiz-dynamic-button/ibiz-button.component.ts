import { Component } from '@angular/core';
import { IBizToolbar } from '../../widget/IBizToolbar';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ibiz-button',
    template: `<button [disabled]="toolbar.$items[config.name].disabled" nz-button [nzSize]="'large'" class="ml-sm" (click)="toolbar.itemclick(config.name, config.uiaction.tag)">
      <i [class]="config.icon"></i>
      {{config.caption}}
    </button>`
})
export class IBizButtonComponent {

    public toolbar: IBizToolbar;

    public config: any;

    constructor() { }

}
