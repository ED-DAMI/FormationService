import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Formation } from '../../interfaces/formation';

@Component({
  selector: 'app-formation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formation-form.component.html',
  styleUrl: './formation-form.component.css',
})
export class FormationFormComponent {
  @Input({ required: true }) formation!: Formation;


  @Output() formationChange = new EventEmitter<Formation>();

  onModelChange(): void {
    this.formationChange.emit(this.formation);
  }
}
