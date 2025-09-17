/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubdirectoryArrowRightOutlined } from "@mui/icons-material";
import {
  Button,
  ColorPaletteProp,
  Divider,
  Sheet,
  Stack,
  Typography,
  styled,
} from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";
import { ReactNode } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

import { mapRowSelectionToRowIds } from "../../hooks/useRowSelection";

const StyledSheet = styled(Sheet)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 0,
  height: 40,
}));

interface RowSelectionTableToolbarProps extends RequiresChildren {
  rowSelection: RowSelectionState;
  elementName: {
    singular: string;
    plural: string;
  };
}

export function RowSelectionTableToolbar(props: RowSelectionTableToolbarProps) {
  const rowIds = mapRowSelectionToRowIds(props.rowSelection);

  return (
    <StyledSheet variant="soft">
      <Stack direction="row" gap={2} alignItems="center">
        <SubdirectoryArrowRightOutlined
          size="sm"
          color="neutral"
          sx={{
            rotate: "90deg",
          }}
        />
        <Typography
          level="body-sm"
          data-testid="selectedIndicator"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <Typography fontWeight="bold">{rowIds.length}</Typography>{" "}
          {rowIds.length === 1
            ? props.elementName.singular
            : props.elementName.plural}
        </Typography>
        {props.children && (
          <>
            <Divider orientation="vertical" sx={{ marginY: 1 }} />
            {props.children}
          </>
        )}
      </Stack>
    </StyledSheet>
  );
}

interface ProcedureTableTitleButtonProps extends RequiresChildren {
  decorator?: ReactNode;
  isPending?: boolean;
  disabled?: boolean;
  onClick: () => Promise<void> | void;
  "data-testid"?: string;
  color?: ColorPaletteProp;
}

export function RowSelectionTableToolbarButton(
  props: ProcedureTableTitleButtonProps,
) {
  return (
    <Button
      data-testid={props["data-testid"]}
      startDecorator={props.decorator}
      variant="plain"
      color={props.color ?? "neutral"}
      size="sm"
      sx={{ padding: 0 }}
      loading={props.isPending}
      loadingPosition="start"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}
