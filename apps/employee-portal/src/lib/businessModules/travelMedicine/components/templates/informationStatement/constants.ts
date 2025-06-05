/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChipProps } from "@mui/joy";

import { ApiInformationStatementTemplateState } from "@eshg/travel-medicine-api";

export const templateStatusColors = {
  [ApiInformationStatementTemplateState.Final]: "success",
  [ApiInformationStatementTemplateState.Draft]: "neutral",
} satisfies Record<ApiInformationStatementTemplateState, ChipProps["color"]>;
