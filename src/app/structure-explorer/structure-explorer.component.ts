// src/app/structure-explorer/structure-explorer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Formation, Cours, Chapitre, Section, ContentItem } from '../interfaces/formation';

@Component({
  selector: 'app-structure-explorer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './structure-explorer.component.html',
  styleUrl: './structure-explorer.component.css'
})
export class StructureExplorerComponent {
  // L'objet Formation entier pour construire l'arbre
  @Input({ required: true }) formation!: Formation;

  // L'élément actuellement sélectionné (pour le style)
  @Input() currentSelectedItem: ContentItem | null = null;

  // --- ÉVÉNEMENTS ÉMIS AU PARENT (FormationEditorComponent) ---

  // Émis lorsqu'un élément est sélectionné par clic
  @Output() itemSelected = new EventEmitter<ContentItem>();

  // Émis lorsqu'un utilisateur clique sur '+' pour ajouter un enfant
  @Output() itemAdded = new EventEmitter<{ parent: ContentItem, type: 'cours' | 'chapitre' | 'section' }>();

  // Émis lorsqu'un utilisateur clique sur 'trash' pour supprimer
  @Output() itemRemoved = new EventEmitter<ContentItem>();

  /**
   * Émet l'élément sélectionné pour mise à jour dans le composant parent.
   * @param item L'élément de contenu cliqué.
   */
  onSelect(item: ContentItem): void {
    this.itemSelected.emit(item);
  }

  /**
   * Vérifie si deux éléments sont égaux (utilisé pour la mise en surbrillance).
   * @param item1 Élément courant.
   * @param item2 Élément sélectionné.
   * @returns Vrai si les IDs sont égaux.
   */
  isEqual(item1: ContentItem, item2: ContentItem | null): boolean {
    if (!item2 || !item1.id || !item2.id) return false;
    return item1.id === item2.id;
  }

  /**
   * Détermine le type de l'enfant à ajouter et émet l'événement.
   * @param parent Élément parent sur lequel l'utilisateur a cliqué '+'.
   */
  onAddItem(parent: ContentItem): void {
    let type: 'cours' | 'chapitre' | 'section';

    if (this.isFormation(parent)) type = 'cours';
    else if (this.isCours(parent)) type = 'chapitre';
    else if (this.isChapitre(parent)) type = 'section';
    else return;

    this.itemAdded.emit({ parent, type });
  }

  /**
   * Confirme et émet l'événement de suppression.
   * @param item L'élément à supprimer.
   */
  onRemoveItem(item: ContentItem): void {
    if (confirm(`Confirmez-vous la suppression de : "${item.titre}" ? Cette action est irréversible.`)) {
      this.itemRemoved.emit(item);
    }
  }

  // --- TYPE GUARDS SIMPLIFIÉS POUR LE TEMPLATE ---

  isFormation(item: any): item is Formation { return (item as Formation).cours !== undefined; }
  isCours(item: any): item is Cours { return (item as Cours).chapitres !== undefined && !this.isFormation(item); }
  isChapitre(item: any): item is Chapitre { return (item as Chapitre).sections !== undefined && !this.isCours(item); }
  isSection(item: any): item is Section { return (item as Section).typeContenu !== undefined; }
}
