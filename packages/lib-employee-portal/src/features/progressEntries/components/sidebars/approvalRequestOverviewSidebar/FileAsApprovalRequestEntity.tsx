/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { formatDateTime, formatUserName } from "@eshg/lib-portal";
import { ApiAbstractFile } from "@eshg/lib-procedures-api";

import { useProgressEntriesConfig } from "../../../contexts/progressEntries";
import { FileCardWithDownload } from "../../FileCardWithActions";

interface FileAsApprovalRequestEntityProps {
  approvalRequestEntity: ApiAbstractFile;
}

export function FileAsApprovalRequestEntity({
  approvalRequestEntity,
}: FileAsApprovalRequestEntityProps) {
  const { resolvedUsers } =
    useProgressEntriesConfig().approvalRequestsResponse!;

  return (
    <Stack spacing={1}>
      <Typography level="body-xs" data-testid="createdAtAndBy">
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
  );
}

function buildLabel(date: Date, user: string) {
  return `${formatDateTime(date)}, ${user}`;
}
