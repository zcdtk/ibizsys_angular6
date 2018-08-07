import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { IBizToolbar } from '../../widget/IBizToolbar';
import { IBizEditViewController } from '../../app/IBizEditViewController';
import { IBizButtonComponentService } from '../ibiz-button-component.service';

@Component({
    selector: 'app-ibiz-toolbar',
    template: `
    <div class="ibiz-navigation-toolbar">
      <div class="ibiz-tool-bar">
        <ng-template #dynamicToolbar></ng-template>
      </div>
    </div>
  `
})
export class IBizToolbarComponent implements OnInit, OnDestroy {
    @ViewChild('dynamicToolbar', { read: ViewContainerRef })
    $toolbarContainer: ViewContainerRef;

    public config: any[] = [];

    public toolbar: IBizToolbar;

    public dynamicView: IBizEditViewController;

    private $components: any = {};

    constructor(private resolver: ComponentFactoryResolver, private buttonService: IBizButtonComponentService) { }

    public ngOnInit() {
        if (this.toolbar && this.dynamicView) {
            this.config.forEach(
                (item: any) => {
                    if (!Object.is(item.type, 'UIACTION')) {
                        return;
                    }
                    // 工具栏控制器注册按钮
                    this.toolbar.regToolBarItem({ name: item.name, caption: item.caption, tag: item.uiaction.tag, target: item.uiaction.actiontarget, priv: item.priv });

                    const component = this.buttonService.getButtonComponent('IBizButtonComponent');
                    if (component) {
                        const factory = this.resolver.resolveComponentFactory(component);
                        const comRef: any = this.$toolbarContainer.createComponent(factory);
                        comRef.instance.config = item;
                        comRef.instance.toolbar = this.toolbar;

                        this.regComponent(item.name, comRef);
                    }
                }
            );
        }
    }

    public regComponent(name: string, comRef: any): void {
        this.$components[name] = comRef;
    }

    public ngOnDestroy() {
        let kyes: string[] = Object.keys(this.$components);
        kyes.forEach(
            (key: string) => {
                this.$components[key].destroy();
            }
        );
    }

}
