/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureStatus } from "@eshg/base-api";
import { Chip, ChipProps } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function GdprProcedureStatusChip({
  status,
}: {
  status: ApiGdprProcedureStatus;
}) {
  const { t } = useTranslation("gdpr");
  return (
    <Chip variant="solid" color={gdprProcedureStatusColor[status]}>
      {t(`gdpr_procedure_summary.status.${status}`)}
    </Chip>
  );
}

const gdprProcedureStatusColor = {
  [ApiGdprProcedureStatus.Draft]: "warning",
  [ApiGdprProcedureStatus.Open]: "neutral",
  [ApiGdprProcedureStatus.InProgress]: "primary",
  [ApiGdprProcedureStatus.Closed]: "success",
  [ApiGdprProcedureStatus.Aborted]: "danger",
} as const satisfies Record<ApiGdprProcedureStatus, ChipProps["color"]>;
