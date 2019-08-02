import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { DirectRoom } from 'src/app/models/DirectRoom';
import { AuthDataService } from 'src/app/services/auth-data.service';
import { User } from 'src/app/models/User';
import { Message } from 'src/app/models/Message';
import { SocketService } from 'src/app/services/socket.service';
import { Room } from 'src/app/models/Room';

@Component({
  selector: 'app-direct-chat',
  templateUrl: './direct-chat.component.html',
  styleUrls: ['./direct-chat.component.css']
})
export class DirectChatComponent implements OnInit, OnDestroy {
  roomId: string
  roomInfo: DirectRoom = {
    roomId: '0',
    user1: null,
    user2: null,
    messages: []
  }
  me: User
  user2: User = {
    uid: '0',
    userName: '...',
    picUrl: '.'
  }
  subscriptions: Subscription[]
  showEmojis: boolean = false
  message: string = '';
  loading: boolean = true

  constructor(
    private Router: Router,
    private aRoute: ActivatedRoute,
    private HttpService: HttpService,
    private AuthService: AuthDataService,
    private SocketService: SocketService
  ) { }

  ngOnInit() {
    this.subscriptions = [
      this.AuthService.getUser().subscribe((me: User) => this.me = me),
      this.aRoute.params.subscribe(params => this.roomId = params.roomId),
      this.HttpService.getDirectRoom(this.roomId).subscribe(
        (room: DirectRoom) => {
          this.roomInfo = room
          this.user2 = this.roomInfo.user1.uid === this.me.uid ? this.roomInfo.user2 : this.roomInfo.user1
        }
      ),
      // socket listener for new room messages
      this.SocketService.listen('directMsg-' + this.roomId).subscribe(
        (msg: Message) => {
          this.roomInfo.messages.push(msg)
          this.updateScroll()
        }
      ),
      // socket listener in case the room is deleted
      this.SocketService.listen('deleted-' + this.roomId).subscribe(
        () => {
          alert('room deleted')
          this.Router.navigate(['/'])
        }
      )
    ]

    this.loading = false
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  ngAfterViewChecked() {
    this.updateScroll()
  }

  updateScroll() {
    let element = document.getElementById("chatFeed");
    element.scrollTop = element.scrollHeight;
  }

  sendMessage = () => {
    const msg = this.message.trim()
    if (msg.length) {
      const newMessage: Message = {
        message: msg,
        user: this.me,
        roomId: this.roomId
      }

      this.SocketService.emit('directMsg', newMessage)
      this.message = ''
    }
  }

  onInputKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.sendMessage()
    }
  }

  isMe = (uid: string): boolean => this.me.uid === uid

  setSideClass = (uid: string) => {
    return {
      messageContent: true,
      messageContentRight: this.isMe(uid)
    }
  }

  setMessageClass = (uid: string) => {
    return {
      myMessage: this.isMe(uid),
      message: !this.isMe(uid)
    }
  }

  onEmojiSelect = (e): void => {
    this.message += e.emoji.native
  }
}
