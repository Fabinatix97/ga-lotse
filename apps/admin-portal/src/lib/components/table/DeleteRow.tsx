/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Stack, Typography, styled } from "@mui/joy";
import { ReactNode } from "react";

import { OverridableTableRowProps } from "@/lib/components/table/TableRow";
import { StagedRowButtons } from "@/lib/components/table/cell/EditButtonCell";
import { EntityWrapper, isStagedEntity } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

export function DeleteRow<TData extends EntityWrapper>({
  row,
}: Pick<OverridableTableRowProps<TData>, "row">): ReactNode {
  const { t } = useTranslation();

  if (!isStagedEntity(row.original)) {
    throw new Error("staged entity expected");
  }

  return (
    <Stack align-items="center" justifyContent="space-between">
      <STypography>
        {t("deleteHint", { author: row.original.author })}
      </STypography>
      <Box pr={1}>
        <StagedRowButtons entity={row.original} />
      </Box>
    </Stack>
  );
}

const STypography = styled(Typography)({
  textAlign: "center",
  flex: 1,
});
