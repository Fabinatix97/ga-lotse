/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SidebarCellInfo } from "@/lib/components/sidebar/SidebarDetails";
import { SidebarHeader } from "@/lib/components/sidebar/SidebarHeader";
import { SidebarTable } from "@/lib/components/sidebar/SidebarTable";
import { SidebarTableContent } from "@/lib/components/sidebar/SidebarTableContent";
import { EditButton } from "@/lib/components/table/cell/EditButtonCell";
import { Actor, OrgUnit, Rule, isStagedEntity } from "@/lib/hooks/useEntities";
import { useTranslation } from "@/lib/i18n/client";

export function SidebarEntityToDelete<TData extends OrgUnit | Actor | Rule>({
  entity,
  headerCells,
  naturalId,
}: Readonly<{
  entity?: TData;
  headerCells: SidebarCellInfo<TData>[];
  naturalId?: boolean;
}>) {
  const { t } = useTranslation();
  if (!entity) return false;

  if (!isStagedEntity(entity)) {
    throw new Error("Entity is not staged");
  }
  const parent = entity._parent as TData | undefined;
  if (!parent) {
    throw new Error("Entity is not staged");
  }

  return (
    <>
      <SidebarHeader
        headerCells={headerCells}
        entity={parent}
        editable={false}
        additionalContent={t("delete")}
        editButton={<EditButton entity={entity} />}
      />
      <SidebarTable>
        <SidebarTableContent
          entity={entity}
          cells={[]}
          naturalId={naturalId}
          editable={false}
        />
      </SidebarTable>
    </>
  );
}
