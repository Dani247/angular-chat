import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// services
import { HttpService } from '../../services/http.service'
import { SocketService } from '../../services/socket.service'
import { Room } from 'src/app/models/Room';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.css']
})
export class ChatsListComponent implements OnInit {
  @Input() showCreateRoomClick: any

  socket: SocketService;
  router: Router

  private loading: boolean = false
  private roomList: Array<Room> = []

  // sort booleans
  private sortByOnlineUsers: boolean = null
  private sortByRoomName: boolean = null
  private sortByRoomOwner: boolean = null

  constructor(SocketService: SocketService, private HttpService: HttpService, router: Router) {
    this.socket = SocketService
    this.router = router
  }

  ngOnInit() {
    this.loading = true
    this.HttpService.getRoomList().subscribe((res: Array<Room>) => {
      // set all current rooms
      this.roomList = res
      console.log('getRoomList', this.roomList)

      // listen to any change
      this.socket.listen('chat-list').subscribe((rooms: Array<Room>) => {
        this.roomList = rooms
      })

      this.loading = false
    })
  }

  joinRoom = (roomId): void => {
    console.log('nagitating to room ', roomId)
    this.router.navigate(['/room', roomId])
  }

  onShowCreateRoomClick = (): void => {
    this.showCreateRoomClick()
  }

  sort = (option: number): void => {
    switch (option) {
      case 0:
        this.sortByOnlineUsers = !this.sortByOnlineUsers
        this.sortByRoomName = null
        this.sortByRoomOwner = null

        if (this.sortByOnlineUsers) {
          this.roomList.sort((a, b) => a.onlineUsers.length > b.onlineUsers.length ? 1 : -1)
        } else {
          this.roomList.sort((a, b) => a.onlineUsers.length < b.onlineUsers.length ? 1 : -1)
        }
        break;
      case 1:
        this.sortByRoomName = !this.sortByRoomName
        this.sortByOnlineUsers = null
        this.sortByRoomOwner = null

        if (this.sortByRoomName) {
          this.roomList.sort((a, b) => a.roomName > b.roomName ? 1 : -1)
        } else {
          this.roomList.sort((a, b) => a.roomName < b.roomName ? 1 : -1)
        }

        break;
      case 2:
        this.sortByRoomOwner = !this.sortByRoomOwner
        this.sortByOnlineUsers = null
        this.sortByRoomName = null

        if (this.sortByRoomOwner) {
          this.roomList.sort((a, b) => a.roomOwner > b.roomOwner ? 1 : -1)
        } else {
          this.roomList.sort((a, b) => a.roomOwner > b.roomOwner ? 1 : -1)
        }
        break;
      default: break;
    }
  }
}
