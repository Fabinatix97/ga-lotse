/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiAbstractFile } from "@eshg/employee-portal-api/businessProcedures";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Stack, Typography } from "@mui/joy";

import { FileCardWithDownload } from "@/lib/shared/components/procedures/progress-entries/FileCardWithActions";
import { useResolvedUserName } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";

interface FileAsApprovalRequestEntityProps {
  approvalRequestEntity: ApiAbstractFile;
}

export function FileAsApprovalRequestEntity({
  approvalRequestEntity,
}: FileAsApprovalRequestEntityProps) {
  return (
    <>
      <Stack spacing={1}>
        <Typography level={"body-xs"} data-testid="createdAtAndBy">
          {buildLabel(
            approvalRequestEntity.createdAt,
            useResolvedUserName(approvalRequestEntity.createdBy),
          )}
        </Typography>
        <FileCardWithDownload file={approvalRequestEntity} />
      </Stack>
    </>
  );
}

function buildLabel(date: Date, user: string) {
  return `${formatDateTime(date)}, ${user}`;
}
