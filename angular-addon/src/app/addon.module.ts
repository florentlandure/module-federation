import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { OtherComponent } from './other/other.component';

const routes: Route[] = [
  {
    path: '',
    component: OtherComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [OtherComponent],
  imports: [RouterModule.forChild(routes)],
})
export class AddonModule {}
