import { Injectable } from '@angular/core';

@Injectable()
export class IBizDynamicViewModalService {
    private $modelServiceAll: any;

    constructor() {}

    public getModalService(name: string): any {
        return this.selectModalService(name);
    }

    private selectModalService(name: string): any {
        if (this.$modelServiceAll) {
            return this.$modelServiceAll[name];
        }
        return undefined;
    }

    public setAllModalService(allService: any = {}): void {
        this.$modelServiceAll = allService;
    }
}