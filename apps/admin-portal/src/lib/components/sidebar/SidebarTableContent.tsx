/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SidebarCellInfo } from "@/lib/components/sidebar/SidebarDetails";
import { SidebarData, SidebarRow } from "@/lib/components/sidebar/SidebarTable";
import { entityToString } from "@/lib/helpers/entityToString";
import { Actor, OrgUnit, Rule, isStagedEntity } from "@/lib/hooks/useEntities";

export function SidebarTableContent<TData extends OrgUnit | Actor | Rule>({
  entity,
  cells,
  naturalId,
  editable,
}: Readonly<{
  entity: TData;
  cells: SidebarCellInfo<TData>[];
  naturalId?: boolean;
  editable: boolean;
}>) {
  return (
    <>
      {" "}
      {isStagedEntity(entity) && (
        <SidebarRow title="columnHeader.author">{entity.author}</SidebarRow>
      )}
      {cells.map((cell) => (
        <SidebarRow
          key={cell.id}
          labelId={cell.id}
          title={`columnHeader.${cell.id}`}
        >
          <SidebarData entity={entity} cell={cell} editable={editable} />
        </SidebarRow>
      ))}
      {naturalId && (
        <SidebarRow title="columnHeader.naturalId">
          {entityToString(entity, true)}
        </SidebarRow>
      )}
      <SidebarRow title="columnHeader.id">{entity.id}</SidebarRow>
    </>
  );
}
