/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiInboxProgressEntryFileReference } from "@eshg/employee-portal-api/businessProcedures";
import { Typography } from "@mui/joy";

import { FileCardWithActions } from "./FileCardWithActions";

export function FileOrDeletionNote(props: {
  fileReference: ApiInboxProgressEntryFileReference;
  progressEntryId: string;
}) {
  const { fileReference, progressEntryId } = props;
  if (fileReference.deleted) {
    return <DeletionNote />;
  }

  if (fileReference.type === "GenericFileReference") {
    // Only deleted files a returned as reference
    return null;
  }

  return (
    <FileCardWithActions
      file={fileReference}
      detailsProgressEntryId={progressEntryId}
    />
  );
}

export function DeletionNote() {
  return (
    <Typography
      data-testid="fileDeletionNote"
      color="danger"
      fontStyle="italic"
      level="body-sm"
    >
      Datei gelöscht
    </Typography>
  );
}
