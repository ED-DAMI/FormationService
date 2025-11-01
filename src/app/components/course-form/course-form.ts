import {Component, Input, Output, EventEmitter, signal, WritableSignal, computed, numberAttribute} from '@angular/core';
import { Cours } from '../../interfaces/formation';
import {FormsModule} from '@angular/forms';
import {ChapitreFormComponent} from '../chapitre-form/chapitre-form';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ChapitreFormComponent
  ],
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent {
  @Input({ required: true }) set cours(value: Cours) {
    this._cours.set(value);
  }
  _cours: WritableSignal<Cours> = signal<Cours>({ titre: '', resume: '', chapitres: [] });
  currentCours = computed(() => this._cours()); // Signal computed pour accéder facilement au cours

  @Input({transform: numberAttribute, required: true}) coursIndex!: number;

  @Output() remove = new EventEmitter<number>();
  @Output() addChapitre = new EventEmitter<number>();
  @Output() removeChapitre = new EventEmitter<{ coursIndex: number, chapitreIndex: number }>();
  @Output() addSection = new EventEmitter<{ coursIndex: number, chapitreIndex: number }>();
  @Output() removeSection = new EventEmitter<{ coursIndex: number, chapitreIndex: number, sectionIndex: number }>();
  @Output() sectionFileUpload = new EventEmitter<{ file: File, coursIndex: number, chapitreIndex: number, sectionIndex: number }>();


  constructor() { }

  onRemoveCours(): void {
    this.remove.emit(this.coursIndex);
  }

  onAddChapitre(): void {
    this.addChapitre.emit(this.coursIndex);
  }

  onRemoveChapitre(chapitreIndex: number): void {
    this.removeChapitre.emit({ coursIndex: this.coursIndex, chapitreIndex });
  }

  onAddSection(chapitreIndex: number): void {
    this.addSection.emit({ coursIndex: this.coursIndex, chapitreIndex });
  }

  onRemoveSection(chapitreIndex: number, sectionIndex: number): void {
    this.removeSection.emit({ coursIndex: this.coursIndex, chapitreIndex, sectionIndex });
  }

  onSectionFileUploaded(event: { file: File, chapitreIndex: number, sectionIndex: number }): void {
    this.sectionFileUpload.emit({
      file: event.file,
      coursIndex: this.coursIndex,
      chapitreIndex: event.chapitreIndex,
      sectionIndex: event.sectionIndex
    });
  }
}
