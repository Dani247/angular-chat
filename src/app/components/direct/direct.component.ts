import { Component, OnInit, OnDestroy } from '@angular/core';

import { UsersService } from '../../services/users.service'
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthDataService } from 'src/app/services/auth-data.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { DirectRoom } from 'src/app/models/DirectRoom';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[]
  onlineUsers: User[]
  me: User

  constructor(private UsersService: UsersService, private AuthService: AuthDataService, private HttpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.subscriptions = [
      this.AuthService.getUser().subscribe((me: User) => this.me = me),
      this.UsersService.getOnlineUsers().subscribe((users: User[]) => {
        this.onlineUsers = users
      })
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  isMe = (uid: string): boolean => {
    return this.me.uid === uid
  }

  setUserClass(uid: string) {
    return {
      user: !this.isMe(uid),
      me: this.isMe(uid)
    }
  }

  openChat = (user2: User): void => {
    const newRoom: DirectRoom = {
      roomId: '0',
      user1: this.me,
      user2,
      messages: []
    }

    this.subscriptions = [
      ...this.subscriptions,
      this.HttpService.createDirectRoom(newRoom).subscribe(
        (room: DirectRoom) => this.router.navigate(['/dm', room.roomId])
      )
    ]
  }
}
