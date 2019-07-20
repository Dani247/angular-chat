import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './helpers/auth.guard'

// components
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component'

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(routes)