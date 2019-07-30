import { Injectable } from '@angular/core';
import { User } from '../models/User'
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  public _me: Subject<User> = new BehaviorSubject<User>({
    uid: window.localStorage.getItem('uid'),
    userName: window.localStorage.getItem('username'),
    picUrl: window.localStorage.getItem('photoURL'),
  });

  constructor() {
  }

  public setUser(user: User): void {
    this._me.next(user)
  }
  public getUser(): Observable<User> {
    return this._me.asObservable()
  }
}
