import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './helpers/auth.guard'

// components
import { HomeComponent } from './components/home/home.component'
import { LobbyComponent } from './components/lobby/lobby.component'
import { ChatComponent } from './components/chat/chat.component'
import { DirectComponent } from './components/direct/direct.component'

import { LoginComponent } from './components/login/login.component'

const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: '', component: LobbyComponent },
      { path: 'room/:roomId', component: ChatComponent },
      { path: 'dm', component: DirectComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(routes)