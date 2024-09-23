/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiProcedureType,
  ApiTaskType,
} from "@eshg/employee-portal-api/travelMedicine";

export const procedureTypes = [ApiProcedureType.TmVaccinationConsultation];

export const taskTypes = [ApiTaskType.TravelMedicine];

export const systemProgressEntryTypeTitles: Record<string, string> = {
  CERTIFICATE_FOR_HEALTH_INSURANCE: "Bescheinigung für Krankenkasse erstellt",
  VACCINATION_APPLIED: "Impfung durchgeführt",
  VACCINATION_EDIT: "Impfung korrigiert",
};
