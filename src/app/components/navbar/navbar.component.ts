import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fireBase } from '../../firebase/firebase'

// services
import { AuthDataService } from '../../services/auth-data.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  subscribers: Subscription[]
  userName: string
  imgUrl: string
  logOutCheck: boolean = false;

  constructor(private route: Router, private auth: AuthDataService) {
  }

  ngOnInit() {
    this.subscribers = [
      this.auth.getUser().subscribe(me => {
        this.userName = me.userName,
          this.imgUrl = me.picUrl
      })
    ]
  }

  ngOnDestroy() {
    this.subscribers.forEach(sub => sub.unsubscribe())
  }

  logOut = async () => {
    try {
      await fireBase.logOut()
      window.location.reload()
    } catch (error) {
      console.error('logout error', error)
    }
  }

  onLogOutClick = () => {
    this.logOutCheck = true
  }

  dontLogOut = () => {
    this.logOutCheck = false
  }
}
