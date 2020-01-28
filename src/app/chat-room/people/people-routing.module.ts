import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeoplePage } from './people.page';
import { ViewProfilePage } from 'src/app/view-profile/view-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PeoplePage
  },{
    path: 'view-profile',
    loadChildren: () => import('../../view-profile/view-profile.module' ).then( m => m.ViewProfilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeoplePageRoutingModule {}
