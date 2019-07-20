import { Component, OnInit } from '@angular/core';

import { SocketService } from '../../services/socket.service'
import { HttpService } from '../../services/http.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  private message: string;
  private messages: string[];
  socket: SocketService;

  constructor(SocketService: SocketService, private HttpService: HttpService) {
    this.socket = SocketService
    this.messages = []
  }

  ngOnInit() {
    this.socket.listen('newMsg').subscribe((msg: string) => {
      console.log(msg)
      this.newMessage(msg)
    })

    this.HttpService.getMessages().subscribe((msgs: string[]) => {
      console.log(msgs)
      this.messages = msgs
    })
  }

  newMessage = (msg: string): void => {
    this.messages.push(msg)
    console.log(this.messages)
  }

  onInputKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.socket.emit('msg', this.message)
      this.message = ''
    }
  }
}
