/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, styled } from "@mui/joy";
import { ReactNode } from "react";

import { SidebarCellInfo } from "@/lib/components/sidebar/SidebarDetails";
import { SidebarData } from "@/lib/components/sidebar/SidebarTable";
import { Actor, OrgUnit, Rule } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

export function SidebarHeader<TData extends OrgUnit | Actor | Rule>({
  editButton,
  headerCells,
  entity,
  editable,
  additionalContent,
}: Readonly<{
  editButton: ReactNode;
  headerCells: SidebarCellInfo<TData>[];
  entity: TData;
  editable: boolean;
  additionalContent?: ReactNode;
}>) {
  const { t } = useTranslation();

  return (
    <Stack paddingTop={2} justifyContent="space-between" alignItems="center">
      <Stack flexDirection="column" gap={0.4}>
        {headerCells.map((cell) => (
          <>
            <InvisibleLabel id={cell.id}>
              {t(`columnHeader.${cell.id}`)}
            </InvisibleLabel>
            <SidebarData
              key={cell.id}
              entity={entity}
              cell={cell}
              editable={editable}
            />
          </>
        ))}
        {additionalContent}
      </Stack>
      <Stack gap={1}>{editButton}</Stack>
    </Stack>
  );
}

const InvisibleLabel = styled("label")({
  display: "none",
});
