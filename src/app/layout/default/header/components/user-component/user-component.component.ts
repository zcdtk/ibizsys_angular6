import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBizEnvironment } from '@env/IBizEnvironment';
import { SettingService } from '@core/setting.service';
import { IBizHttp } from '@core/http/IBizHttp';
import { IBizNotification } from '@core/notice/IBizNotification';

@Component({
  selector: 'app-user-component',
  templateUrl: './user-component.component.html',
  styleUrls: ['./user-component.component.less']
})
export class UserComponentComponent implements OnInit {

  constructor(
    public settings: SettingService,
    private router: Router,
    private http: IBizHttp,
    private iBizNotification: IBizNotification) { }

  ngOnInit() {
    this.settings.settingChange().subscribe((res: any) => {
      this.settings.setUser(res);
    });
    // mock
    const token = this.settings.getToken() || {
      token: 'nothing',
      name: '匿名访问',
      avatar: './assets/img/avatar.png',
      email: ''
    };
    this.settings.setToken(token);
    // 非本地开发获取用户信息
    if (!IBizEnvironment.LocalDeve) {
      this.http.post(IBizEnvironment.AppLogin, { srfaction: 'getcuruserinfo' }).subscribe((result) => {
        if (result.ret === 0) {
          if (Object.keys(result.data).length !== 0) {
            let _data: any = {};
            Object.assign(_data, result.data);
            // this.tokenService.set({
            //   token: _data.loginkey,
            //   name: _data.username,
            //   email: _data.loginname,
            //   id: _data.userid,
            //   time: +new Date
            // });
            this.settings.setUser();
            this.settings.setToken(_data.loginkey);
          }
        } else {
          this.settings.setToken(token);
        }
      }, (error) => {
        console.log(error)
      });
    }
  }
  /**
   * 退出登录
   * 
   * @memberof UserComponentComponent
   */
  public logout() {
    const curUrl: string = decodeURIComponent(window.location.href);
    if (IBizEnvironment.UacAuth) {
      window.location.href = `../api/uacloginout.do?RU=${curUrl}`;
    } else if (IBizEnvironment.LocalDeve) {
      console.log(this.router);
      // return ;
      this.settings.setToken("");
      this.router.navigate(['/passport/login', { callback: this.router.url }]);
    } else {
      window.location.href = `..${IBizEnvironment.Logout}?RU=${curUrl}`;
    }
  }

  /**
   * 安装运行数据
   * 
   * @memberof UserComponentComponent
   */
  public installRTData(): void {
    this.http.post(IBizEnvironment.InstallRTData).subscribe((result) => {
      if (result.ret === 0) {
        this.iBizNotification.success('成功', result.info);
      } else {
        this.iBizNotification.error('错误', result.info);
      }
    }, (error) => {
      this.iBizNotification.error('错误', error.info);
    });
  }

}
