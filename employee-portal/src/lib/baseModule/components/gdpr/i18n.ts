/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGdprProcedureStatus,
  ApiGdprProcedureType,
} from "@eshg/employee-portal-api/base";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

export const statusTranslation = {
  DRAFT: "Entwurf",
  OPEN: "Offen",
  IN_PROGRESS: "Laufend",
  CLOSED: "Abgeschlossen",
  ABORTED: "Abgebrochen",
} as const satisfies Record<ApiGdprProcedureStatus, string>;

export const typeTranslation = {
  RIGHT_TO_ERASURE: "Löschanfrage (Art. 17 DSGVO)",
  RIGHT_OF_ACCESS: "Datenauskunft (Art. 15 DSGVO)",
  RIGHT_TO_OBJECT: "Widerspruch (Art. 21 DSGVO)",
} as const satisfies Record<ApiGdprProcedureType, string>;

export const TYPE_OPTIONS =
  buildEnumOptions<ApiGdprProcedureType>(typeTranslation);
