import { Component, OnInit, OnChanges } from '@angular/core';

import { SocketService } from '../../services/socket.service'
import { HttpService } from '../../services/http.service'

import { Message, ChatInfo } from '../../models/Message'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnChanges {
  private message: string;
  private messages: Message[];
  private chatInfo: ChatInfo;
  socket: SocketService;

  constructor(SocketService: SocketService, private HttpService: HttpService) {
    this.socket = SocketService
    this.messages = []
  }

  ngOnInit() {
    this.socket.listen('newMsg').subscribe((msg: Message) => {
      this.newMessage(msg)
    })

    this.socket.listen('chatInfo').subscribe((info: ChatInfo) => {
      this.chatInfo = info
    })

    this.HttpService.getMessages().subscribe((msgs: Message[]) => {
      this.messages = msgs
    })

    this.HttpService.getChatInfo().subscribe((info: ChatInfo) => {
      this.chatInfo = info
    })

    document.getElementById('chat-input').focus()
  }

  ngOnChanges = () => {
    this.chatScrollBot()
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
    const newMessage: Message = {
      uid: window.localStorage.getItem('uid'),
      userName: window.localStorage.getItem('username'),
      message: msg,
      picUrl: window.localStorage.getItem('photoURL')
    } 

    this.socket.emit('msg', newMessage)
  }

  onInputKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.sendMessage(this.message)
      this.message = ''
    }
  }

  setMessageClass = (uid) => {
    return {
      myMessage: window.localStorage.getItem('uid') === uid,
      message: window.localStorage.getItem('uid') !== uid
    }
  }
}
