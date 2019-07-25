import { Component, OnInit } from '@angular/core';

import { SocketService } from '../../services/socket.service'
import { HttpService } from '../../services/http.service'
import { ActivatedRoute, Params } from '@angular/router';

import { Message, ChatInfo } from '../../models/Message'
import { User } from '../../models/User'
import { Room } from 'src/app/models/Room';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  private message: string = '';
  private messages: Message[];
  private chatInfo: ChatInfo;
  private roomInfo: Room;
  private roomId: string = ''
  socket: SocketService;
  route: ActivatedRoute

  constructor(SocketService: SocketService, private HttpService: HttpService, aRoute: ActivatedRoute) {
    this.socket = SocketService
    this.messages = []
    this.route = aRoute
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.roomId = params['roomId']
    })

    this.HttpService.getRoom(this.roomId).subscribe((room: Room) => {
      this.roomInfo = room
      this.messages = room.messages
      console.log('room info', room)
    })

    this.socket.listen('msg-' + this.roomId).subscribe((msg: Message) => {
      this.roomInfo.messages.push(msg)
      console.log('new message', msg)
      // this.newMessage(msg)
    })

    // this.socket.listen('chatInfo').subscribe((info: ChatInfo) => {
    //   this.chatInfo = info
    // })

    document.getElementById('chat-input').focus()
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

  isMe = (uid: string): boolean => window.localStorage.getItem('uid') === uid
}
