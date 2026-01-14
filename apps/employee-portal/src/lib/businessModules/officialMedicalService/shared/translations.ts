/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal";
import {
  ApiDocumentStatus,
  ApiMedicalOpinionResult,
  ApiMedicalOpinionStatus,
  ApiWaitingStatus,
} from "@eshg/official-medical-service-api";

export const STATUS_NAMES_DOCUMENT_STATUS: EnumMap<ApiDocumentStatus> = {
  [ApiDocumentStatus.Accepted]: "Akzeptiert",
  [ApiDocumentStatus.Missing]: "Fehlt",
  [ApiDocumentStatus.Rejected]: "Nachreichen",
  [ApiDocumentStatus.Submitted]: "Zu prüfen",
};

export const STATUS_NAMES_MEDICAL_OPINION_STATUS: EnumMap<ApiMedicalOpinionStatus> =
  {
    [ApiMedicalOpinionStatus.InProgress]: "In Arbeit",
    [ApiMedicalOpinionStatus.Accomplished]: "Fertig",
  };

export const STATUS_NAMES_MEDICAL_OPINION_RESULT: EnumMap<ApiMedicalOpinionResult> =
  {
    [ApiMedicalOpinionResult.Positive]: "Positives Ergebnis",
    [ApiMedicalOpinionResult.Negative]: "Negatives Ergebnis",
    [ApiMedicalOpinionResult.NoValuation]: "Keine Bewertung",
  };

export const WAITING_STATUS_VALUES: EnumMap<ApiWaitingStatus> = {
  [ApiWaitingStatus.WaitingForConsultation]: "Wartet",
  [ApiWaitingStatus.InConsultation]: "Im Gespräch",
  [ApiWaitingStatus.Done]: "Fertig",
};
