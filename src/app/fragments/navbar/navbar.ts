import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink

  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true
})
export class Navbar {
  isHandset$= false;
  protected isMenuOpen=false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
