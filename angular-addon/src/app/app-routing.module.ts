import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'other',
    loadChildren: () => import('./addon.module').then((m) => m.AddonModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
