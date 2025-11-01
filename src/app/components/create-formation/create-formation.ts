import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Formation, Cours, Chapitre, Section } from '../../interfaces/formation';
import { finalize, firstValueFrom } from 'rxjs';
import {FormsModule} from '@angular/forms';
import {CourseFormComponent} from '../course-form/course-form';
import {NgClass} from '@angular/common'; // Utilisation de firstValueFrom pour les Promesses

@Component({
  selector: 'app-create-formation',
  templateUrl: './create-formation.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CourseFormComponent,
    NgClass
  ],
  styleUrls: ['./create-formation.component.css']
})
export class CreateFormationComponent implements OnInit {

  // Utilisation de WritableSignal pour l'état modifiable
  newFormation: WritableSignal<Formation> = signal<Formation>({
    titre: '',
    description: '',
    niveau: 'DEBUTANT',
    image: '',
    cours: []
  });

  niveauxFormation: string[] = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'];

  selectedCoverFile: WritableSignal<File | null> = signal(null);
  coverImagePreview: WritableSignal<string | ArrayBuffer | null> = signal(null);
  isUploadingCover: WritableSignal<boolean> = signal(false);

  message: WritableSignal<string> = signal('');
  isSubmittingFormation: WritableSignal<boolean> = signal(false);

  private uploadFileApiUrl = 'http://localhost:8080/api/file/upload';
  private createFormationApiUrl = 'http://localhost:8080/api/formations';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.addCours(); // Ajoute un premier cours vide par défaut
  }

  // --- Gestion de l'image de couverture de la formation ---
  onCoverFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCoverFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.coverImagePreview.set(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedCoverFile.set(null);
      this.coverImagePreview.set(null);
    }
  }

  // --- Gestion dynamique des cours, chapitres, sections (via signal.update) ---
  addCours(): void {
    this.newFormation.update(formation => {
      const newCours: { resume: string; titre: string; chapitres: any[] } = { titre: '', resume: '', chapitres: [] };
      formation.cours!.push(newCours);
      const coursIndex = formation.cours!.length - 1;
      this.addChapitre(coursIndex); // Ajoute un chapitre par défaut
      return { ...formation }; // Retourne un nouvel objet pour déclencher la détection de changement
    });
  }

  removeCours(coursIndex: number): void {
    this.newFormation.update(formation => {
      formation.cours!.splice(coursIndex, 1);
      return { ...formation };
    });
  }

  addChapitre(coursIndex: number): void {
    this.newFormation.update(formation => {
      const newChapitre: Chapitre = { titre: '', sections: [] };
      formation.cours![coursIndex].chapitres!.push(newChapitre);
      const chapitreIndex = formation.cours![coursIndex].chapitres!.length - 1;
      this.addSection(coursIndex, chapitreIndex); // Ajoute une section par défaut
      return { ...formation };
    });
  }

  removeChapitre(coursIndex: number, chapitreIndex: number): void {
    this.newFormation.update(formation => {
      formation.cours![coursIndex].chapitres!.splice(chapitreIndex, 1);
      return { ...formation };
    });
  }

  addSection(coursIndex: number, chapitreIndex: number): void {
    this.newFormation.update(formation => {
      const newSection: Section= { titre: '', typeContenu: 'TEXTE', contenu: '' };
      formation.cours![coursIndex].chapitres![chapitreIndex].sections!.push(newSection);
      return { ...formation };
    });
  }

  removeSection(coursIndex: number, chapitreIndex: number, sectionIndex: number): void {
    this.newFormation.update(formation => {
      formation.cours![coursIndex].chapitres![chapitreIndex].sections!.splice(sectionIndex, 1);
      return { ...formation };
    });
  }

  // Méthode appelée par les composants enfants pour gérer l'upload de fichiers pour les sections
  // Cette méthode ne change pas fondamentalement, juste qu'elle manipule le signal du parent
  async onSectionFileUpload(event: { file: File, coursIndex: number, chapitreIndex: number, sectionIndex: number }): Promise<void> {
    const { file, coursIndex, chapitreIndex, sectionIndex } = event;
    const currentFormation = this.newFormation(); // Obtenez la valeur actuelle du signal

    const section = currentFormation.cours![coursIndex].chapitres![chapitreIndex].sections![sectionIndex];
    this.message.set(`Chargement du fichier pour ${section.titre || 'cette section'}...`);
    this.isUploadingCover.set(true); // Indicateur global pour les uploads de fichiers

    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
      const uploadResponse: any = await firstValueFrom(this.http.post(this.uploadFileApiUrl, formData));
      // Mettre à jour le signal en manipulant la sous-partie concernée
      this.newFormation.update(formation => {
        const targetSection = formation.cours![coursIndex].chapitres![chapitreIndex].sections![sectionIndex];
        targetSection.contenu = uploadResponse.fileUrl;
        targetSection.typeContenu = uploadResponse.fileType;
        return { ...formation }; // Retourne un nouvel objet pour la détection de changement
      });
      this.message.set(`Fichier (${uploadResponse.fileType}) uploadé avec succès pour ${section.titre}.`);
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier de section:', error);
      this.message.set('❌ Erreur lors de l\'upload du fichier de section.');
    } finally {
      this.isUploadingCover.set(false);
    }
  }


  // --- Soumission finale de la Formation ---
  async onSubmitFormation(): Promise<void> {
    this.message.set('Validation et soumission de la formation...');
    this.isSubmittingFormation.set(true);

    let currentFormation = this.newFormation(); // Obtenez la valeur actuelle du signal

    // 1. Uploader l'image de couverture si sélectionnée
    if (this.selectedCoverFile()) {
      this.message.set('Chargement de l\'image de couverture...');
      const formData = new FormData();
      formData.append('file', this.selectedCoverFile()!, this.selectedCoverFile()!.name);

      try {
        const uploadResponse: any = await firstValueFrom(this.http.post(this.uploadFileApiUrl, formData));
        this.newFormation.update(f => ({ ...f, image: uploadResponse.fileUrl })); // Mettre à jour l'image du signal
        currentFormation = this.newFormation(); // Mettre à jour la référence locale
        this.message.set('Image de couverture chargée avec succès.');
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image de couverture:', error);
        this.message.set('❌ Erreur lors de l\'upload de l\'image de couverture.');
        this.isSubmittingFormation.set(false);
        return;
      }
    }

    // 2. Soumettre la formation complète au backend
    try {
      const response = await firstValueFrom(this.http.post<Formation>(this.createFormationApiUrl, currentFormation)
        .pipe(
          finalize(() => this.isSubmittingFormation.set(false))
        ));

      console.log('Formation créée avec succès:', response);
      this.message.set('✅ Formation créée avec succès !');

      // Réinitialiser le formulaire
      this.newFormation.set({
        titre: '',
        description: '',
        niveau: 'DEBUTANT',
        image: '',
        cours: []
      });
      this.selectedCoverFile.set(null);
      this.coverImagePreview.set(null);
      this.addCours();
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      this.message.set('❌ Erreur lors de la création de la formation.');
      this.isSubmittingFormation.set(false);
    }
  }
}
