import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CreateFormationComponent} from './components/create-formation/create-formation';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, CreateFormationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FormationFront');
}
