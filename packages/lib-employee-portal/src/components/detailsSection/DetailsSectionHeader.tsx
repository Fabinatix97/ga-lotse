/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

interface DetailsSectionHeaderProps {
  id: string;
  title: string;
  onDelete?: () => void;
  onEdit?: () => void;
  buttons?: ReactNode;
}

export function DetailsSectionHeader({
  id,
  title,
  onDelete,
  onEdit,
  buttons,
}: DetailsSectionHeaderProps) {
  return (
    <Grid container direction="row" alignItems="center" xs={12} gap={1}>
      <Grid container>
        <Typography id={id} level="h4" component="h2">
          {title}
        </Typography>
      </Grid>
      <Grid container direction="row" gap={1} sx={{ marginLeft: "auto" }}>
        {buttons}
        {/* TODO: ISSUE-5586: This is technical debt. These actions should be included via a wrapping component or by adding these controls in the component that uses it. */}
        {isDefined(onDelete) && (
          <IconButton
            aria-label={`${title} löschen`}
            color="primary"
            variant="outlined"
            onClick={onDelete}
          >
            <DeleteOutlined />
          </IconButton>
        )}
        {isDefined(onEdit) && (
          <IconButton
            aria-label={`${title} ändern`}
            color="primary"
            variant="outlined"
            onClick={onEdit}
          >
            <EditOutlined />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
}
