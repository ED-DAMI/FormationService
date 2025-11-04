// src/app/forms/section-form/section-form.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Section } from '../../interfaces/formation'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-section-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './section-form.component.html',
  // Utilisation du fichier de style externe
  styleUrl: './section-form.component.css',
})
export class SectionFormComponent {
  /**
   * @Input pour recevoir l'objet Section à éditer.
   */
  @Input({ required: true }) section!: Section;

  /**
   * @Output pour émettre l'objet modifié vers le composant parent.
   * Nommé 'sectionChange' pour supporter le [(section)] (liaison bidirectionnelle).
   */
  @Output() sectionChange = new EventEmitter<Section>();

  /**
   * Méthode appelée par (ngModelChange) pour émettre la modification au parent.
   */
  onModelChange(): void {
    this.sectionChange.emit(this.section);
  }
}
