/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiManualProgressEntry } from "@eshg/employee-portal-api/businessProcedures";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { FileCardWithDownload } from "@/lib/shared/components/procedures/progress-entries/FileCardWithActions";
import { DeletionNote } from "@/lib/shared/components/procedures/progress-entries/FileOrDeletionNote";
import { manualProgressEntryTitles } from "@/lib/shared/components/procedures/progress-entries/constants";
import { buildName } from "@/lib/shared/components/procedures/progress-entries/helper";

interface ProgressEntryAsApprovalRequestEntityProps {
  approvalRequestEntity: ApiManualProgressEntry;
}

export function ProgressEntryAsApprovalRequestEntity({
  approvalRequestEntity,
}: ProgressEntryAsApprovalRequestEntityProps) {
  const file = approvalRequestEntity.fileReference;
  return (
    <>
      <Stack spacing={1}>
        <>
          <Typography level={"body-xs"} data-testid="createdAtAndBy">
            {buildLabel(
              approvalRequestEntity.createdAt,
              buildName(
                approvalRequestEntity.createdByUserFirstName,
                approvalRequestEntity.createdByUserLastName,
              ),
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
