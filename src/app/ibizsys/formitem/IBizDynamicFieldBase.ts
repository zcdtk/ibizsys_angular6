import { OnDestroy, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IBizEditForm } from '../widget/IBizEditForm';
import { IBizFormGroup } from './IBizFormGroup';
import { IBizFormField } from './IBizFormField';
import { IBizEditViewController } from '../app/IBizEditViewController';
import { IBizFieldComponentService } from '../dynamic-components/ibiz-field-component.service';


export class IBizDynamicFieldBase implements OnDestroy {

    /**
     * 当前表单项的配置信息
     * 
     * @type {*}
     * @memberof IBizDynamicBase
     */
    public config: any = [];
    /**
     * 视图部件控制器form
     * 
     * @type {IBizEditForm}
     * @memberof IBizDynamicBase
     */
    public form: IBizEditForm;
    /**
     * 动态视图本身
     * 
     * @type {IBizEditViewController}
     * @memberof IBizDynamicBase
     */
    public dynamicView: IBizEditViewController;
    /**
     * 当前组件动态创建的组件
     * 
     * @private
     * @type {*}
     * @memberof IBizDynamicBase
     */
    private $components: any = {};
    /**
     * 获取动态表单组件服务
     * 
     * @type {IBizFieldComponentService}
     * @memberof IBizDynamicBase
     */
    public fieldService: IBizFieldComponentService;
    /**
     * 用户动态创建组件
     * 
     * @type {ComponentFactoryResolver}
     * @memberof IBizDynamicBase
     */
    public resolver: ComponentFactoryResolver;
    /**
     * 放置动态创建的组件容器
     * 
     * @type {ViewContainerRef}
     * @memberof IBizDynamicBase
     */
    public container: ViewContainerRef;

    constructor(opt) {
        this.resolver = opt.resolver;
        this.fieldService = opt.fieldService;
    }

    /**
   * 创建子组件
   * 
   * @memberof IBizFormComponent
   */
    public createChildComponent(item: any): void {
        let component: any;
        // 注册表单项
        if (Object.is(item.type, 'FORMPAGE')) {
            component = this.fieldService.getFieldComponent('FORMPAGE');
        } else if (Object.is(item.type, 'GROUPPANEL')) {
            this.form.regField(new IBizFormGroup({ name: item.name, visible: item.visible, fieldType: item.type, titleBarCloseMode: '0', form: this.form }));
            component = this.fieldService.getFieldComponent('GROUPPANEL');
        } else if (Object.is(item.type, 'FORMITEM')) {
            this.form.regField(new IBizFormField({ name: item.name, visible: item.visible, fieldType: item.type, allowEmpty: item.allowEmpty, form: this.form }));
            component = this.fieldService.getFieldComponent(item.editortype);
        } else {
            return;
        }

        if (component && this.container) {
            const factory = this.resolver.resolveComponentFactory(component);
            const comRef: any = this.container.createComponent(factory);
            comRef.instance.config = item;
            comRef.instance.form = this.form;
            comRef.instance.fieldService = this.fieldService;

            this.regComponent(item.name, comRef);
        }
    }

    /**
     * 注册组件
     * 
     * @param {string} name 
     * @param {*} comRef 
     * @memberof IBizFormComponent
     */
    public regComponent(name: string, comRef: any): void {
        this.$components[name] = comRef;
    }

    /**
     * 销毁组件
     * 
     * @memberof IBizFormComponent
     */
    public ngOnDestroy() {
        let kyes: string[] = Object.keys(this.$components);
        kyes.forEach((key: string) => {
            this.$components[key].destroy();
        });
    }
}
