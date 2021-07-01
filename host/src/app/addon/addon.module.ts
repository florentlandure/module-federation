import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddonWrapperComponent } from './addon-wrapper/addon-wrapper.component';

const routes: Routes = [
  {
    path: '**',
    component: AddonWrapperComponent,
  },
];

@NgModule({
  declarations: [AddonWrapperComponent],
  imports: [RouterModule.forChild(routes)],
})
export class AddonModule {}
