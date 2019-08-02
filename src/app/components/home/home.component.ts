import { Component, OnInit, OnDestroy } from '@angular/core';

import { SocketService } from '../../services/socket.service'
import { AuthDataService } from '../../services/auth-data.service'
import { User } from 'src/app/models/User';
import { Subscription } from 'rxjs';
import { UsersService } from '../../services/users.service'
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[]
  me: User;

  constructor(
    private SocketService: SocketService,
    private AuthData: AuthDataService,
    private UsersService: UsersService,
    private HttpService: HttpService
  ) { }

  ngOnInit() {
    this.subscriptions = [
      this.AuthData.getUser().subscribe((me: User) => {
        this.me = me
      }),
      this.HttpService.getOnlineUsers().subscribe(
        (users: User[]) => {
          this.UsersService.setOnlineUsers(users)
        }
      ),
      this.SocketService.listen('who').subscribe((users: User[]) => {
        this.UsersService.setOnlineUsers(users)
      })
    ]

    this.SocketService.emit('loggedIn', this.me)
    window.addEventListener('beforeunload', () => this.SocketService.emit('loggedOut', this.me))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
