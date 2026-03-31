export const MODULES = [
  // Pflichtmodule (4. Semester)
  { id: 'db2', name: 'Datenbanken 2', short: 'DB2', credits: 5, category: 'pflicht', semester: 4, color: '#4F46E5' },
  { id: 'swt2', name: 'Softwaretechnik 2', short: 'SWT2', credits: 5, category: 'pflicht', semester: 4, color: '#7C3AED' },
  { id: 'infosec', name: 'Informationssicherheit', short: 'InfoSec', credits: 5, category: 'pflicht', semester: 4, color: '#DC2626' },
  { id: 'ccn', name: 'Kommunikation & Rechnernetze', short: 'CCN', credits: 5, category: 'pflicht', semester: 4, color: '#2563EB' },
  { id: 'ki', name: 'Künstliche Intelligenz', short: 'KI', credits: 5, category: 'pflicht', semester: 4, color: '#059669' },

  // Aus dem 5. Semester
  { id: 'itrecht', name: 'IT-Recht', short: 'IT-Recht', credits: 2.5, category: 'semester5', semester: 5, color: '#D97706' },
  { id: 'infges', name: 'Informatik & Gesellschaft', short: 'Inf&Ges', credits: 2.5, category: 'semester5', semester: 5, color: '#CA8A04' },
  { id: 'seminar', name: 'Seminar Inhalt', short: 'Seminar', credits: 2.5, category: 'semester5', semester: 5, color: '#EA580C' },

  // Wahlpflicht Katalog 1
  { id: 'koopsys', name: 'Kooperative Systeme', short: 'KoopSys', credits: 5, category: 'wahl1', semester: 6, color: '#0891B2' },
  { id: 'itsm', name: 'IT-Service-Management', short: 'ITSM', credits: 5, category: 'wahl1', semester: 6, color: '#0D9488' },

  // Wahlpflicht Katalog 2
  { id: 'gem', name: 'Gestaltung mit elektronischen Medien', short: 'GemM', credits: 5, category: 'wahl2', semester: 6, color: '#DB2777' },
  { id: 'datamining', name: 'Data Mining', short: 'DataMining', credits: 5, category: 'wahl2', semester: 6, color: '#9333EA' },

  // Projektarbeit
  { id: 'projekt', name: 'Projektarbeit', short: 'Projekt', credits: 15, category: 'projekt', semester: 7, color: '#F59E0B' },
];

export const SEMESTER_DATES = {
  start: '2026-03-01',
  end: '2026-08-31',
  vorlesungStart: '2026-04-06',
  vorlesungEnd: '2026-07-31',
  pruefungEnd: '2026-09-05',
  breaks: [
    { name: 'Ostern', start: '2026-04-06', end: '2026-04-10' },
    { name: 'Pfingsten', start: '2026-05-25', end: '2026-05-26' },
  ],
};

export const CATEGORY_LABELS = {
  pflicht: 'Pflichtmodule',
  semester5: '5. Semester (nachgeholt)',
  wahl1: 'Wahlpflicht Katalog 1',
  wahl2: 'Wahlpflicht Katalog 2',
  projekt: 'Projektarbeit',
};

export const TOTAL_CREDITS_DONE = 90;
export const TOTAL_CREDITS_NEEDED = 150;
