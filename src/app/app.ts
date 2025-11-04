import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {StructureExplorerComponent} from './structure-explorer/structure-explorer.component';
import {FormationEditorComponent} from './formation-editor-component/formation-editor.component';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,FormationEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FormationFront');
}
