import { Component, OnInit } from '@angular/core';

// services
import { HttpService } from '../../services/http.service'
import { SocketService } from '../../services/socket.service'

// models
import { Room } from '../../models/Room'
import { User } from '../../models/User'

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  socket: SocketService;
  private roomName: string = ''
  private loading: boolean = false
  private showCreateRoom: boolean = false

  constructor(SocketService: SocketService, private HttpService: HttpService) {
    this.socket = SocketService
  }

  ngOnInit() {
  }

  onCreateRoomClick = (): void => {
    if (this.roomName.trim().length < 1) return

    const user: User = {
      uid: window.localStorage.getItem('uid'),
      userName: window.localStorage.getItem('username'),
      picUrl: window.localStorage.getItem('photoURL')
    }

    const newRoom: Room = {
      roomId: '0',
      roomOwner: user,
      roomName: this.roomName,
      messages: [],
      onlineUsers: []
    }

    this.loading = true

    this.HttpService.createRoom(newRoom).subscribe(res => {
      console.log('room created', res)
      this.loading = false
      this.socket.emit('room-created', true)
      this.roomName = ''
      this.showCreateRoom = false
    },
      rej => {
        console.log('ERROR', rej)
        this.loading = false
      })
  }

  onShowCreateRoomClick = (): void => {
    this.roomName = ''
    this.showCreateRoom = !this.showCreateRoom
  }

  onAddRoomInputKeyPress = (e: KeyboardEvent): void => {
    console.log(e)
    if (e.key === 'Enter') {
      this.onCreateRoomClick()
    } else if (e.key === 'Escape') {
      this.onShowCreateRoomClick()
    }
  }
}
