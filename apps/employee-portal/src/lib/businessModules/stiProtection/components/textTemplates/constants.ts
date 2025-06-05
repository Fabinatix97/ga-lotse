/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTextTemplateContext } from "@eshg/sti-protection-api";

export const TextTemplateContextLabels = {
  [ApiTextTemplateContext.ConsultationReason]: "Konsultationsgrund",
  [ApiTextTemplateContext.ConsultationRemark]:
    "Konsultation - Allgemeine Bemerkung",
  [ApiTextTemplateContext.RapidTestsRemark]:
    "Schnelltests - Allgemeine Bemerkung",
  [ApiTextTemplateContext.DiagnosisResult]: "Diagnose - Ergebnisse",
  [ApiTextTemplateContext.LaboratoryTestsRemark]:
    "Labortests - Allgemeine Bemerkung",
  [ApiTextTemplateContext.DiagnosisRemark]: "Diagnose - Allgemeine Bemerkung",
} as const satisfies Record<ApiTextTemplateContext, string>;

export const TextTemplateContextOptions = Object.entries(
  TextTemplateContextLabels,
).map(([value, label]) => ({ label, value }));
