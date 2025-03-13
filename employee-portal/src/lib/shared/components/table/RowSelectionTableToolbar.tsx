/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import SubdirectoryArrowRightOutlined from "@mui/icons-material/SubdirectoryArrowRightOutlined";
import { Divider, Sheet, Stack, Typography, styled } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";
import { PropsWithChildren } from "react";

import { mapToRowIds } from "@/lib/shared/hooks/table/useRowSelection";

const StyledSheet = styled(Sheet)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 0,
  height: 40,
}));

interface RowSelectionTableToolbarProps {
  rowSelection: RowSelectionState;
  elementName: {
    singular: string;
    plural: string;
  };
}

export function RowSelectionTableToolbar(
  props: PropsWithChildren<RowSelectionTableToolbarProps>,
) {
  const rowIds = mapToRowIds(props.rowSelection);

  return (
    <StyledSheet variant="soft">
      <Stack direction="row" gap={2} alignItems={"center"}>
        <SubdirectoryArrowRightOutlined
          size={"sm"}
          color={"neutral"}
          sx={{
            rotate: "90deg",
          }}
        />
        <Typography
          level="body-sm"
          data-testid="selectedIndicator"
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
            <Divider orientation={"vertical"} sx={{ marginY: 1 }} />
            {props.children}
          </>
        )}
      </Stack>
    </StyledSheet>
  );
}
