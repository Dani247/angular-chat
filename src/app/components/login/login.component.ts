import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fireBase } from '../../firebase/firebase'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private route: Router) {
  }

  ngOnInit() {
    if (fireBase.isAuth) {
      this.route.navigate([''])
    }
  }

  onLoginClick = async () => {
    try {
      const user = await fireBase.logIn()
      const { accessToken } = user.credential
      const { email, photoURL, uid } = user.user
      const { username, id } = user.additionalUserInfo
      window.localStorage.setItem('accessToken', accessToken)
      window.localStorage.setItem('username', username)
      window.localStorage.setItem('photoURL', photoURL)
      window.localStorage.setItem('email', email)
      window.localStorage.setItem('uid', uid)
      window.localStorage.setItem('id', id)

      console.log('login successfull', user)
      console.log(fireBase.isAuth())
      this.route.navigate([''])
    } catch (error) {
      console.log('login failed', error)
    }
  }

}
