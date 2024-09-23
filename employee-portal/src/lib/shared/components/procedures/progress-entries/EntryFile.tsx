/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProgressEntryReferenceFilePair } from "@eshg/employee-portal-api/businessProcedures";
import { Box } from "@mui/joy";
import { isDefined } from "remeda";

import { FileOrDeletionNote } from "@/lib/shared/components/procedures/progress-entries/FileOrDeletionNote";

export function EntryFile(props: {
  progressEntryReferenceFilePair: ApiProgressEntryReferenceFilePair | undefined;
}) {
  if (!isDefined(props.progressEntryReferenceFilePair)) {
    return null;
  }

  const { progressEntryId, file } = props.progressEntryReferenceFilePair;
  return (
    <Box display="flex" justifyContent="flex-start">
      <FileOrDeletionNote
        detailsProgressEntryId={progressEntryId}
        file={file}
      />
    </Box>
  );
}
