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
import { IBizSafeContantPipe } from './ibiz-safe-contant.pipe';

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
	IBizSafeContantPipe
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
        ...conponents
    ],
    entryComponents: [
    ],
    providers: [
        DatePipe
    ]
})
export class IBizComponentsModule { }
