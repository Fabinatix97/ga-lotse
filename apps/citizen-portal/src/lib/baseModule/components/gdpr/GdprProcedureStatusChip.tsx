/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

import { ApiGdprProcedureStatus } from "@eshg/base-api";

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
  [ApiGdprProcedureStatus.InProgress]: "primary",
  [ApiGdprProcedureStatus.Closed]: "success",
  [ApiGdprProcedureStatus.Aborted]: "danger",
} as const satisfies Record<ApiGdprProcedureStatus, ChipProps["color"]>;
