import { Component, OnInit, OnDestroy } from '@angular/core';

// services
import { HttpService } from '../../services/http.service'
import { SocketService } from '../../services/socket.service'
import { AuthDataService } from '../../services/auth-data.service'

// models
import { Room } from '../../models/Room'
import { User } from '../../models/User'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  socket: SocketService;
  roomName: string = ''
  loading: boolean = false
  showCreateRoom: boolean = false
  showDeleteRoom: boolean = false
  deletingId: string = ''
  auth: AuthDataService;
  me: User;
  subscribers: Subscription[]

  constructor(SocketService: SocketService, private HttpService: HttpService, auth: AuthDataService) {
    this.auth = auth
    this.socket = SocketService
  }

  ngOnInit() {
    this.subscribers = [
      this.auth.getUser().subscribe(me => this.me = me)
    ]
  }

  ngOnDestroy() {
    this.subscribers.forEach(sub => sub.unsubscribe())
  }

  onCreateRoomClick = (): void => {
    if (this.roomName.trim().length < 1) return

    const newRoom: Room = {
      roomId: '0',
      roomOwner: this.me,
      roomName: this.roomName,
      messages: [],
      onlineUsers: []
    }

    this.loading = true

    this.HttpService.createRoom(newRoom).subscribe(res => {
      this.loading = false
      this.roomName = ''
      this.showCreateRoom = false
    },
      rej => {
        console.log('ERROR', rej)
        this.loading = false
      })
  }

  onShowCreateRoomClick = (): void => {
    if (!this.loading) {
      this.roomName = ''
      this.showCreateRoom = !this.showCreateRoom
    }
  }

  onShowDeleteRoomClick = (id?: string): void => {
    this.deletingId = id
    if (!this.loading) this.showDeleteRoom = !this.showDeleteRoom
  }

  deleteChat = (): void => {
    this.loading = true
    this.HttpService.deleteRoom(this.deletingId).subscribe(
      () => {
        this.socket.emit('room-deleted', this.deletingId)
        this.loading = false
        this.showDeleteRoom = !this.showDeleteRoom
      },
      (error) => {
        console.error(error)
        this.loading = false
        this.showDeleteRoom = !this.showDeleteRoom
      }
    )
  }

  onAddRoomInputKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.onCreateRoomClick()
    } else if (e.key === 'Escape') {
      this.onShowCreateRoomClick()
    }
  }
}
