/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedicalHistoryTemplateState } from "@eshg/travel-medicine-api";
import { ChipProps } from "@mui/joy";

export const templateStatusColors = {
  [ApiMedicalHistoryTemplateState.Final]: "success",
  [ApiMedicalHistoryTemplateState.Draft]: "neutral",
} satisfies Record<ApiMedicalHistoryTemplateState, ChipProps["color"]>;
