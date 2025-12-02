import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormationService } from '../../services/formation.service';
import { Formation } from '../../interfaces/formation';
import {FormationSelectionStateService} from '../../services/formation-selection-state-service';
// Import du composant enfant
import {FormationViewComponent} from '../../formation-view/formation-view';
// Correction: Suppression de ChangeDetection et FormationView qui ne sont pas utilisés ou incorrects
// import {ChangeDetection} from '@angular/cli/lib/config/workspace-schema';
// import {FormationView} from '../../formation-view/formation-view'; // incorrect

@Component({
  selector: 'app-formations-dashboard',
  standalone: true,
  imports: [CommonModule, FormationViewComponent],
  templateUrl: './formations-dashboard.html',
  styleUrls: ['./formations-dashboard.css']
})
export class FormationsDashboardComponent implements OnInit {

  formations: Formation[] = [];
  loading = true;
  // NOTE: Suppression de la dépendance à ChangeDetectorRef si elle n'est pas utilisée

  constructor(
    private fs: FormationService,
    private router: Router,
    private formationSelectionStateService :FormationSelectionStateService,
  ) {}

  ngOnInit(): void {
    this.fs.getFormations().subscribe({
      next: f => {
        this.formations = f;
        this.loading = false;
      },
      error: e => {
        console.error("Erreur récupération formations", e);
        this.loading = false;
      }
    });
  }

  edit(id: number) {
    let selectedFromation= this.formations.find(f=>f.id===id);

    if (selectedFromation !==undefined)
      this.formationSelectionStateService.setSelectedFormation(selectedFromation)
    else
      return;

    this.router.navigate(['/create_formation']);
  }

  create() {
    this.router.navigate(['/create_formation']);
  }

  delete(id: number) {
    if (!confirm("Supprimer cette formation ?")) return;
    this.fs.deleteFormation(id).subscribe({
      next: () => { // Correction: Utiliser un objet de configuration avec 'next'
        this.formations = this.formations.filter(f => f.id !== id);
      },
      error: (e) => {
        console.error("Erreur suppression formation", e);
      }
    });
  }


  selectedFormation: Formation | null = null;
  showFormationView = false;

  viewFormation(f: Formation) {
    this.selectedFormation=f;
    this.showFormationView = true;
  }
}
