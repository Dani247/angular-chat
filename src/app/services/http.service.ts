import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  readonly url: string = 'http://localhost:3001';

  constructor(private http: HttpClient) {

  }

  getMessages = () => this.http.get(this.url + '/getMessages')
}