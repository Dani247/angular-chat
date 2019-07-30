import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// services
import { HttpService } from '../../services/http.service'
import { SocketService } from '../../services/socket.service'
import { AuthDataService } from '../../services/auth-data.service'
import { Room } from 'src/app/models/Room';
import { User } from 'src/app/models/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.css']
})
export class ChatsListComponent implements OnInit, OnDestroy {
  @Input() showCreateRoomClick: any
  @Input() showDeleteRoomClick: any

  socket: SocketService;
  router: Router

  private subscribers: Subscription[] = []
  private loading: boolean = false
  private roomList: Array<Room> = []

  private me: User;

  // sort booleans
  private sortByOnlineUsers: boolean = null
  private sortByRoomName: boolean = null
  private sortByRoomOwner: boolean = null
  private auth: AuthDataService;

  constructor(SocketService: SocketService, private HttpService: HttpService, router: Router, auth: AuthDataService) {
    this.auth = auth
    this.socket = SocketService
    this.router = router
  }

  ngOnInit() {
    this.loading = true
    this.subscribers = [
      //get me auth info
      this.auth.getUser().subscribe(me => this.me = me),
      // get room list
      this.HttpService.getRoomList().subscribe((res: Array<Room>) => {
        // set all current rooms
        this.roomList = res
        console.log('getRoomList', this.roomList)
      }),
      // listen to any change
      this.socket.listen('chat-list').subscribe((rooms: Array<Room>) => {
        this.roomList = rooms
      })
    ]
    this.loading = false
  }

  ngOnDestroy() {
    this.subscribers.forEach(sub => sub.unsubscribe())
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

  isMe = (uid: string): boolean => this.me.uid === uid

  deleteRoom = (roomId: string): void => {
    alert(`deleting ${roomId}`)
  }
}
