import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBizEnvironment } from '@env/IBizEnvironment';
import { IBizHttp } from '@core/http/IBizHttp';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '@core/setting.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    validateForm: FormGroup;

    get userName() { return this.validateForm.controls.userName; }

    get password() { return this.validateForm.controls.password; }

    public loading: boolean = false;

    public errorinfo: string = '';

    constructor(
        private fb: FormBuilder,
        private http: IBizHttp,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private setting: SettingService
    ) { }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            userName: ['ibzadmin', [Validators.required]],
            password: ['123456', [Validators.required]],
            remember: [true]
        });
    }



    public submitForm(): void {
        // tslint:disable-next-line:forin
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }

        if (this.userName.invalid || this.password.invalid) {
            return;
        }

        if (!IBizEnvironment.LocalDeve) {
            return;
        }
        this.loading = true;

        const login_url: string = IBizEnvironment.RemoteLogin;
        let login_data: any = {};
        Object.assign(login_data, { username: this.userName.value, password: this.password.value });

        // 登录start
        this.http.post(login_url, login_data).subscribe(response => {
            if (response.ret === 0) {
                let userData: any = {};
                Object.assign(userData, response.data);
                Object.assign(userData, response.data);
                this.setting.setToken({
                    token: userData.loginkey,
                    name: userData.username,
                    email: userData.loginname,
                    id: userData.userid,
                    time: +new Date
                });
                this.setting.setUser({ name: userData.username, email: userData.loginname, id: userData.userid, time: +new Date });
                
                const callbackstring = this.activatedRoute.snapshot.paramMap.get('callback');
                if (!callbackstring || Object.is(callbackstring, '')) {
                    this.router.navigateByUrl('');
                } else {
                    this.router.navigateByUrl(callbackstring);
                }
            } else {
                this.loading = false;
                this.errorinfo = response.info;
            }
        }, error => {
            this.loading = false;
            this.errorinfo = Object.is(error.info, '') ? '请求失败！' : error.info;
        });

    }
}
