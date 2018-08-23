import { Component, TemplateRef, ContentChild, Input } from '@angular/core';

@Component({
    selector: 'app-ibiz-form-group',
    templateUrl: './ibiz-form-group.component.html',
    styleUrls: ['./ibiz-form-group.component.less']
})
export class IBizFormGroupComponent {

    /**
     * 
     *
     * @type {TemplateRef<any>}
     * @memberof IBizFormGroupComponent
     */
    @ContentChild(TemplateRef) template: TemplateRef<any>;

    /**
     * 
     *
     * @memberof IBizFormGroupComponent
     */
    @Input()
    set field(val) {
        this.context = { '$implicit': val };
    }

    /**
     * 
     *
     * @type {*}
     * @memberof IBizFormGroupComponent
     */
    public context: any = {};

    constructor() { }
}
