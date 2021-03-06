import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { IBizFormComponent } from './ibiz-form/ibiz-form.component';
import { IBizFormGroupComponent } from './ibiz-form-group/ibiz-form-group.component';
import { IBizFormItemComponent } from './ibiz-form-item/ibiz-form-item.component';
import { IBizDatepickerComponent } from './ibiz-datepicker/ibiz-datepicker.component';
import { IBizTimepickerComponent } from './ibiz-timepicker/ibiz-timepicker.component';
import { IBizPictureComponent } from './ibiz-picture/ibiz-picture.component';
import { IBizFileUploadComponent } from './ibiz-file-upload/ibiz-file-upload.component';
import { IBizRichTextEditorComponent } from './ibiz-rich-text-editor/ibiz-rich-text-editor.component';
import { IBizSelectComponent } from './ibiz-select/ibiz-select.component';
import { IBizTextareaComponent } from './ibiz-textarea/ibiz-textarea.component';
import { IBizTextareaTenComponent } from './ibiz-textarea-ten/ibiz-textarea-ten.component';
import { IBizPasswordComponent } from './ibiz-password/ibiz-password.component';
import { IBizCheckboxComponent } from './ibiz-checkbox/ibiz-checkbox.component';
import { IBizDRPanelComponent } from './ibiz-drpanel/ibiz-drpanel.component';
import { IBizSafeContantPipe } from './ibiz-safe-contant.pipe';
import { IBizEcharts4Component } from './ibiz-echarts4/ibiz-echarts4.component';
import { IBizAutocompleteComponent } from './ibiz-autocomplete/ibiz-autocomplete.component';
import { IBizGroupMenuComponent } from './ibiz-group-menu/ibiz-group-menu.component';
import { IBizPickerComponent } from './ibiz-picker/ibiz-picker.component';
import { IBizMpickerComponent } from './ibiz-mpicker/ibiz-mpicker.component';

const conponents = [
    IBizFormComponent,
    IBizFormGroupComponent,
    IBizFormItemComponent,
    IBizDatepickerComponent,
    IBizTimepickerComponent,
    IBizPictureComponent,
    IBizFileUploadComponent,
    IBizRichTextEditorComponent,
    IBizSelectComponent,
    IBizTextareaComponent,
    IBizTextareaTenComponent,
    IBizSafeContantPipe,
    IBizPasswordComponent,
    IBizCheckboxComponent,
    IBizDRPanelComponent,
    IBizEcharts4Component,
    IBizAutocompleteComponent,
    IBizGroupMenuComponent,
    IBizPickerComponent,
    IBizMpickerComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        ...conponents
    ],
    declarations: [
        ...conponents,
    ],
    entryComponents: [
    ],
    providers: [
        DatePipe
    ]
})
export class IBizComponentsModule { }
