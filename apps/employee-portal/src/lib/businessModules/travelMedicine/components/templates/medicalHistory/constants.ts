/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChipProps } from "@mui/joy";

import { ApiMedicalHistoryTemplateState } from "@eshg/travel-medicine-api";

export const templateStatusColors = {
  [ApiMedicalHistoryTemplateState.Final]: "success",
  [ApiMedicalHistoryTemplateState.Draft]: "neutral",
} satisfies Record<ApiMedicalHistoryTemplateState, ChipProps["color"]>;
