import * as firebase from 'firebase';
import { config } from './config'

class Firebase {
  private gitHubProvider;
  private auth: boolean = false;

  constructor() {
    firebase.initializeApp(config)
    this.gitHubProvider = new firebase.auth.GithubAuthProvider()
  }

  public logIn = async (): Promise<any> => {
    return firebase.auth().signInWithPopup(this.gitHubProvider)
  }

  public logOut = async (): Promise<any> => {
    window.localStorage.clear()
    return firebase.auth().signOut()
  }

  public isAuth = (): boolean => {
    const token = window.localStorage.getItem('accessToken')
    return token ? true : false
  }
}

export const fireBase = new Firebase()