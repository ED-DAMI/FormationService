import { Routes } from '@angular/router';
import {FormationEditorComponent} from './components/formation-editor-component/formation-editor.component';
import {FormationsDashboardComponent} from './pages/formations-dashboard/formations-dashboard';

export const routes: Routes = [
  {
     path: "create_formation",
     component: FormationEditorComponent
  },
  {
    path:"formation-dashboard"
    ,component:FormationsDashboardComponent
  }
];
