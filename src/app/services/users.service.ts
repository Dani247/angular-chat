import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/User'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  onlineUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor() { }

  public getOnlineUsers(): Observable<User[]> {
    return this.onlineUsers.asObservable()
  }

  public setOnlineUsers(users: User[]): void {
    this.onlineUsers.next(users)
  }

  public addOnlineUser(user: User): void {
    this.onlineUsers.next([...this.onlineUsers.getValue(), user])
  }

  public removeOnlineUser(uid: string): void {
    this.onlineUsers.next(this.onlineUsers.getValue().filter(user => user.uid !== uid))
  }
}
