/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FunctionComponent } from "react";

import {
  ApiAdminStagedEntityType,
  ApiStagingStatus,
} from "@eshg/service-directory-api";

import { SidebarEntityToDelete } from "@/lib/components/sidebar/SidebarEntityToDelete";
import { SidebarHeader } from "@/lib/components/sidebar/SidebarHeader";
import { SidebarTable } from "@/lib/components/sidebar/SidebarTable";
import { SidebarTableContent } from "@/lib/components/sidebar/SidebarTableContent";
import { EditButton } from "@/lib/components/table/cell/EditButtonCell";
import { getAdminName } from "@/lib/helpers/adminName";
import { Actor, OrgUnit, Rule, isStagedEntity } from "@/lib/hooks/useEntities";

export interface SidebarCellInfo<TData extends OrgUnit | Actor | Rule> {
  id: keyof NonNullable<TData["entity"]> & string;
  cell: FunctionComponent<{
    id: keyof NonNullable<TData["entity"]> & string;
    optional?: boolean;
    options?: string[];
    editable: boolean;
    entity: TData;
  }>;
  optional?: boolean;
  options?: string[];
}

export function SidebarDetails<TData extends OrgUnit | Actor | Rule>({
  entity,
  headerCells,
  cells,
  naturalId,
}: Readonly<{
  entity?: TData;
  headerCells: SidebarCellInfo<TData>[];
  cells: SidebarCellInfo<TData>[];
  naturalId?: boolean;
}>) {
  if (!entity) return false;

  const editable =
    isStagedEntity(entity) &&
    entity.stagingStatus === ApiStagingStatus.WorkInProgress &&
    entity.author === getAdminName();

  if (
    isStagedEntity(entity) &&
    entity.stagedEntityType === ApiAdminStagedEntityType.Del
  ) {
    return (
      <SidebarEntityToDelete
        entity={entity}
        headerCells={headerCells}
        naturalId={naturalId}
      />
    );
  }

  return (
    <>
      <SidebarHeader
        headerCells={headerCells}
        entity={entity}
        editable={editable}
        editButton={<EditButton entity={entity} />}
      />
      <SidebarTable>
        <SidebarTableContent
          entity={entity}
          cells={cells}
          naturalId={naturalId}
          editable={editable}
        />
      </SidebarTable>
    </>
  );
}
