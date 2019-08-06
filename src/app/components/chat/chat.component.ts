import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';

import { SocketService } from '../../services/socket.service'
import { HttpService } from '../../services/http.service'
import { AuthDataService } from '../../services/auth-data.service'
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Message } from '../../models/Message'
import { User } from '../../models/User'
import { Room } from 'src/app/models/Room';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatInput', {static: true}) chatInput: ElementRef
  @ViewChild('chatFeed', {static: false}) chatFeed: ElementRef
  subscribers: Subscription[]
  message: string = '';
  messages: Message[];
  roomInfo: Room = {
    roomId: null,
    roomName: null,
    roomOwner: null,
    messages: [],
    onlineUsers: []
  };
  me: User;
  roomId: string = ''
  editingName: boolean = false
  showEmojis: boolean = false

  socket: SocketService;
  route: ActivatedRoute
  navRoute: Router

  constructor(SocketService: SocketService, private HttpService: HttpService, aRoute: ActivatedRoute, route: Router, auth: AuthDataService) {
    auth.getUser().subscribe(me => this.me = me)
    this.socket = SocketService
    this.messages = []
    this.route = aRoute
    this.navRoute = route
  }

  ngOnInit() {
    // subscribers array
    this.subscribers = [
      // get room id
      this.route.params.subscribe((params: Params) => {
        this.roomId = params['roomId']
      }),
      // get room info by id
      this.HttpService.getRoom(this.roomId).subscribe(
        (room: Room) => {
          this.roomInfo = room
          this.messages = room.messages
        },
        (err) => {
          console.log(err)
          this.navRoute.navigate(['/'])
        }
      ),
      // socket listener for room info updates
      this.socket.listen('roomInfo-' + this.roomId).subscribe(
        (data: Room) => this.roomInfo = data
      ),
      // socket listener for new room messages
      this.socket.listen('msg-' + this.roomId).subscribe(
        (msg: Message) => {
          this.roomInfo.messages.push(msg)
          this.updateScroll()
        }
      ),
      // socket listener in case the room is deleted
      this.socket.listen('deleted-' + this.roomId).subscribe(
        () => {
          alert('room deleted')
          this.navRoute.navigate(['/'])
        }
      )
    ]

    this.socket.emit('join-room', { roomId: this.roomId, user: this.me })

    window.addEventListener('beforeunload', () => this.socket.emit('leave-room', { roomId: this.roomId, user: this.me }))
    this.chatInput.nativeElement.focus()
  }

  ngOnDestroy() {
    this.subscribers.forEach(sub => {
      sub.unsubscribe()
    })

    window.removeEventListener('beforeunload', () => { })
    this.socket.emit('leave-room', { roomId: this.roomId, user: this.me })
  }

  ngAfterViewChecked() {
    this.updateScroll()
  }

  updateScroll() {
    const element = this.chatFeed.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  newMessage = (msg: Message): void => {
    this.messages.push(msg)
  }

  sendMessage = () => {
    const msg = this.message.trim()
    if (msg.length) {
      const newMessage: Message = {
        message: msg,
        user: this.me,
        roomId: this.roomId
      }

      this.socket.emit('msg', newMessage)
      this.message = ''
    }
  }

  onInputKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.sendMessage()
    }
  }

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

  isMe = (uid: string): boolean => this.me.uid === uid

  toggleEditName = (): void => {
    if (this.me.uid === this.roomInfo.roomOwner.uid) {
      this.editingName = !this.editingName
    }
  }

  onEditInputKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.editName()
    }
  }

  editName = (): void => {
    this.HttpService.editRoomName(this.roomId, this.roomInfo.roomName).subscribe(
      () => {
        this.toggleEditName()
      },
      err => console.error(err)
    )
  }

  onEmojiSelect = (e): void => {
    this.message += e.emoji.native
  }
}
