/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";
import { useContext } from "react";
import { isDefined } from "remeda";

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatUserName } from "@eshg/lib-portal/formatters/person";
import { ApiManualProgressEntry } from "@eshg/lib-procedures-api";

import { FileCardWithDownload } from "@/lib/shared/components/procedures/progress-entries/FileCardWithActions";
import { DeletionNote } from "@/lib/shared/components/procedures/progress-entries/FileOrDeletionNote";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { manualProgressEntryTitles } from "@/lib/shared/components/procedures/progress-entries/constants";

interface ProgressEntryAsApprovalRequestEntityProps {
  approvalRequestEntity: ApiManualProgressEntry;
}

export function ProgressEntryAsApprovalRequestEntity({
  approvalRequestEntity,
}: ProgressEntryAsApprovalRequestEntityProps) {
  const { resolvedUsers } = useContext(ProgressEntriesContext).config
    .approvalRequestsResponse!;

  const file = approvalRequestEntity.fileReference;
  return (
    <>
      <Stack spacing={1}>
        <>
          <Typography level={"body-xs"} data-testid="createdAtAndBy">
            {buildLabel(
              approvalRequestEntity.createdAt,
              formatUserName(resolvedUsers[approvalRequestEntity.createdBy]),
            )}
          </Typography>
          <Typography level={"title-md"} data-testid="entryTitle">
            {
              manualProgressEntryTitles[
                approvalRequestEntity.manualProgressEntryType
              ]
            }
          </Typography>
          <Typography
            level="body-xs"
            whiteSpace="pre-wrap"
            data-testid="entryNote"
          >
            {approvalRequestEntity.note}
          </Typography>
          {isDefined(file) &&
            file.type !== "GenericFileReference" &&
            (!file.deleted ? (
              <FileCardWithDownload file={file} />
            ) : (
              <DeletionNote />
            ))}
        </>
      </Stack>
    </>
  );
}

function buildLabel(date: Date, user: string) {
  return `${formatDateTime(date)}, ${user}`;
}
