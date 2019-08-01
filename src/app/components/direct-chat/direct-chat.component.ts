import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { DirectRoom } from 'src/app/models/DirectRoom';
import { AuthDataService } from 'src/app/services/auth-data.service';
import { User } from 'src/app/models/User';
import { Message } from 'src/app/models/Message';

@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat.component.html',
  styleUrls: ['./direct-chat.component.css']
})
export class DirectChatComponent implements OnInit, OnDestroy {
  roomId: string
  roomInfo: DirectRoom
  me: User
  subscriptions: Subscription[]
  showEmojis: boolean = false
  message: string = '';
  messages: Message[];

  constructor(private aRoute: ActivatedRoute, private HttpService: HttpService, private AuthService: AuthDataService) { }

  ngOnInit() {
    this.subscriptions = [
      this.AuthService.getUser().subscribe((me: User) => this.me = me),
      this.aRoute.params.subscribe(params => this.roomId = params.roomId),
      this.HttpService.getDirectRoom(this.roomId).subscribe(
        (room: DirectRoom) => this.roomInfo = room
      )
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  userOne = () => {
    console.log(this.roomInfo)
    return this.me.uid === this.roomInfo.user1.uid
  }

}
