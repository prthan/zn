import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewHomeComponent } from './view-home/view-home.component';

import { znTableDirective } from '../lib/directives/table/directive';
import { znTextFieldDirective } from '../lib/directives/textfield/directive';
import { znTextAreaDirective } from '../lib/directives/textarea/directive';
import { znCheckboxFieldDirective } from '../lib/directives/checkboxfield/directive';
import { znButtonDirective } from '../lib/directives/button/directive';
import { znCalendarDirective } from '../lib/directives/calendar/directive';
import { znDropdownFieldDirective } from '../lib/directives/dropdownfield/directive';
import { znDateFieldDirective } from '../lib/directives/datefield/directive';
import { znRadioGroupDirective } from '../lib/directives/radiogroup/directive';
import { znListDirective } from '../lib/directives/list/directive';
import { znPopupDirective } from '../lib/directives/popup/directive';
import { znAnnotatorDirective } from '../lib/directives/annotator/directive';
import { znDialogComponent } from '../lib/components/dialog/component';
import { znSurfaceDirective } from '../lib/directives/surface/directive';

import { ViewTableComponent } from './view-table/view-table.component';
import { ViewFormComponent } from './view-form/view-form.component';
import { ViewListComponent } from './view-list/view-list.component';
import { ViewSurfaceComponent } from './view-surface/view-surface.component';
import { znDraggableDirective } from 'src/lib/directives/draggable/directive';

@NgModule({
  declarations: [
    AppComponent,
    ViewHomeComponent,
    znTableDirective,
    znTextFieldDirective,
    znTextAreaDirective,
    znCheckboxFieldDirective,
    znButtonDirective,
    znCalendarDirective,
    znDropdownFieldDirective,
    znDateFieldDirective,
    znRadioGroupDirective,
    znListDirective,
    znPopupDirective,
    znAnnotatorDirective,
    znDraggableDirective,
    znDialogComponent,
    znSurfaceDirective,
    
    ViewTableComponent,
    ViewFormComponent,
    ViewListComponent,
    ViewSurfaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
