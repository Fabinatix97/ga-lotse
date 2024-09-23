/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import { Grid, IconButton, Typography } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

interface SectionHeaderProps {
  id: string;
  title: string;
  onDelete?: () => void;
  onEdit?: () => void;
  buttons?: ReactNode;
}

export function SectionHeader({
  id,
  title,
  onDelete,
  onEdit,
  buttons,
}: SectionHeaderProps) {
  return (
    <Grid container direction="row" alignItems="center" xs={12} gap={1}>
      <Grid container>
        <Typography id={id} level="h4" component="h2">
          {title}
        </Typography>
      </Grid>
      <Grid container direction="row" gap={1} sx={{ marginLeft: "auto" }}>
        {buttons}
        {isDefined(onDelete) && (
          <IconButton
            aria-label={`${title} löschen`}
            color="primary"
            variant="outlined"
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        )}
        {isDefined(onEdit) && (
          <IconButton
            aria-label={`${title} ändern`}
            color="primary"
            variant="outlined"
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
}
