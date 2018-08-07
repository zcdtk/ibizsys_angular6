import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { IBizComponentsModule } from '../components/ibiz-components.module';

import { IBizToolbarComponent } from './ibiz-dynamic-toolbar/ibiz-toolbar.component';
import { IBizButtonComponent } from './ibiz-dynamic-button/ibiz-button.component';
import { IBizDynamicFormComponent } from './ibiz-dynamic-form/ibiz-dynamic-form.component';
import { IBizButtonComponentService } from './ibiz-button-component.service';
import { IBizFieldComponentService } from './ibiz-field-component.service';
import { IBizDynamicFormPageComponent } from './ibiz-dynamic-form-page/ibiz-dynamic-form-page.component';
import { IBizDynamicInputComponent } from './ibiz-dynamic-input/ibiz-dynamic-input.component';
import { IBizDynamicFormGroupComponent } from './ibiz-dynamic-from-group/ibiz-dynamic-form-group.component';
import { IBizDynamicPickerComponent } from './ibiz-dynamic-picker/ibiz-dynamic-picker.component';
import { IBizDynamicSpanComponent } from './ibiz-dynamic-span/ibiz-dynamic-span.component';
import { IBizDynamicRadioButtonListComponent } from './ibiz-dynamic-radio-button-list/ibiz-dynamic-radio-button-list.component';
import { IBizDynamicAddressPickupComponent } from './ibiz-dynamic-address-pickup/ibiz-dynamic-address-pickup.component';
import { IBizDynamicTextreaComponent } from './ibiz-dynamic-textarea/ibiz-dynamic-textarea.component';
import { IBizDynamicTextrea10Component } from './ibiz-dynamic-textarea10/ibiz-dynamic-textarea10.component';
import { IBizDynamicListBoxPickupComponent } from './ibiz-dynamic-list-box-pickup/ibiz-dynamic-list-box-pickup.component';
import { IBizDynamicPasswordComponent } from './ibiz-dynamic-password/ibiz-dynamic-password.component';
import { IBizDynamicDataPickerexComponent } from './ibiz-dynamic-date-pickerex/ibiz-dynamic-data-pickerex.component';
import { IBizDynamicPictureComponent } from './ibiz-dynamic-picture/ibiz-dynamic-picture.component';
import { IBizDynamicFileuploaderComponent } from './ibiz-dynamic-fileuploader/ibiz-dynamic-fileuploader.component';
import { IBizDynamicCheckboxListComponent } from './ibiz-dynamic-checkbox-list/ibiz-dynamic-checkbox-list.component';
import { IBizDynamicDropdownlistComponent } from './ibiz-dynamic-dropdownlist/ibiz-dynamic-dropdownlist.component';
import { IBizDynamicCheckboxComponent } from './ibiz-dynamic-checkbox/ibiz-dynamic-checkbox.component';
import { IBizDynamicViewModalService } from './ibiz-dynamic-view-modal.service';


const dynamicComponents = [
    IBizToolbarComponent,
    IBizButtonComponent,
    IBizDynamicFormComponent,
    IBizDynamicFormPageComponent,
    IBizDynamicFormGroupComponent,
    IBizDynamicInputComponent,
    IBizDynamicPickerComponent,
    IBizDynamicSpanComponent,
    IBizDynamicRadioButtonListComponent,
    IBizDynamicAddressPickupComponent,
    IBizDynamicTextreaComponent,
    IBizDynamicTextrea10Component,
    IBizDynamicListBoxPickupComponent,
    IBizDynamicPasswordComponent,
    IBizDynamicDataPickerexComponent,
    IBizDynamicPictureComponent,
    IBizDynamicFileuploaderComponent,
    IBizDynamicDropdownlistComponent,
    IBizDynamicCheckboxComponent,
    IBizDynamicCheckboxListComponent,
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        IBizComponentsModule,
    ],
    exports: [
        ...dynamicComponents
    ],
    declarations: [
        ...dynamicComponents
    ],
    entryComponents: [
        ...dynamicComponents
    ],
    providers: [
        IBizDynamicViewModalService,
        IBizButtonComponentService,
        IBizFieldComponentService,
    ],
})
export class DynamicComponentsModule { }
