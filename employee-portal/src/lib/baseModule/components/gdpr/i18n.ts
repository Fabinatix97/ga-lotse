/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureStatus, ApiGdprProcedureType } from "@eshg/base-api";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

export const statusTranslation = {
  DRAFT: "Entwurf",
  OPEN: "Offen",
  IN_PROGRESS: "In Bearbeitung",
  CLOSED: "Abgeschlossen",
  ABORTED: "Abgebrochen",
} as const satisfies Record<ApiGdprProcedureStatus, string>;

export const typeTranslation = {
  RIGHT_OF_ACCESS: "Datenauskunft",
  RIGHT_TO_RECTIFICATION: "Berichtigung",
  RIGHT_TO_ERASURE: "Löschanfrage",
  RIGHT_TO_OBJECT: "Widerspruch",
} as const satisfies Record<ApiGdprProcedureType, string>;

export const gdprProcedureTypeToGdprArticle = {
  RIGHT_OF_ACCESS: `Art. 15 DSGVO`,
  RIGHT_TO_RECTIFICATION: `Art. 16 DSGVO`,
  RIGHT_TO_ERASURE: `Art. 17 DSGVO`,
  RIGHT_TO_OBJECT: `Art. 21 DSGVO`,
} as const satisfies Record<ApiGdprProcedureType, string>;

export const gdprProcedureTypeWithGdprArticle = {
  RIGHT_OF_ACCESS: `${typeTranslation.RIGHT_OF_ACCESS} (${gdprProcedureTypeToGdprArticle.RIGHT_OF_ACCESS})`,
  RIGHT_TO_RECTIFICATION: `${typeTranslation.RIGHT_TO_RECTIFICATION} (${gdprProcedureTypeToGdprArticle.RIGHT_TO_RECTIFICATION})`,
  RIGHT_TO_ERASURE: `${typeTranslation.RIGHT_TO_ERASURE} (${gdprProcedureTypeToGdprArticle.RIGHT_TO_ERASURE})`,
  RIGHT_TO_OBJECT: `${typeTranslation.RIGHT_TO_OBJECT} (${gdprProcedureTypeToGdprArticle.RIGHT_TO_OBJECT})`,
} as const satisfies Record<ApiGdprProcedureType, string>;

export const TYPE_OPTIONS = buildEnumOptions<ApiGdprProcedureType>(
  gdprProcedureTypeWithGdprArticle,
);
