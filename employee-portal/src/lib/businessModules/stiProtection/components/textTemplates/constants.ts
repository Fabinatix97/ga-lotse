/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// TODO: Replace with OpenApi type when available
export enum ApiTextTemplateContext {
  ConsultationReason = "CONSULTATION_REASON",
  Consultation = "CONSULTATION",
  RapidTests = "RAPID_TESTS",
  Diagnosis = "DIAGNOSIS",
  LaboratoryTests = "LABORATORY_TESTS",
}
export interface ApiTextTemplate {
  name: string;
  text: string;
  context: ApiTextTemplateContext;
}

export const TextTemplateContextLabels = {
  [ApiTextTemplateContext.ConsultationReason]: "Konsultationsgrund",
  [ApiTextTemplateContext.Consultation]: "Konsultation",
  [ApiTextTemplateContext.RapidTests]: "Schnelltests",
  [ApiTextTemplateContext.Diagnosis]: "Diagnose",
  [ApiTextTemplateContext.LaboratoryTests]: "Labortests",
} as const satisfies Record<ApiTextTemplateContext, string>;

export const TextTemplateContextOptions = Object.entries(
  TextTemplateContextLabels,
).map(([key, value]) => ({
  label: value,
  value: key as ApiTextTemplateContext,
}));

export const ExampleTextTemplates = [
  {
    name: "Genitale Infektionen ",
    context: ApiTextTemplateContext.ConsultationReason,
    text: `Nein, Mann! Ich will noch nicht gehen.
Ich will: $etwas`,
  },
  {
    name: "PAP",
    context: ApiTextTemplateContext.ConsultationReason,
    text: `PAP: $`,
  },
  {
    name: "Syphilis-seronarbe Bestätigungstest bei positiv",
    context: ApiTextTemplateContext.ConsultationReason,
    text: `Syphilis-werte: $`,
  },
  {
    name: "Gynäkologische Vorsorge",
    context: ApiTextTemplateContext.Consultation,
    text: `Vagina: $JaOderNein
Urinanalyse: $Uneindeutig`,
  },
  {
    name: "Konsultation - Standardvorlage 1",
    context: ApiTextTemplateContext.RapidTests,
    text: `Wie heißt du? $NAME
Was ist dein Quest? $QUEST
Wie hoch ist die Fluggeschwindigkeit einer unbeladenen Schwalbe? $AHHHHH`,
  },
  {
    name: "HIV-Bestätigungsdiagnostik ",
    context: ApiTextTemplateContext.Diagnosis,
    text: `HIV: $Nein`,
  },
  {
    name: "HIV & Syphilis Basis ",
    context: ApiTextTemplateContext.LaboratoryTests,
    text: `HIV & Syphilis: $`,
  },
  {
    name: "Genitale Infektionen ",
    context: ApiTextTemplateContext.Consultation,
    text: `Nein, Mann! Ich will noch nicht gehen.
Ich will: $etwas`,
  },
  {
    name: "PAP",
    context: ApiTextTemplateContext.Consultation,
    text: `PAP: $`,
  },
  {
    name: "Syphilis-seronarbe Bestätigungstest bei positiv",
    context: ApiTextTemplateContext.Consultation,
    text: `Syphilis-werte: $`,
  },
  {
    name: "Konsultation - Standardvorlage 1",
    context: ApiTextTemplateContext.Consultation,
    text: `Wer bist du? $NAME
Was ist dein Quest? $QUEST
Wie hoch ist die Fluggeschwindigkeit einer unbeladenen Schwalbe? $AHHHHH`,
  },
  {
    name: "HIV-Bestätigungsdiagnostik",
    context: ApiTextTemplateContext.Consultation,
    text: `HIV: $Nein`,
  },
  {
    name: "HIV & Syphilis Basis",
    context: ApiTextTemplateContext.Consultation,
    text: `HIV & Syphilis: $`,
  },
] as const satisfies ApiTextTemplate[];
