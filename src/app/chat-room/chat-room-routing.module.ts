import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatRoomPage } from './chat-room.page';

const routes: Routes = [
  {
    path: '',
    component: ChatRoomPage
  },
  {
    path: 'people',
    loadChildren: () => import('./people/people.module').then( m => m.PeoplePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoomPageRoutingModule {}
