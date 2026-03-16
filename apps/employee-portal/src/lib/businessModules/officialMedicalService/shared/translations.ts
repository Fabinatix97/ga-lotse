/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal";
import {
  ApiDocumentStatus,
  ApiMedicalOpinionResult,
  ApiMedicalOpinionStatus,
  ApiOmsAssessmentResult,
  ApiOmsAssessmentStatus,
  ApiOmsAssessmentType,
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

export const NAMES_ASSESSMENT_TYPE: EnumMap<ApiOmsAssessmentType> = {
  [ApiOmsAssessmentType.Statement]: "Stellungnahme",
  [ApiOmsAssessmentType.ExpertOpinion]: "Gutachten",
};

export const NAMES_ASSESSMENT_STATUS: EnumMap<ApiOmsAssessmentStatus> = {
  [ApiOmsAssessmentStatus.Open]: "In Arbeit",
  [ApiOmsAssessmentStatus.Finished]: "Fertig",
  [ApiOmsAssessmentStatus.Published]: "Fertig - Übermittelt",
};

export const NAMES_ASSESSMENT_RESULT: EnumMap<ApiOmsAssessmentResult> = {
  [ApiOmsAssessmentResult.Positive]: "Positiv",
  [ApiOmsAssessmentResult.Negative]: "Negativ",
  [ApiOmsAssessmentResult.Undetermined]: "Unbestimmt",
};
