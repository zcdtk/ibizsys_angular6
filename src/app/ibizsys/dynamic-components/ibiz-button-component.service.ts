import { Injectable } from '@angular/core';
import { IBizButtonComponent } from './ibiz-dynamic-button/ibiz-button.component';

@Injectable()
export class IBizButtonComponentService {
    constructor() {}

    public getButtonComponent(name: string): any {
        return this.getComponent(name);
    }

    private getComponent(name: string): any {
        if (Object.is(name, 'IBizButtonComponent')) {
            return IBizButtonComponent;
        }
        return undefined;
    }
}