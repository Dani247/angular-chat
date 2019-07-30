import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fireBase } from '../../firebase/firebase'
import { AuthDataService } from '../../services/auth-data.service'
import { User } from '../../models/User'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private route: Router, private auth: AuthDataService) {
  }

  ngOnInit() {
    this.auth._me.subscribe(
      (me) => {
        if (me.uid) {
          this.route.navigate([''])
        }
      }
    )
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

      const newUser: User = {
        uid,
        userName: username,
        picUrl: photoURL
      }

      this.auth.setUser(newUser)


      console.log('login successfull', user)
      console.log(fireBase.isAuth())
      this.route.navigate([''])
    } catch (error) {
      console.log('login failed', error)
    }
  }

}
