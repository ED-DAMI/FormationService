import { Component, Input, Output, EventEmitter, signal, WritableSignal, computed } from '@angular/core';
import { Chapitre } from '../../interfaces/formation';
import {SectionFormComponent} from '../section-form/section-form';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chapitre-form',
  templateUrl: './chapitre-form.component.html',
  standalone: true,
  imports: [
    SectionFormComponent,
    FormsModule
  ],
  styleUrls: ['./chapitre-form.component.css']
})
export class ChapitreFormComponent {
  @Input({ required: true }) set chapitre(value: Chapitre) {
    this._chapitre.set(value);
  }
  _chapitre: WritableSignal<Chapitre> = signal<Chapitre>({ titre: '', sections: [] });
  currentChapitre = computed(() => this._chapitre());

  @Input({ required: true }) coursIndex!: number;
  @Input({ required: true }) chapitreIndex!: number;

  @Output() remove = new EventEmitter<number>();
  @Output() addSection = new EventEmitter<number>();
  @Output() removeSection = new EventEmitter<{ chapitreIndex: number, sectionIndex: number }>();
  @Output() sectionFileUpload = new EventEmitter<{ file: File, chapitreIndex: number, sectionIndex: number }>();

  constructor() { }

  onRemoveChapitre(): void {
    this.remove.emit(this.chapitreIndex);
  }

  onAddSection(): void {
    this.addSection.emit(this.chapitreIndex);
  }

  onRemoveSection(sectionIndex: number): void {
    this.removeSection.emit({ chapitreIndex: this.chapitreIndex, sectionIndex });
  }

  onSectionFileUploaded(event: { file: File, sectionIndex: number }): void {
    this.sectionFileUpload.emit({
      file: event.file,
      chapitreIndex: this.chapitreIndex,
      sectionIndex: event.sectionIndex
    });
  }
}
