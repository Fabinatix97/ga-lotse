/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { formatDateTime, formatUserName } from "@eshg/lib-portal";
import { ApiManualProgressEntry } from "@eshg/lib-procedures-api";

import { manualProgressEntryTitles } from "../../../config/progressEntryTypes";
import { useProgressEntriesConfig } from "../../../contexts/progressEntries";
import { FileCardWithDownload } from "../../FileCardWithActions";
import { DeletionNote } from "../../FileOrDeletionNote";

interface ProgressEntryAsApprovalRequestEntityProps {
  approvalRequestEntity: ApiManualProgressEntry;
}

export function ProgressEntryAsApprovalRequestEntity({
  approvalRequestEntity,
}: ProgressEntryAsApprovalRequestEntityProps) {
  const { resolvedUsers } =
    useProgressEntriesConfig().approvalRequestsResponse!;

  const file = approvalRequestEntity.fileReference;
  return (
    <Stack spacing={1}>
      <>
        <Typography level="body-xs" data-testid="createdAtAndBy">
          {buildLabel(
            approvalRequestEntity.createdAt,
            formatUserName(resolvedUsers[approvalRequestEntity.createdBy]),
          )}
        </Typography>
        <Typography level="title-md" data-testid="entryTitle">
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
  );
}

function buildLabel(date: Date, user: string) {
  return `${formatDateTime(date)}, ${user}`;
}
