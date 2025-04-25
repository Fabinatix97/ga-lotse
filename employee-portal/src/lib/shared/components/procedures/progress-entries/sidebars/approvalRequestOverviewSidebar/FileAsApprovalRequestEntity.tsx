/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";
import { useContext } from "react";
import { isDefined } from "remeda";

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatUserName } from "@eshg/lib-portal/formatters/person";
import { ApiAbstractFile } from "@eshg/lib-procedures-api";

import { FileCardWithDownload } from "@/lib/shared/components/procedures/progress-entries/FileCardWithActions";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";

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
            formatUserName(
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
