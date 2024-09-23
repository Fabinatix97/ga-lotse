/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Typography } from "@mui/joy";

import {
  FileCardWithActions,
  FileCardWithActionsProps,
} from "./FileCardWithActions";

export function FileOrDeletionNote(props: FileCardWithActionsProps) {
  return props.file.deleted ? (
    <DeletionNote />
  ) : (
    <FileCardWithActions {...props} />
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
