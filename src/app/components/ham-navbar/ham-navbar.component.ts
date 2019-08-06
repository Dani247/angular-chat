import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-ham-navbar',
  templateUrl: './ham-navbar.component.html',
  styleUrls: ['./ham-navbar.component.css']
})
export class HamNavbarComponent implements OnInit {
  showMenu: boolean = false
  isClosing: boolean = false
  animationTime: number = 200
  timeOut: ReturnType<typeof setTimeout> = null

  constructor(private _location: Location) { }

  ngOnInit() {
  }

  onShowMenuCLick = ():void => {
    this.showMenu = true
  }

  closeMenu = ():void => {
    this.isClosing = true

    this.timeOut = setTimeout(() => {
      this.showMenu = false
      this.isClosing = false
    }, this.animationTime)
  }

  menuAnimationStyles = () => ({ animation: this.isClosing ? `slideLeft ${this.animationTime}ms` : `slideRight ${this.animationTime}ms` })

  backdropAnimationStyles = () => ({ animation: this.isClosing ? `fadeOut ${this.animationTime}ms` : `fadeIn ${this.animationTime}ms` })
}
