import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fireBase } from '../../firebase/firebase'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private userName: string = window.localStorage.getItem('username');
  private imgUrl: string = window.localStorage.getItem('photoURL');
  private logOutCheck: boolean = false;

  constructor(private route: Router) { }

  ngOnInit() {
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
