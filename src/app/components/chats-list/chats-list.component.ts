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
  public loading: boolean = false
  public roomList: Array<Room> = []
  router: Router

  constructor(SocketService: SocketService, private HttpService: HttpService, router: Router) {
    this.socket = SocketService
    this.router = router
  }

  ngOnInit() {
    this.loading = true
    this.HttpService.getRoomList().subscribe((res: Array<Room>) => {
      // set all current rooms
      this.roomList = res
      console.log('getRoomList', res)

      // listen to any change
      this.socket.listen('chat-list').subscribe((rooms: Array<Room>) => {
        this.roomList = rooms
      })

      this.loading = false
    })
  }

  joinRoom = (roomId): void => {
    this.router.navigate(['/room', roomId])
  }

  onShowCreateRoomClick = () => {
    this.showCreateRoomClick()
  }
}
