/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiAbstractFile } from "@eshg/employee-portal-api/businessProcedures";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Stack, Typography } from "@mui/joy";
import { useContext } from "react";
import { isDefined } from "remeda";

import { FileCardWithDownload } from "@/lib/shared/components/procedures/progress-entries/FileCardWithActions";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { fullName } from "@/lib/shared/components/users/userFormatter";

interface FileAsApprovalRequestEntityProps {
  approvalRequestEntity: ApiAbstractFile;
}

export function FileAsApprovalRequestEntity({
  approvalRequestEntity,
}: FileAsApprovalRequestEntityProps) {
  const { resolvedUsers } = useContext(ProgressEntriesContext).config
    .approvalRequestsResponse!;

  return (
    <>
      <Stack spacing={1}>
        <Typography level={"body-xs"} data-testid="createdAtAndBy">
          {buildLabel(
            approvalRequestEntity.createdAt,
            fullName(
              isDefined(approvalRequestEntity.createdBy)
                ? resolvedUsers[approvalRequestEntity.createdBy]
                : undefined,
            ),
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
