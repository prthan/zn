import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewFormComponent } from './view-form/view-form.component';
import { ViewHomeComponent } from './view-home/view-home.component';
import { ViewTableComponent } from './view-table/view-table.component';
import { ViewListComponent } from './view-list/view-list.component';

const routes: Routes = [
  {path: '', component: ViewHomeComponent},
  {path: 'home', component: ViewHomeComponent},
  {path: 'zn-ui/table', component: ViewTableComponent},
  {path: 'zn-ui/form', component: ViewFormComponent},
  {path: 'zn-ui/list', component: ViewListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
