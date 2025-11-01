// src/app/interfaces/formation.ts
export interface Formation {
  id?: number;
  titre: string;
  description?: string;
  niveau?: string;
  image?: string;
  cours?: Cours[];
}

export interface Cours {
  id?: number;
  titre: string;
  resume?: string;
  chapitres?: Chapitre[];
}

export interface Chapitre {
  id?: number;
  titre: string;
  sections?: Section[];
}

export interface Section {
  id?: number;
  titre?: string;
  typeContenu: 'TEXTE' | 'VIDEO' | 'IMAGE'; // Utilisez TEXTE pour matcher l'enum Java
  contenu: string; // Texte, URL image ou URL vidéo
}
