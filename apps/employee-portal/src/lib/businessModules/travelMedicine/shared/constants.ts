/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureType, ApiTaskType } from "@eshg/travel-medicine-api";

export const procedureTypes = [ApiProcedureType.TmVaccinationConsultation];

export const taskTypes = [ApiTaskType.TravelMedicine];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  CERTIFICATE_FOR_HEALTH_INSURANCE: "Bescheinigung für Krankenkasse erstellt",
  VACCINATION_APPLIED: "Impfung durchgeführt",
  VACCINATION_EDIT: "Impfung korrigiert",
  PERSON_UPDATED: "Geänderte Personendaten übernommen",
  PERSON_SYNCHRONIZED: "Geänderte Personendaten synchronisiert",
  NEW_APPOINTMENT: "Termin erstellt",
  FOLLOWUP_APPOINTMENT: "Folgetermin erstellt",
  CANCEL_APPOINTMENT: "Termin abgesagt",
  REBOOK_APPOINTMENT: "Termin umgebucht",
  ANSWER_MEDICAL_HISTORY: "Anamnese ausgefüllt",
  ANSWER_INFORMATION_STATEMENT: "Aufklärungsbogen ausgefüllt",
  ADD_INFORMATION_STATEMENT: "Aufklärungsbogen hinzugefügt",
  REMOVE_INFORMATION_STATEMENT: "Aufklärungsbogen entfernt",
  RESET_INFORMATION_STATEMENT: "Aufklärungsbogen zurückgesetzt",
};
