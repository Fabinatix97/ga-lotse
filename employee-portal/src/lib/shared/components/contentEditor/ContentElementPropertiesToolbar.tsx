/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ArrowDropDownOutlined from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlined from "@mui/icons-material/ArrowDropUpOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import {
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";

export function ContentElementPropertiesToolbar({
  moveable,
  deletable,
  onMoveDown,
  onMoveUp,
  onDelete,
}: {
  moveable: boolean;
  deletable: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  if (!moveable && !deletable) {
    return null; // no toolbar needed, no action possible
  }

  return (
    <>
      <Grid container>
        <Grid xs={6}>
          {moveable && (
            <Stack spacing={1}>
              <Typography level="title-md">Position</Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Nach oben verschieben">
                  <IconButton
                    variant="outlined"
                    color="primary"
                    aria-label="Nach oben verschieben"
                    onClick={onMoveUp}
                  >
                    <ArrowDropUpOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Nach unten verschieben">
                  <IconButton
                    variant="outlined"
                    color="primary"
                    aria-label="Nach unten verschieben"
                    onClick={onMoveDown}
                  >
                    <ArrowDropDownOutlined />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          )}
        </Grid>

        <Grid xs={6}>
          {deletable && (
            <Stack spacing={1}>
              <Typography level="title-md">Aktion</Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Ausgewähltes Element entfernen">
                  <IconButton
                    variant="outlined"
                    color="danger"
                    aria-label="Ausgewähltes Element entfernen"
                    onClick={onDelete}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          )}
        </Grid>
      </Grid>

      <Divider />
    </>
  );
}
