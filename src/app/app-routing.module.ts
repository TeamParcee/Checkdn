import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ConfirmEmailGuard } from './auth/confirm-email/confirm-email.guard';
import { ConfirmEmailPageModule } from './auth/confirm-email/confirm-email.module';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard, ConfirmEmailGuard] },
  {
    path: 'chat-room',
    loadChildren: () => import('./chat-room/chat-room.module').then(m => m.ChatRoomPageModule)
  }, {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule),
  },{
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'confirm-email',
    loadChildren: () => import('./auth/confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule)
  },
  {
    path: 'view-profile',
    loadChildren: () => import('./view-profile/view-profile.module').then(m => m.ViewProfilePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'private-chat',
    loadChildren: () => import('./private-chat/private-chat.module').then(m => m.PrivateChatPageModule), canActivate: [AuthGuard, ConfirmEmailGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
