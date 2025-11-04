// src/app/formation-editor/formation-editor.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Formation, Cours, Chapitre, Section, ContentItem } from '../interfaces/formation';

// Importation des sous-composants
import { StructureExplorerComponent } from '../structure-explorer/structure-explorer.component';

import { CourseFormComponent } from '../forms/course-form/course-form.component';
import { ChapitreFormComponent } from '../forms/chapitre-form/chapitre-form.component';
import { SectionFormComponent } from '../forms/section-form/section-form.component';
import {FormationFormComponent} from '../forms/formation-form/formation-form-component';

@Component({
  selector: 'app-formation-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StructureExplorerComponent,
    FormationFormComponent,
    CourseFormComponent,
    ChapitreFormComponent,
    SectionFormComponent,
  ],
  templateUrl: './formation-editor.component.html',
  styleUrl: './formation-editor.component.css',
})
export class FormationEditorComponent implements OnInit {
  // --- GESTION DE L'ÉTAT AVEC SIGNALS ---
  formation = signal<Formation>({} as Formation);
  selectedItem = signal<ContentItem | null>(null);
  isSaving = signal<boolean>(false);
  lastSaved = signal<Date | null>(null);

  ngOnInit(): void {
    this.loadMockFormation();
    this.selectedItem.set(this.formation());
  }

  // --- LOGIQUE DE SÉLECTION ---

  onSelectItem(item: ContentItem | null): void {
    this.selectedItem.set(item);
  }

  /**
   * CORRECTION : Méthode générique pour mettre à jour le Signal 'selectedItem'
   * avec l'objet modifié provenant d'un formulaire enfant.
   */
  onUpdateSelectedItem(updatedItem: ContentItem): void {
    this.selectedItem.set(updatedItem);
    // IMPORTANT: Pour une application réelle, il faudrait ici localiser
    // et mettre à jour l'objet 'updatedItem' dans l'arbre principal 'formation()'
    // pour que la structure explorer (colonne gauche) se mette à jour.
  }

  // --- LOGIQUE DE PERSISTANCE ---

  saveFormation(): void {
    if (this.isSaving()) return;
    this.isSaving.set(true);
    setTimeout(() => {
      console.log('Formation Saved:', this.formation());
      this.isSaving.set(false);
      this.lastSaved.set(new Date());
    }, 1500);
  }

  // --- TYPE GUARDS (inchangés) ---
  isFormation(item: ContentItem): item is Formation {
    return (item as Formation).cours !== undefined && (item as Cours).chapitres === undefined;
  }
  isCours(item: ContentItem): item is Cours {
    return (item as Cours).chapitres !== undefined && (item as Chapitre).sections === undefined;
  }
  isChapitre(item: ContentItem): item is Chapitre {
    return (item as Chapitre).sections !== undefined && (item as Section).typeContenu === undefined;
  }
  isSection(item: ContentItem): item is Section {
    return (item as Section).typeContenu !== undefined;
  }

  // --- DONNÉES MOCKÉES (inchangées) ---
  private loadMockFormation(): void {
    // ... (Données mockées) ...
    this.formation.set({
      id: 1,
      titre: 'Angular pour les Pros',
      description: 'Formation avancée sur l\'architecture Angular moderne.',
      niveau: 'Expert',
      cours: [
        {
          id: 101,
          titre: 'Cours 1: L\'ère des Standalone Components',
          resume: 'Introduction et migration vers le futur d\'Angular.',
          chapitres: [
            {
              id: 201,
              titre: 'Chapitre 1.1: Configuration Initiale',
              sections: [
                { id: 301, titre: 'Setup de Projet', typeContenu: 'TEXTE', contenu: 'Contenu texte de la première section...' },
                { id: 302, titre: 'Exemple de Vidéo', typeContenu: 'VIDEO', contenu: 'https://youtube.com/my-video-url' }
              ]
            }
          ]
        }
      ]
    });
  }
}
