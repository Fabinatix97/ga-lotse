/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Stack, Typography, styled } from "@mui/joy";
import { ReactNode } from "react";

import { TableApi } from "@/lib/components/table/EditableTable";
import { OverridableTableRowProps } from "@/lib/components/table/TableRow";
import { StagedRowButtons } from "@/lib/components/table/addEditColumns";
import { EditableEntity, UniqueEntity } from "@/lib/helpers/entities";
import {
  OneOfStagedEntity,
  isOneOfStagedEntity,
} from "@/lib/helpers/entityFilter";
import { useTranslation } from "@/lib/i18n/client";

export function DeleteRow<TData extends EditableEntity & UniqueEntity>({
  table,
  row,
}: OverridableTableRowProps<TData>): ReactNode {
  const { t } = useTranslation();

  if (!isOneOfStagedEntity(row.original)) {
    throw new Error("staged entity expected");
  }

  const api = table.options.meta?.api as
    | TableApi<OneOfStagedEntity>
    | undefined;

  return (
    <Stack align-items="center" justifyContent="space-between">
      <STypography>
        {t("deleteHint", { author: row.original.author })}
      </STypography>
      <Box pr={1}>
        <StagedRowButtons api={api} row={row.original} />
      </Box>
    </Stack>
  );
}

const STypography = styled(Typography)({
  textAlign: "center",
  flex: 1,
});
