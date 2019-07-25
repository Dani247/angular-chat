import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  readonly url: string = 'https://sockets-chat-api.herokuapp.com';

  constructor() {
    this.socket = io(this.url)
  }

  listen(eventName: string): Observable<any> {
    return new Observable(subscriber => {
      this.socket.on(eventName, data => {
        subscriber.next(data)
      })
    })
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data)
  }
}
