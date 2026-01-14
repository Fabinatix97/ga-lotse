/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDecayStatus,
  ApiMihStatus,
  ApiOralHygieneStatus,
  ApiOrthodonticFinding,
  ApiOrthodonticStatus,
} from "@eshg/dental-api";

import { ExaminationStatus } from "../api/models/ExaminationStatus";
import { QuadrantNumber } from "../stores/examination/types";

export const EXAMINATION_STATUS: Record<ExaminationStatus, string> = {
  OPEN: "offen",
  CLOSED: "abgeschlossen",
  NOT_PRESENT: "Nicht anwesend",
};

export const ORAL_HYGIENE_STATUS: Record<ApiOralHygieneStatus, string> = {
  [ApiOralHygieneStatus.Excellent]: "Sehr gut",
  [ApiOralHygieneStatus.Good]: "Gut",
  [ApiOralHygieneStatus.Poor]: "Schlecht",
};

export const MIH_STATUS: Record<ApiMihStatus, string> = {
  [ApiMihStatus.Mild]: "Leicht",
  [ApiMihStatus.Moderate]: "Moderat",
  [ApiMihStatus.Serious]: "Schwer",
};

export const DECAY_STATUS: Record<ApiDecayStatus, string> = {
  [ApiDecayStatus.Healthy]: "Gesund",
  [ApiDecayStatus.Restored]: "Saniert",
  [ApiDecayStatus.TreatmentRequired]: "Behandlungsbedürftig",
};

export const ORTHODONTIC_FINDINGS: Record<ApiOrthodonticFinding, string> = {
  [ApiOrthodonticFinding.AngleClassI]: "Anglekl. I",
  [ApiOrthodonticFinding.AngleClassIi]: "Anglekl. II",
  [ApiOrthodonticFinding.AngleClassIi2]: "Anglekl. II/2",
  [ApiOrthodonticFinding.AngleClassIii]: "Anglekl. III",
  [ApiOrthodonticFinding.AngleClass]: "Anglekl. ",
  [ApiOrthodonticFinding.Aplasia]: "Aplasie",
  [ApiOrthodonticFinding.BucalLingualOcclusion]: "Bucal-lingual Occlusion",
  [ApiOrthodonticFinding.Diastema]: "Diastema",
  [ApiOrthodonticFinding.AnteriorCrowding]: "Frontaler Engstand",
  [ApiOrthodonticFinding.AnteriorCrossbite]: "Frontaler Kreuzbiss",
  [ApiOrthodonticFinding.ApplianceTherapy]: "Gerätebehandlung",
  [ApiOrthodonticFinding.Habits]: "Habits",
  [ApiOrthodonticFinding.EdgeToEdgeBite]: "Kopfbiss",
  [ApiOrthodonticFinding.BilateralLateralCrossbite]:
    "Lateraler Kreuzbiss - beidseitig",
  [ApiOrthodonticFinding.UnilateralLateralCrossbite]:
    "Lateraler Kreuzbiss - einseitig",
  [ApiOrthodonticFinding.CleftLipAndPalate]: "LKG-Spalte",
  [ApiOrthodonticFinding.MidlineDeviation]: "MLV",
  [ApiOrthodonticFinding.FixedAppliance]: "Multiband",
  [ApiOrthodonticFinding.NonOcclusion]: "Nonokklusion",
  [ApiOrthodonticFinding.OpenBite]: "Offener Biss",
  [ApiOrthodonticFinding.AnteriorOpenBite]: "Offener Biss frontal",
  [ApiOrthodonticFinding.LateralOpenBite]: "Offener Biss seitlich",
  [ApiOrthodonticFinding.Crowding]: "Platzmangel",
  [ApiOrthodonticFinding.ProgenicForcedBite]: "Progener Zwangsbiss",
  [ApiOrthodonticFinding.Prognathism]: "Progenie",
  [ApiOrthodonticFinding.Pseudoprognathism]: "Pseudoprogenie",
  [ApiOrthodonticFinding.NarrowJaw]: "Schmalkiefer",
  [ApiOrthodonticFinding.Other]: "Sonstige",
  [ApiOrthodonticFinding.SupportZoneCollapse]: "Stützzoneneinbruch",
  [ApiOrthodonticFinding.DeepBite]: "Tiefer Biss",
  [ApiOrthodonticFinding.DeepBiteWithGingivalContact]:
    "Tiefer Biss mit Ging. Kont.",
  [ApiOrthodonticFinding.IncreasedSagittalOverjet]:
    "Vergr. Sagittale Frontzahnstufe",
  [ApiOrthodonticFinding.Displacement]: "Verlagerung",
};

export const ORTHODONTIC_STATUS: Record<ApiOrthodonticStatus, string> = {
  [ApiOrthodonticStatus.WithoutFindings]: "Ohne Befund",
  [ApiOrthodonticStatus.TreatmentStarted]: "Begonnen",
  [ApiOrthodonticStatus.TreatmentRequired]: "Beh. bed. Fehlstellung",
  [ApiOrthodonticStatus.TreatmentPlanned]: "Vorgesehen",
  [ApiOrthodonticStatus.TreatmentCompleted]: "Abgeschlossen",
  [ApiOrthodonticStatus.TreatmentCanceled]: "Abgebrochen",
  [ApiOrthodonticStatus.UnderObservation]: "In Beobachtung",
};

export const INVALID_EXAMINATION_RESULT_VALIDATION_ERROR =
  "Es wurden fehlerhafte Befunde eingetragen. Bitte korrigieren Sie die markierten Befunde und versuchen es danach erneut.";

export const TOOTH_DIAGNOSES = {
  S: "Naturgesund",
  I: "Initialkaries",
  D: "Kariös",
  F: "Gefüllt",
  M: "Extrahiert wegen Karies",
  X: "Sonstige Extraktion",
  Z: "Zerstört",
  T: "Trauma",
  H: "Hypoplasie",
  O: "Fistel",
  V: "Versiegelt",
  N: "Keine Diagnose",
  U: "Fehlend",
  K: "Überkront",
  E: "Trepaniert",
  W: "Wurzelrest",
  P: "Platzhalter",
  A: "Nichtanlage",
  DA: "Doppelte Anlage",
  FA: "Formanomalie",
  ID: "Im Durchbruch",
  INS: "Insuffizient",
  LÜ: "Lückenschluss",
  RET: "Retinierter Zahn",
  ZA: "Zapfenzahn",
};

export const QUADRANT_NAMES: Record<QuadrantNumber, string> = {
  Q1: "Oberkiefer rechts",
  Q2: "Oberkiefer links",
  Q3: "Unterkiefer links",
  Q4: "Unterkiefer rechts",
};
