/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiInboxProgressEntryFileReference } from "@eshg/lib-procedures-api";
import { Box } from "@mui/joy";
import { isDefined } from "remeda";

import { FileOrDeletionNote } from "@/lib/shared/components/procedures/progress-entries/FileOrDeletionNote";

export function EntryFile(props: {
  fileReference: ApiInboxProgressEntryFileReference | undefined;
  progressEntryId: string;
}) {
  if (!isDefined(props.fileReference)) {
    return null;
  }

  const { progressEntryId, fileReference } = props;
  return (
    <Box display="flex" justifyContent="flex-start">
      <FileOrDeletionNote
        progressEntryId={progressEntryId}
        fileReference={fileReference}
      />
    </Box>
  );
}
