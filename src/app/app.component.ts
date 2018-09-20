import { IBizEnvironment } from '@env/ibiz-environment';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { IBizApp } from 'ibizsys';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

    private separator = ' - ';

    constructor(private router: Router, private title: Title, private ibizapp: IBizApp) {
    }

    public ngOnInit(): void {
        this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe((evt) => {
            const routerData = this.ibizapp.getActivatedRouteDatas(this.ibizapp.$activatedRouteDatas.length - 1);
            this.title.setTitle(`${routerData.title}${this.separator}${IBizEnvironment.name}`);
        });
    }
}
