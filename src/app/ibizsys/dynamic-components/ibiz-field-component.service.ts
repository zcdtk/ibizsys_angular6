import { Injectable } from '@angular/core';

import { IBizDynamicFormPageComponent } from './ibiz-dynamic-form-page/ibiz-dynamic-form-page.component';
import { IBizDynamicFormGroupComponent } from './ibiz-dynamic-from-group/ibiz-dynamic-form-group.component';
import { IBizDynamicInputComponent } from './ibiz-dynamic-input/ibiz-dynamic-input.component';
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
import { IBizDynamicDropdownlistComponent } from './ibiz-dynamic-dropdownlist/ibiz-dynamic-dropdownlist.component';
import { IBizDynamicCheckboxComponent } from './ibiz-dynamic-checkbox/ibiz-dynamic-checkbox.component';
import { IBizDynamicCheckboxListComponent } from './ibiz-dynamic-checkbox-list/ibiz-dynamic-checkbox-list.component';

@Injectable()
export class IBizFieldComponentService {
    constructor() {}

    public getFieldComponent(type: string): any {
        return this.getComponent(type);
    }

    private getComponent(type: string): any {
        if (Object.is(type, 'FORMPAGE')) {
            return IBizDynamicFormPageComponent;
        }
        if (Object.is(type, 'GROUPPANEL')) {
            return IBizDynamicFormGroupComponent;
        }
        if (
            Object.is(type, 'PICKER')
            || Object.is(type, 'PICKEREX_LINK')
            || Object.is(type, 'PICKEREX_NOAC_LINK')
            || Object.is(type, 'PICKEREX_NOAC')
            || Object.is(type, 'PICKEREX_NOBUTTON')
            || Object.is(type, 'PICKEREX_TRIGGER_LINK')
            || Object.is(type, 'PICKEREX_TRIGGER')
        ) {
            return IBizDynamicPickerComponent;
        }
        if (Object.is(type, 'SPAN')) {
            return IBizDynamicSpanComponent;
        }
        if (Object.is(type, 'RADIOBUTTONLIST')) {
            return IBizDynamicRadioButtonListComponent;
        }
        if (Object.is(type, 'ADDRESSPICKUP')) {
            return IBizDynamicAddressPickupComponent;
        }
        if (Object.is(type, 'TEXTAREA')) {
            return IBizDynamicTextreaComponent;
        }
        if (Object.is(type, 'TEXTAREA_10')) {
            return IBizDynamicTextrea10Component;
        }
        if (Object.is(type, 'LISTBOXPICKUP')) {
            return IBizDynamicListBoxPickupComponent;
        }
        if (Object.is(type, 'PASSWORD')) {
            return IBizDynamicPasswordComponent;
        }
        if (
            Object.is(type, 'DATEPICKEREX')
            || Object.is(type, 'DATEPICKEREX_MINUTE')
            || Object.is(type, 'DATEPICKEREX_SECOND')
            || Object.is(type, 'DATEPICKEREX_NODAY')
            || Object.is(type, 'DATEPICKEREX_NODAY_NOSECOND')
            || Object.is(type, 'DATEPICKEREX_NOTIME')
            || Object.is(type, 'DATEPICKEREX_HOUR')
            || Object.is(type, 'DATEPICKER')
        ) {
            return IBizDynamicDataPickerexComponent;
        }
        if (Object.is(type, 'PICTURE')) {
            return IBizDynamicPictureComponent;
        }
        if (Object.is(type, 'FILEUPLOADER')) {
            return IBizDynamicFileuploaderComponent;
        }
        if (Object.is(type, 'DROPDOWNLIST') || Object.is(type, 'DROPDOWNLIST_100')) {
            return IBizDynamicDropdownlistComponent;
        }
        if (Object.is(type, 'CHECKBOX')) {
            return IBizDynamicCheckboxComponent;
        }
        if (Object.is(type, 'CHECKBOXLIST')) {
            return IBizDynamicCheckboxListComponent;
        }
        return IBizDynamicInputComponent;
    }
}

