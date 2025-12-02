import { Component, signal } from '@angular/core';
import {FormationEditorComponent} from './components/formation-editor-component/formation-editor.component';
import {Navbar} from './fragments/navbar/navbar';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FormationFront');
}
