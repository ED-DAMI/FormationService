// src/app/components/section-form/section-form.component.ts
import {Component, Input, Output, EventEmitter, signal, WritableSignal, computed, numberAttribute} from '@angular/core';
import { Section } from '../../interfaces/formation';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section-form',
  templateUrl: './section-form.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./section-form.component.css']
})
export class SectionFormComponent {
  // maintenant on reçoit coursIndex également (important pour l'emission du upload)
  @Input({ required: true }) set section(value: Section) {
    // copie défensive pour éviter aliasing
    this._section.set({ ...value });
  }
  @Input({transform: numberAttribute, required: true}) coursIndex!: number;
  @Input({ required: true }) chapitreIndex!: number;
  @Input({ required: true }) sectionIndex!: number;

  @Output() remove = new EventEmitter<number>();
  @Output() fileUpload = new EventEmitter<{ file: File, coursIndex: number, chapitreIndex: number, sectionIndex: number }>();
  @Output() sectionChange = new EventEmitter<{ section: Section, coursIndex: number, chapitreIndex: number, sectionIndex: number }>();

  _section: WritableSignal<Section> = signal<Section>({ titre: '', typeContenu: 'TEXTE', contenu: '' });
  currentSection = computed(() => this._section());

  typeContenuOptions: ('TEXTE' | 'VIDEO' | 'IMAGE')[] = ['TEXTE', 'IMAGE', 'VIDEO'];

  selectedFile: WritableSignal<File | null> = signal(null);
  filePreview: WritableSignal<string | ArrayBuffer | null> = signal(null);

  constructor() { }

  // notifier le parent des changements du champ
  emitSectionChange() {
    this.sectionChange.emit({
      section: { ...this._section() },
      coursIndex: this.coursIndex,
      chapitreIndex: this.chapitreIndex,
      sectionIndex: this.sectionIndex
    });
  }

  onRemoveSection(): void {
    this.remove.emit(this.sectionIndex);
  }

  onTypeContenuChange(): void {
   // const value = (event.target as HTMLSelectElement).value as Section['typeContenu'];
   // this._section.update(s => ({ ...s, contenu: '', typeContenu: value }));
    this.selectedFile.set(null);
    this.filePreview.set(null);
    this.emitSectionChange();
  }

  onTitreChange(value: string): void {
    this._section.update(s => ({ ...s, titre: value }));
    this.emitSectionChange();
  }

  onContenuChange(value: string): void {
    this._section.update(s => ({ ...s, contenu: value }));
    this.emitSectionChange();
  }

  onFileSelected(event: any): void {
    const file: File = event.target?.files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview.set(reader.result);
      };
      reader.readAsDataURL(file);

      // émettre le fichier (pas le signal) vers le parent avec tous les index
      this.fileUpload.emit({
        file,
        coursIndex: this.coursIndex,
        chapitreIndex: this.chapitreIndex,
        sectionIndex: this.sectionIndex
      });

    } else {
      this.selectedFile.set(null);
      this.filePreview.set(null);
    }
  }
}
