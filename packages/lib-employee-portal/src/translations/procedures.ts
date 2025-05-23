/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProcedureStatus, ApiProcedureType } from "@eshg/base-api";

export const PROCEDURE_STATUS_NAMES: Record<ApiProcedureStatus, string> = {
  [ApiProcedureStatus.Aborted]: "Abgebrochen",
  [ApiProcedureStatus.Closed]: "Geschlossen",
  [ApiProcedureStatus.Draft]: "Entwurf",
  [ApiProcedureStatus.InProgress]: "in Arbeit",
  [ApiProcedureStatus.Open]: "Offen",
} satisfies Record<ApiProcedureStatus, string>;

export const PROCEDURE_TYPE_NAMES = {
  [ApiProcedureType.RegularExamination]: "Regelkind",
  [ApiProcedureType.CanChild]: "Kann-Kind",
  [ApiProcedureType.EntryLevel]: "Eingangsstufe",
  [ApiProcedureType.Inspection]: "Begehung",
  [ApiProcedureType.DraftCitizenOfficeImport]: "Entwurf Bürgeramtsliste",
  [ApiProcedureType.DraftSchoolImport]: "Entwurf Schulliste",
  [ApiProcedureType.TmVaccinationConsultation]: "Impfberatung",
  [ApiProcedureType.MeaslesProtection]: "Masernschutzimpfung",
  [ApiProcedureType.StiProtection]: "HIV-STI-Schutz",
  [ApiProcedureType.MedicalRegistryEntry]: "Berufskartei-Eintrag",
  [ApiProcedureType.MedicalRegistryEmployeeDraft]:
    "Entwurf Berufskartei-Eintrag Mitarbeiter",
  [ApiProcedureType.MedicalRegistryCitizenDraft]:
    "Entwurf Berufskartei-Eintrag Bürger",
  [ApiProcedureType.DentalChild]: "Kind",
  [ApiProcedureType.OfficialMedicalService]: "Amtsärztlicher Dienst",
  [ApiProcedureType.MedsAbroad]: "Reisen mit Betäubungsmitteln",
} satisfies Record<ApiProcedureType, string>;
