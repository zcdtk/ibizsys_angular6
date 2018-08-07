import { IBizFormField } from './../formitem/IBizFormField';
import { IBizDynamicFormComponent } from './../dynamic-components/ibiz-dynamic-form/ibiz-dynamic-form.component';
import { IBizToolbarComponent } from './../dynamic-components/ibiz-dynamic-toolbar/ibiz-toolbar.component';
import { IBizDynamicViewModalService } from './../dynamic-components/ibiz-dynamic-view-modal.service';
import { ViewChild, ViewContainerRef, ComponentFactoryResolver, Renderer2 } from '@angular/core';
import { IBizViewController } from './IBizViewController';
import { IBizDynamicControl } from '../widget/IBizDynamicControl';
import { IBizToolbar } from '../widget/IBizToolbar';
import { IBizDynamicEditForm } from '../widget/IBizDynamicEditForm';

export class IBizDynamicViewController extends IBizViewController {

    @ViewChild('dynamicRef', { read: ViewContainerRef })
    $container: ViewContainerRef;

    /**
     * 组件工厂
     * 
     * @private
     * @type {ComponentFactoryResolver}
     * @memberof IBizDynamicViewController
     */
    public $resolver: ComponentFactoryResolver;

    /**
     * Dom操作
     * 
     * @private
     * @type {Renderer2}
     * @memberof IBizDynamicViewController
     */
    public $renderer2: Renderer2;

    /**
     * 已经动态创建的所有组件
     * 
     * @private
     * @type {any[]}
     * @memberof IBizDynamicViewController
     */
    private $components: any = {};

    /**
     * 视图配置Service
     * 
     * @private
     * @type {IBizDynamicControl}
     * @memberof IBizDynamicViewController
     */
    public $dynamicService: IBizDynamicControl;

    /**
     * 工具栏控制器
     * 
     * @private
     * @type {IBizToolbar}
     * @memberof IBizDynamicViewController
     */
    public $toobarService: IBizToolbar;

    /**
     * 表单控制器
     * 
     * @private
     * @type {IBizFormService}
     * @memberof IBizDynamicEditViewController
     */
    public $formService: IBizDynamicEditForm;

    /**
     * 视图模型
     * 
     * @private
     * @type {*}
     * @memberof IBizDynamicEditViewController
     */
    public $viewModel: any;

    /**
     * 当前视图关联的全部视图modalService集合
     * 
     * @private
     * @type {*}
     * @memberof IBizDynamicEditViewController
     */
    public $modalServiceAll: any = {};

    /**
     * 动态部件打开模态窗服务
     * 
     * @private
     * @type {IBizDynamicViewModalService}
     * @memberof IBizDynamicEditViewController
     */
    public $dynamicViewModalService: IBizDynamicViewModalService;

    /**
     * 动态视图参数
     *
     * @type {*}
     * @memberof IBizDynamicViewController
     */
    private $dynamicViewParams: any = {};

    constructor(opt: any = {}) {
        super(opt);

        this.$resolver = opt.resolver;
        this.$renderer2 = opt.renderer2;
        this.$dynamicViewModalService = opt.ibizDynamicViewModalService;

        this.$dynamicService = new IBizDynamicControl({ url: opt.url, viewController: this, notification: this.$iBizNotification });
        this.$toobarService = new IBizToolbar({ url: opt.url, viewController: this, notification: this.$iBizNotification });
        this.regControl('dynamicToolbar', this.$toobarService);
        this.$formService = new IBizDynamicEditForm({ name: 'form', url: opt.url, viewController: this, notification: this.$iBizNotification });
        this.regControl('form', this.$formService);
    }

    /**
     * 初始化工具栏
     * 
     * @private
     * @param {*} toolbarConfig 
     * @memberof IBizDynamicViewController
     */
    public initToolbarModel(toolbarConfig: any): void {
        const factory = this.$resolver.resolveComponentFactory(IBizToolbarComponent);
        const viewRef: any = this.$container.createComponent(factory);
        viewRef.instance.config = toolbarConfig;
        viewRef.instance.toolbar = this.$toobarService;
        viewRef.instance.dynamicView = this;
        Object.assign(this.$components, { 'toolbar': viewRef });
    }

    /**
     * 初始化表单
     * 
     * @private
     * @param {*} formConfig 
     * @memberof IBizDynamicEditViewController
     */
    public initFormModel(formConfig: any): void {
        const factory = this.$resolver.resolveComponentFactory(IBizDynamicFormComponent);
        const viewRef: any = this.$container.createComponent(factory);
        viewRef.instance.config = formConfig;
        viewRef.instance.form = this.$formService;
        viewRef.instance.dynamicView = this;
        Object.assign(this.$components, { 'form': viewRef });
    }

    /**
     * 注册实体界面行为
     * 
     * @private
     * @memberof IBizDynamicEditViewController
     */
    public initUiactions(config: any[]): void {
        config.forEach((item) => {
            this.regUIAction(item);
        });
    }

    /**
     *注册隐藏表单项
     *
     * @param {any[]} fields
     * @memberof IBizDynamicViewController
     */
    public regHiddenFields(fields: any[]): void {
        fields.forEach(
            (name) => {
                this.$formService.regField(new IBizFormField({ name: name, visible: true, fieldType: 'HIDDENFORMITEM', form: this.$formService }));
            }
        );
    }

    /**
     * 销毁所有动态组件
     *
     * @memberof IBizDynamicViewController
     */
    public destroyDynamicComponents(): void {
        const keys: string[] = Object.keys(this.$components);
        keys.forEach(
            (key: string) => {
                this.$components[key].destroy();
            }
        );
        this.$components = [];
    }

    /**
     * 获取所有关联视图的modalService
     * 
     * @returns {*} 
     * @memberof IBizDynamicEditViewController
     */
    public getAllModalService(): any {
        return this.$modalServiceAll;
    }

    /**
     * 获取动态视图参数
     *
     * @returns {(any | undefined)}
     * @memberof IBizViewController
     */
    public getDynamicParams(): any {
        return this.$dynamicViewParams;
    }

    /**
     * 设置动态视图参数
     *
     * @param {*} params
     * @memberof IBizDynamicViewController
     */
    public setDynamicParams(params: any): void {
        this.$dynamicViewParams = params;
    }

}
