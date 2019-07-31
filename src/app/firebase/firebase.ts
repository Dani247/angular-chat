import * as firebase from 'firebase';
import { config } from './config'

class Firebase {
  private gitHubProvider;

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
}

export const fireBase = new Firebase()