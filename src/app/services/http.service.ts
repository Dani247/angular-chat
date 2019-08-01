import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/Room';

import { environment } from '../../environments/environment'
import { User } from '../models/User';
import { DirectRoom } from '../models/DirectRoom';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  readonly url: string = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  getRoom = (roomId: string) => this.http.get(this.url + '/room/' + roomId)
  getChatInfo = () => this.http.get(this.url + '/chatinfo')

  createRoom = (room: Room) => this.http.post(this.url + '/room', room, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  getRoomList = (): Observable<Room[]> => this.http.get<Room[]>(this.url + '/rooms')

  deleteRoom = (roomId: string) => this.http.delete(this.url + '/room/' + roomId)

  editRoomName = (roomId: string, roomName: string) => this.http.patch(this.url + '/roomname/' + roomId, { roomName })

  getOnlineUsers = (): Observable<User[]> => this.http.get<User[]>(this.url + '/who')

  createDirectRoom = (newRooom: DirectRoom): Observable<DirectRoom> => this.http.post<DirectRoom>(this.url + '/dmroom', newRooom)

  getDirectRoom = (roomId: string): Observable<DirectRoom> => this.http.get<DirectRoom>(this.url + '/dmroom/' + roomId)
}