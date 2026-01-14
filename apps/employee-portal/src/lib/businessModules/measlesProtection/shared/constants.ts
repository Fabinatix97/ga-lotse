/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureType, ApiTaskType } from "@eshg/measles-protection-api";

export const procedureTypes = [ApiProcedureType.MeaslesProtection];

export const taskTypes = [ApiTaskType.MeaslesProtection];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  CASE_STATUS_CHANGED: "Bearbeitungsstand geändert",
  PROOF_SUBMITTED: "Nachweisvorlage eingetragen",
  MONETARY_FINE_ISSUED: "Bußgeld erteilt",
  ACCESS_RESTRICTION_ISSUED: "Betretungsverbot erteilt",
  ACCESS_RESTRICTION_UPDATED: "Betretungsverbot aktualisiert",
  PROOF_REQUEST_LETTER_SAVED: "Aufforderung zur Nachweisvorlage erstellt",
  APPOINTMENT_BOOKED: "Termin gebucht",
  APPOINTMENT_REBOOKED: "Termin geändert",
  APPOINTMENT_DELETED: "Termin gelöscht",
  CLOSED_BECAUSE_VACCINATION_FOUND_IN_SCHOOL_ENTRY:
    "Vollständige Masernimpfung aus ESU-Fachverfahren bekannt",
};
