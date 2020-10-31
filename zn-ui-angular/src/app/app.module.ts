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

import { ViewTableComponent } from './view-table/view-table.component';
import { ViewFormComponent } from './view-form/view-form.component';

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
    ViewTableComponent,
    ViewFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
