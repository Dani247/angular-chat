import { Component, OnInit, OnDestroy } from '@angular/core';

import { SocketService } from '../../services/socket.service'
import { HttpService } from '../../services/http.service'
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Message, ChatInfo } from '../../models/Message'
import { User } from '../../models/User'
import { Room } from 'src/app/models/Room';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy {
  private message: string = '';
  private messages: Message[];
  private chatInfo: ChatInfo;
  private roomInfo: Room = {
    roomId: null,
    roomName: null,
    roomOwner: null,
    messages: [],
    onlineUsers: []
  };
  private me: User = {
    uid: window.localStorage.getItem('uid'),
    userName: window.localStorage.getItem('username'),
    picUrl: window.localStorage.getItem('photoURL')
  }
  private roomId: string = ''

  socket: SocketService;
  route: ActivatedRoute
  navRoute: Router

  constructor(SocketService: SocketService, private HttpService: HttpService, aRoute: ActivatedRoute, route: Router) {
    this.socket = SocketService
    this.messages = []
    this.route = aRoute
    this.navRoute = route
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.roomId = params['roomId']
    })

    this.HttpService.getRoom(this.roomId).subscribe((room: Room) => {
      this.roomInfo = room
      this.messages = room.messages
    },
      (err) => {
        console.log(err)
        this.navRoute.navigate(['/'])
      })

    this.socket.listen('roomInfo-' + this.roomId).subscribe(
      (data: Room) => this.roomInfo = data
    )

    this.socket.listen('msg-' + this.roomId).subscribe((msg: Message) => {
      this.roomInfo.messages.push(msg)
      console.log('new message', msg)
      // this.newMessage(msg)
    })

    this.socket.emit('join-room', { roomId: this.roomId, user: this.me })

    window.addEventListener('beforeunload', () => this.socket.emit('leave-room', { roomId: this.roomId, user: this.me }))

    document.getElementById('chat-input').focus()
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', () => { })
    this.socket.emit('leave-room', { roomId: this.roomId, user: this.me })
  }

  chatScrollBot = () => {
    const scroll = document.getElementById("chatFeed");
    scroll.scrollTop = scroll.scrollHeight
  }

  newMessage = (msg: Message): void => {
    this.messages.push(msg)
    console.log(this.messages)
  }

  sendMessage = (msg: string) => {
    const user: User = {
      uid: window.localStorage.getItem('uid'),
      userName: window.localStorage.getItem('username'),
      picUrl: window.localStorage.getItem('photoURL')
    }

    const newMessage: Message = {
      message: this.message,
      user,
      roomId: this.roomId
    }

    console.log('sending message', newMessage)

    this.socket.emit('msg', newMessage)
  }

  onInputKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.sendMessage(this.message)
      this.message = ''
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
}
